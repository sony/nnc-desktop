#! /bin/bash
# Copyright 2024 Sony Group Corporation.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


# TODO, below code for backward compatibility

LOCAL_MAPPING_DIR='/opt/bucket'
LOCAL_PROJECTS_BUCKET='nncd-projects-rdc'
LOCAL_DATASETS_BUCKET='nncd-datasets-rdc'
LOCAL_DATASET_CACHE_BUCKET='nncd-dataset-cache-rdc'
LOCAL_MOUNT_POINT='/tmp/nncd-local-editor'
mkdir -p ${LOCAL_MOUNT_POINT}

# local directory
LOCAL_PROJECTS_DIR='projects-rdc'
LOCAL_DATASET_DIR='dataset-rdc'


SYNC_DIR_PARTS=()
DATASET_UNKNOWN='unknown'
CREATE_CACHE_COMPLETE='cache_index.csv'
SYNC_LOG='rsync_status.log'
INTERMEDIATE_DIR_NAME='outputs'

[[ -z "${JQ}" ]] && JQ="jq -Sc"
[[ -z "${CONSOLE_CLI}" ]] && CONSOLE_CLI="console_cli"
[[ -z "${NNABLA_CLI}" ]] && NNABLA_CLI="nnabla_cli"
[[ -z "${SC_UTIL}" ]] && SC_UTIL="nncd_console_cli_util"
[[ -z "${EXEC_CLI}" ]] && EXEC_CLI="console_cli"

LOCAL_UPLOAD_INTERVAL_SEC=3
NNABLA_ACTIVE_CHECK_INTERVAL_SEC=60

CONVERT_BATCH_SIZE=1

# error code
E_NNABLA_OOM='50016400'

#
# setup logging
#
if [[ "${LOG_LEVEL,,}" == "error" ]]
then
    LOG_LEVELS="CRITICAL,ERROR"
elif [[ "${LOG_LEVEL,,}" == "warning" ]]
then
    LOG_LEVELS="CRITICAL,ERROR,WARNING"
elif [[ "${LOG_LEVEL,,}" == "info" ]]
then
    LOG_LEVELS="CRITICAL,ERROR,WARNING,INFO"
elif [[ "${LOG_LEVEL,,}" == "debug" ]]
then
    LOG_LEVELS="CRITICAL,ERROR,WARNING,INFO,DEBUG"
else
    LOG_LEVELS="CRITICAL,ERROR,WARNING,INFO"
fi
OUTPUT_LOGFILE="$(pwd)/boot.log"

_logging()
{
    log_level=${1^^}
    shift
    [[ "${LOG_LEVELS}" != *"${log_level}"* ]] && return 0

    log_msg=$(echo "$*" \
              | awk -F'[\x01-\x1F\x7F]' '{print $NF}' \
              | sed -E 's|s3://[^/]+/||g')
    echo "$(date +'%F %T,%N' | cut -c -23)" \
         "[worker]: [${log_level}]: ${log_msg}" \
        | tee -a "${OUTPUT_LOGFILE}"
}

#
# parse worker args
#
JSON_PARAMS="$1"
if [[ -z ${JSON_PARAMS} ]]
then
    _logging critical "parameters is nothing."
    exec "/bin/bash"    # for DEBUG
    exit 1
elif echo "${JSON_PARAMS}" | ${JQ} . &> /dev/null
then
    TASK_ID="$(echo "${JSON_PARAMS}" | ${JQ} -r .task_id)"
    PRIORITY="$(echo "${JSON_PARAMS}" | ${JQ} -r .priority | grep -v null)"
    INSTANCE_GROUP="$(echo "${JSON_PARAMS}" | ${JQ} -r .instance_group | grep -v null)"
    NNABLA_COMMAND="$(echo "${JSON_PARAMS}" | ${JQ} -r .command | grep -v null)"
    PARALLEL_NUM="$(echo "${JSON_PARAMS}" | ${JQ} -r .parallel_num | grep -v null)"
    LOCAL_CONFIG_FILE="$(echo "${JSON_PARAMS}" | ${JQ} -r .config | grep -v null)"
    LOCAL_PARAM_FILE="$(echo "${JSON_PARAMS}" | ${JQ} -r .param | grep -v null)"
    LOCAL_DATASET_CSV="$(echo "${JSON_PARAMS}" | ${JQ} -r .dataset | grep -v null)"
    LOCAL_OUTPUT_DIR="$(echo "${JSON_PARAMS}" | ${JQ} -r .outdir | grep -v null)"
    MUTATE_PATH="$(echo "${JSON_PARAMS}" | ${JQ} -r .mutate | grep -v null)"
    SS_ENABLE="$(echo "${JSON_PARAMS}" | ${JQ} -r .ss_enable | grep -v null)"
    SS_ATTEMPT_HOURS="$(echo "${JSON_PARAMS}" | ${JQ} -r .ss_attempt_hours | grep -v null)"
    SS_ATTEMPT_TIMES="$(echo "${JSON_PARAMS}" | ${JQ} -r .ss_attempt_times | grep -v null)"
    MULTI_MUTATE_NUM="$(echo "${JSON_PARAMS}" | ${JQ} -r .multi_mutate_num | grep -v null)"
    MUTATE_BASE_JOB_ID="$(echo "${JSON_PARAMS}" | ${JQ} -r .base_job_id | grep -v null)"
else
    _logging critical "illegal arguments."
    exit 1
fi


[[ ${LOCAL_DATASET_CSV} ]] &&
    LOCAL_DATASET_CSV="${LOCAL_MOUNT_POINT}/${LOCAL_DATASET_CSV}"
[[ ${LOCAL_DATASET_CSV} ]] && [[ ${LOCAL_DATASET_CSV} = *".csv" ]] &&
    LOCAL_DATASET_CSV="$(echo ${LOCAL_DATASET_CSV} | sed -E 's|/index.csv||g').cache"

#
# check nnabla command
#
case "${NNABLA_COMMAND}" in
    train)
        JOB_TYPE="train"
    ;;
    evaluate)
        JOB_TYPE="evaluate"
        NNABLA_COMMAND="forward"
    ;;
    profile)
        JOB_TYPE="profile"
    ;;
    *)
        _logging critical "Unknown nnabla command: ${NNABLA_COMMAND}"
        exit 1
    ;;
esac

if [[ -z "${LOCAL_OUTPUT_DIR}" ]]
then
    _logging critical "Not specified `outdir` parameter."
    exit 1
else
    mkdir -p ${LOCAL_OUTPUT_DIR} && \
    _logging info "mkdir ${LOCAL_OUTPUT_DIR}"
fi

#
# setup
#

CONF_SCRIPT_HOME="/home/nnabla"
BASE_DIR="$(pwd)"
# WORK_DIR="${BASE_DIR}/work"
# OUTPUT_DIR="${BASE_DIR}/results"
WORK_DIR="${BASE_DIR}/$2/work"
OUTPUT_DIR="${BASE_DIR}/$2/results"

NNCD_UTIL_SETTING_DIR="settings"
NNABLA_CONF="nnabla.conf"
REPORT_YAML="empty_monitoring_report.yml"
NNABLA_REMOTE_CONF="${CONF_SCRIPT_HOME}/nnabla_remote.conf"

LOG_FILENAME="${JOB_TYPE}_log.txt"
STATUS_FILENAME="${JOB_TYPE}_status.json"
TRAIN_NNP="result_train.nnp"
TRAIN_BEST_NNP="result_train_best.nnp"
TRAIN_LAST_NNP="result_train_last.nnp"
EVALUATE_NNP="result_evaluate.nnp"
MON_REPORT_YAML="monitoring_report.yml"
RESULT_INI="result.ini"
FORWARD_RESULT="output_result.csv"
CONFUSION_MATRIX="confusion_matrix.json"
PROFILE_RESULT="profile.csv"
MUTATE_SDCPROJ="data.sdcproj"
PARAM_ASSIGN="param_assign.csv"

OUTPUT_LOGFILE="${OUTPUT_DIR}/log.txt"
OUTPUT_STATUSFILE="${OUTPUT_DIR}/status.json"
OUTPUT_PROGRESS="${OUTPUT_DIR}/progress.txt"
OUTPUT_RESULT="${OUTPUT_DIR}/${FORWARD_RESULT}"
OUTPUT_PROFILE="${OUTPUT_DIR}/${PROFILE_RESULT}"

EMPTY_YAML="${BASE_DIR}/empty_monitoring_report.yml"
WORK_RESULT_INI="${WORK_DIR}/${RESULT_INI}"
WORK_MATRIX="${WORK_DIR}/${CONFUSION_MATRIX}"
OUTPUT_PARAM_ASSIGN="${WORK_DIR}/${PARAM_ASSIGN}"

NNABLA_OOM_CHECKFILE="${OUTPUT_DIR}/nnabla_oom.txt"

rm -rf ${WORK_DIR} ${OUTPUT_DIR}
mkdir -p ${WORK_DIR} ${OUTPUT_DIR}

#
# initialize log.txt, status.json
# see.) job_status.py in nnabla.patch
#
touch ${OUTPUT_LOGFILE}
current_timestamp="$(date +%s.%N)"
status_json=$(echo "{}" |
    ${JQ} '
        .task_id='${TASK_ID}' |
        .type="'${JOB_TYPE}'" |
        .status="preprocessing" |
        .start_time='${current_timestamp}' |
        .update_timestamp='${current_timestamp}' |
        .priority="'${PRIORITY}'" |
        .instance_group='${INSTANCE_GROUP}'
    ')
case "${JOB_TYPE}" in
    train)
        status_json=$(echo "${status_json}" |
            ${JQ} '
                .monitoring_report={} |
                .epoch={"current":0, "max":0} |
                .best={} |
                .last={} |
                .time={"elapsed":0, "prediction":0}
            ')
    ;;
    evaluate)
        status_json=$(echo "${status_json}" |
            ${JQ} '
                .data={"current":0, "max":0} |
                .time={"elapsed":0, "prediction":0}
            ')
    ;;
    profile)
    ;;
    *)
    ;;
esac
echo "${status_json}" > "${OUTPUT_STATUSFILE}"


#
# cp nncd_console_cli_util settings to workspace
# for nncd_console_cli_util usage
# 
# applied nnabla.conf priority :
# env_variable NNABLA_CONFIG_FILE_PATH > current dir > whl installed dir
#
echo "cp nncd_console_cli_util config to ${BASE_DIR}"
echo "cp config to ${BASE_DIR}"
[[ ! -d "${NNCD_UTIL_SETTING_DIR}" ]] &&  cp -rf "${CONF_SCRIPT_HOME}/${NNCD_UTIL_SETTING_DIR}" "${BASE_DIR}"
[[ ! -f "${EMPTY_YAML}" ]] && cp -f "${CONF_SCRIPT_HOME}/${REPORT_YAML}" "${BASE_DIR}"
[[ ! -f "${NNABLA_CONF}" ]] && cp -f "${CONF_SCRIPT_HOME}/${NNABLA_CONF}" "${BASE_DIR}"
#
#
#
preprocess_exit_handler()
{
    _logging error "failed to preprocessing."

    current_timestamp="$(date +%s.%N)"
    cat ${OUTPUT_STATUSFILE} |
        ${JQ} '
            .status="failed" |
            .time.elapsed='${current_timestamp}'-.start_time |
            .end_time='${current_timestamp}' |
            .update_timestamp='${current_timestamp}'
        ' > /tmp/s.json \
        && mv /tmp/s.json "${OUTPUT_STATUSFILE}"
    cp "${OUTPUT_STATUSFILE}" "${LOCAL_OUTPUT_DIR}/${STATUS_FILENAME}" \
          | _logging debug $(cat -)
    cp "${OUTPUT_LOGFILE}" "${LOCAL_OUTPUT_DIR}/${LOG_FILENAME}" \
          | _logging debug $(cat -)
}
trap preprocess_exit_handler EXIT

#
# get project id and job id
#

if [[ "${LOCAL_OUTPUT_DIR}" =~ ^${LOCAL_MAPPING_DIR}/${LOCAL_PROJECTS_BUCKET}/([0-9]+)/results/([0-9]+)$ ]]
then
    project_id="${BASH_REMATCH[1]}"
    job_id="${BASH_REMATCH[2]}"
fi

###############################################################################
#
# neural network configuration
#

#
# GET sdcproj
#

if [[ "${LOCAL_CONFIG_FILE}" ]]
then
    _config_filename="$(basename ${LOCAL_CONFIG_FILE})"
    if [[ "${_config_filename##*.}" == "sdcproj" ]]
    then
        SDCPROJ_FILE="${WORK_DIR}/${_config_filename}"
        #
        # MUTATE NETWORK CONFIG (for STRUCTURE SEARCH)
        #
        if [[ "${MUTATE_PATH}" ]]
        then
            _logging info "Network structure auto searching, mutate .sdcproj"

            MUTATE_CSV="${WORK_DIR}/mutate/candidates.csv"
            MUTATE_SDCPROJ_DIR="${WORK_DIR}/mutate/sdcproj"
            mkdir -p ${MUTATE_SDCPROJ_DIR}

            # CREATE CSV
            MUTATE_DATA_FILE="$(basename ${MUTATE_PATH})"
            cp -vf "${MUTATE_PATH}" "${WORK_DIR}/${MUTATE_DATA_FILE}" \
                    | _logging debug "cp $(cat -)" \
                    || exit 1
            rm -rf "${MUTATE_PATH}"
            MUTATE_JSON=`cat ${WORK_DIR}/${MUTATE_DATA_FILE}`

            base_dir=$(echo "${MUTATE_JSON}" | ${JQ} -r '.base_dir' | fgrep -v null)
            if [[ "${base_dir}" ]]
            then
                jq_csv_script='
                    .candidates[] | [
                        "'${MUTATE_SDCPROJ_DIR}'/\(.[0]).sdcproj",
                        .[2],
                        .[3]
                    ] | @csv
                '
                jq_dl_script='
                    .candidates[] |
                        "'${base_dir}'/\(.[1])\t'${MUTATE_SDCPROJ_DIR}'/\(.[0]).sdcproj"
                '
            else
                # TODO this code is for backward comaptibility
                jq_csv_script='
                    .candidates[] | [
                        "'${MUTATE_SDCPROJ_DIR}'/\(.job_id).sdcproj",
                        .best_valid_error,
                        .cost_multiply_add
                    ] | @csv
                '
                jq_dl_script='
                    .candidates[] |
                        "\(.sdcproj_path)\t'${MUTATE_SDCPROJ_DIR}'/\(.job_id).sdcproj"
                '
            fi
            # note. REMOVE D-QUOTE for nncd_console_cli_util
            echo "${MUTATE_JSON}" | ${JQ} -r "${jq_csv_script}" | sed 's/"//g' \
                > ${MUTATE_CSV}

            # TODO: nncd_console_cli_util can't read 1 LINE CSV FILE
            if [[ $(wc -l ${MUTATE_CSV} | awk '{print $1}') == 1 ]]
            then
                echo $(cat ${MUTATE_CSV}) >> ${MUTATE_CSV}
            fi

            # DOWNLOAD SDCPROJ
            _logging info "Download mutate network candidates"
            echo "${MUTATE_JSON}" | ${JQ} -r "${jq_dl_script}" |
            while read src dest
            do
                cp -rvf "${src}" "${dest}" | _logging debug "cp $(cat -)"
                if [ ! -s "${dest}" ]
                then
                    _logging warning \
                        "${src}: empty sdcproj, remove from candidates."

                    # REMOVE EMPTY sdcproj
                    fgrep -v "${dest}" ${MUTATE_CSV} \
                          > ${WORK_DIR}/_tmp.csv
                    mv ${WORK_DIR}/_tmp.csv ${MUTATE_CSV}
                fi
            done

            # MUTATE NETWORK
            _logging info \
                ${SC_UTIL}' structure_search' \
                '-i "'${MUTATE_CSV}'"' \
                '-o "'${SDCPROJ_FILE}'"'
            ${SC_UTIL} structure_search \
                -i "${MUTATE_CSV}" \
                -o "${SDCPROJ_FILE}" \
            || exit 1
            if [[ ! -f "${SDCPROJ_FILE}" ]]
            then
                _logging error "failed to mutate network: ${SDCPROJ_FILE}"
                exit 1
            fi
            _logging info "Created mutate network: ${SDCPROJ_FILE}"

            # UPLOAD MUTATE NETWORK
            LOCAL_MUTATE_SDCPROJ_FILE="$(dirname ${LOCAL_CONFIG_FILE})/${MUTATE_SDCPROJ}"
            cp -rvf "${SDCPROJ_FILE}" "${LOCAL_MUTATE_SDCPROJ_FILE}" \
                | _logging debug "cp $(cat -)" \
                || exit 1
            SS_ENABLE=1
        else
            cp -v "${LOCAL_CONFIG_FILE}" "${SDCPROJ_FILE}" \
                | _logging info "cp $(cat -)" \
                || exit 1
            if [ ! -s "${SDCPROJ_FILE}" ]
            then
                _logging error "${LOCAL_CONFIG_FILE}: sdcproj is empty."
                exit 1
            fi
            if [[ ! ${SS_ENABLE} ]]
            then
                ss_enabled=$(structure_search_enabled.py "${SDCPROJ_FILE}")
                if [[ ${ss_enabled} == 1 ]]
                then
                    _logging info "Structure search setting is True"
                    SS_ENABLE=1
                fi
            elif [[ ${SS_ENABLE} == 1 ]]
            then
                _logging info "Structure search setting is True"
            fi
        fi
    fi
fi

# GET LEARNED PARAMETER IF EXISTS

LATEST_NNP=$(ls -v "${LOCAL_OUTPUT_DIR}/results_current_"* 2> /dev/null|
            tail -n 1 | awk -F'/' '{print $NF}')
BEST_NNP=$(ls -v "${LOCAL_OUTPUT_DIR}/results_best_"* 2> /dev/null|
            tail -n 1 | awk -F'/' '{print $NF}')
#0epoch train
if [[ -z "${LATEST_NNP}" && -z "${BEST_NNP}" ]]
then
    LATEST_NNP=$(ls "${LOCAL_OUTPUT_DIR}/results.nnp" | awk '{print $4}')
    BEST_NNP=${LATEST_NNP}
fi

if [[ "${LATEST_NNP}" ]]
then
    # DOWNLOAD ALL NNP FILES
    for nnp_file in \
        $(ls -v "${LOCAL_OUTPUT_DIR}/" | grep -Ee '.nnp$' | grep -Ev "${TRAIN_NNP}|${TRAIN_BEST_NNP}|${TRAIN_LAST_NNP}")
    do
        cp -v "${LOCAL_OUTPUT_DIR}/${nnp_file}" "${OUTPUT_DIR}/${nnp_file}" \
            | _logging info "cp $(cat -)"
    done

    # DOWNLOAD PARAM ASSIGN FILE IF EXISTS
    LATEST_PARAM_ASSIGN=$(ls "${LOCAL_OUTPUT_DIR}/${PARAM_ASSIGN}" | awk '{print $4}')
    if [[ "${LATEST_PARAM_ASSIGN}" ]]
    then
        cp -v "${LOCAL_OUTPUT_DIR}/${PARAM_ASSIGN}" "${OUTPUT_PARAM_ASSIGN}" \
            | _logging debug "cp $(cat -)"
    fi

    # OVERRIDE CONFIG FILE
    if [[ "${BEST_NNP}" && "${NNABLA_COMMAND}" == "forward" ]]
    then
        target_nnp_file=${BEST_NNP}
    else
        target_nnp_file=${LATEST_NNP}
    fi

    if [[ "${LOCAL_CONFIG_FILE}" ]]
    then
        _logging info \
            "Use config file: ${LOCAL_OUTPUT_DIR}/${target_nnp_file}," \
            "instead of config file: ${LOCAL_CONFIG_FILE}"
    fi
    LOCAL_CONFIG_FILE="${LOCAL_OUTPUT_DIR}/${target_nnp_file}"

    # THIS LOCAL DIRECTORY MUST BE OUTPUT_DIR (FOR console_cli)
    CONFIG_FILE="${OUTPUT_DIR}/${target_nnp_file}"

    # RESUME CHECK
    if [[ "${NNABLA_COMMAND}" == "train" ]]
    then
        _logging info "Resume training."
        NNABLA_COMMAND_RESUME="resume"

        # RESUME train log
        PREV_LOGFILE="${WORK_DIR}/prev_log.txt"
        cp -v "${LOCAL_OUTPUT_DIR}/${LOG_FILENAME}" "${PREV_LOGFILE}" \
            | _logging debug "cp $(cat -)"
        cat "${OUTPUT_LOGFILE}" >> "${PREV_LOGFILE}"
        mv "${PREV_LOGFILE}" "${OUTPUT_LOGFILE}"

        # RESUME status.json
        PREV_STATUSFILE="${WORK_DIR}/prev_status.json"
        cp -v "${LOCAL_OUTPUT_DIR}/${STATUS_FILENAME}" "${PREV_STATUSFILE}" \
            | _logging debug "cp $(cat -)"
        if [[ ! -s "${PREV_STATUSFILE}" ]]
        then
            echo "{}" > "${PREV_STATUSFILE}"
        fi
        status_json=$(${JQ} -s '
            .[1] as $new |
            .[0] |
            .status="preprocessing" |
            .task_id=$new.task_id |
            .start_time=$new.start_time |
            .time=$new.time |
            .update_timestamp=$new.update_timestamp |
            .priority="'${PRIORITY}'" |
            .instance_group='${INSTANCE_GROUP}' |
            del(.end_time) |
            del(.storage_used)
        ' "${PREV_STATUSFILE}" "${OUTPUT_STATUSFILE}")
        echo "${status_json}" > "${OUTPUT_STATUSFILE}"
    fi
fi

# log sync start
mkdir -p ${OUTPUT_DIR}/status

_sync_logs()
{
    SYNC_DIR="${OUTPUT_DIR}/status"

    # log.txt
    cat "${OUTPUT_LOGFILE}" "${OUTPUT_PROGRESS}" 2> /dev/null \
        > "${WORK_DIR}/${LOG_FILENAME}"
    if ! cmp -s "${WORK_DIR}/${LOG_FILENAME}" "${SYNC_DIR}/${LOG_FILENAME}"
    then
        mv "${WORK_DIR}/${LOG_FILENAME}" "${SYNC_DIR}/${LOG_FILENAME}"
    fi

    # status.json
    STATUS_JSON=$(cat ${OUTPUT_STATUSFILE} 2> /dev/null)
    current_time=$(date +%s.%N)
    STATUS_JSON=$(echo ${STATUS_JSON} |
                  ${JQ} '
                      .time.elapsed=(if has("end_time")
                                       then .end_time
                                       else '${current_time}'
                                     end)
                                    - .start_time |
                      .update_timestamp='${current_time}'
                  ')

    echo ${STATUS_JSON} | ${JQ} . > "${WORK_DIR}/${STATUS_FILENAME}"
    if ! cmp -s "${WORK_DIR}/${STATUS_FILENAME}" "${SYNC_DIR}/${STATUS_FILENAME}"
    then
        mv "${WORK_DIR}/${STATUS_FILENAME}" "${SYNC_DIR}/${STATUS_FILENAME}"
    fi

    mkdir -p ${LOCAL_OUTPUT_DIR} && cp -vrf \
        ${SYNC_DIR}/* ${LOCAL_OUTPUT_DIR}
}

_sync_logs_loop()
{
    while :
    do
        sleep ${LOCAL_UPLOAD_INTERVAL_SEC}
        _sync_logs
    done
}
_sync_logs_loop &
SYNC_LOG_LOOP_PID=$!

if [[ "${SDCPROJ_FILE}" ]]
then
    #
    # CALCURATE cost_multiply_add
    #
    _logging info \
        ${SC_UTIL}' create_result_ini' \
        '-i "'${SDCPROJ_FILE}'"' \
        '-y "'${EMPTY_YAML}'"' \
        '-o "'${WORK_RESULT_INI}'"'
    ${SC_UTIL} create_result_ini \
        -i "${SDCPROJ_FILE}" \
        -y "${EMPTY_YAML}" \
        -o "${WORK_RESULT_INI}" \
    || exit 1
    if [[ ! -f "${WORK_RESULT_INI}" ]]
    then
        _logging error "failed to create result.ini: ${WORK_RESULT_INI}"
        exit 1
    fi
    CMA_FIELD_NAME='cost_multiply_add='
    CMA_RECORD=$(grep -Fe "${CMA_FIELD_NAME}" ${WORK_RESULT_INI})
    COST_MULTIPLY_ADD=${CMA_RECORD#${CMA_FIELD_NAME}}
    if [[ -z "${COST_MULTIPLY_ADD}" ]]
    then
        _logging error "failed to calculate `cost_multiply_add` value"
        exit 1
    fi
    STATUS_JSON=$(cat ${OUTPUT_STATUSFILE} 2> /dev/null)
    STATUS_JSON=$(echo ${STATUS_JSON} |
                  ${JQ} ".cost_multiply_add=${COST_MULTIPLY_ADD}")

    STATISTICS=$(get_statistics.py "${WORK_RESULT_INI}")
    if [[ -z "${STATISTICS}" ]]
    then
        _logging error "failed to calculate network statistics"
        exit 1
    fi
    STATUS_JSON=$(echo ${STATUS_JSON} |
                  ${JQ} ".statistics=${STATISTICS}")
    echo ${STATUS_JSON} | ${JQ} . > "${OUTPUT_STATUSFILE}"

    cp -v "${EMPTY_YAML}" "${LOCAL_OUTPUT_DIR}/${MON_REPORT_YAML}"
    cp -v "${WORK_RESULT_INI}" "${LOCAL_OUTPUT_DIR}/${RESULT_INI}"
fi

# for first encountered config file
# GET/CONVERT CONFIG FILE
if [[ "${LOCAL_CONFIG_FILE}" && -z "${CONFIG_FILE}" ]]
then
    if [[ "${SDCPROJ_FILE}" ]]
    then
        CONFIG_FILE="${WORK_DIR}/network.prototxt"

        #
        # CREATE prototxt(nntxt)
        #
        _logging info \
            ${SC_UTIL}' create_prototxt' \
            '-i "'${SDCPROJ_FILE}'"' \
            '-o "'${CONFIG_FILE}'"' \
            '-p "'${OUTPUT_PARAM_ASSIGN}'"'
        ${SC_UTIL} create_prototxt \
            -i "${SDCPROJ_FILE}" \
            -o "${CONFIG_FILE}" \
            -p "${OUTPUT_PARAM_ASSIGN}" \
        || exit 1
        if [[ ! -f "${CONFIG_FILE}" ]]
        then
            _logging error "failed to create file: ${CONFIG_FILE}"
            exit 1
        fi
        cp -v "${OUTPUT_PARAM_ASSIGN}" "${LOCAL_OUTPUT_DIR}/${PARAM_ASSIGN}" \
              | _logging debug "cp $(cat -)"
    else
        #
        # .nnp/.nntxt/.prototxt
        #
        CONFIG_FILE="${WORK_DIR}/$(basename ${LOCAL_CONFIG_FILE})"
        cp -v "${LOCAL_CONFIG_FILE}" "${CONFIG_FILE}" \
            | _logging info "cp $(cat -)" \
            || exit 1
    fi

    # Expand Dataset URI and Change Dataset Cache Dir
    if [[ "${CONFIG_FILE##*.}" != "nnp" ]]
    then
        awk -f ${CONF_SCRIPT_HOME}/src/replace_dataset_local.awk \
            --assign=LOCAL_DATASETS_BUCKET="${LOCAL_DATASETS_BUCKET}" \
            --assign=LOCAL_MOUNT_POINT="${LOCAL_MOUNT_POINT}" \
            "${CONFIG_FILE}" \
            > "${WORK_DIR}/tmp.prototxt"
        mv "${WORK_DIR}/tmp.prototxt" "${CONFIG_FILE}"
        # Ensure Cache Parent Directory
        # /dataset-cache/ccbf15a0-bcb6-4ba6-b10e-27fc877c4348 -> /var/lib/nncd-local-editor/ccbf15a0-bcb6...
        awk -f ${CONF_SCRIPT_HOME}/src/extract_cache_dir.awk "${CONFIG_FILE}" \
            | xargs dirname | uniq | xargs mkdir -p

        _logging debug "expand dataset cache dir in ${CONFIG_FILE}"
    fi
fi

# check dataset cache
# for profile job in nncd
dataset_uri_list=""

if [[ "${NNABLA_COMMAND_RESUME}" ]]
then
    unzip -d ${WORK_DIR} "${CONFIG_FILE}" "network.prototxt"
    dataset_uri_list=`awk -f ${CONF_SCRIPT_HOME}/src/dataset_uri_list.awk "${WORK_DIR}/network.prototxt"`
elif [[ "${LOCAL_DATASET_CSV}" ]]
then
    dataset_uri_list="${LOCAL_DATASET_CSV}"
else
    dataset_uri_list=`awk -f ${CONF_SCRIPT_HOME}/src/dataset_uri_list.awk "${CONFIG_FILE}"`
fi

for dataset_uri in ${dataset_uri_list}
do
    # get tenant id and dataset id
    tenant_id=`echo ${dataset_uri} | sed 's/"//g' | awk -F'/' '{print $(NF-1)}'`
    dataset_id=`echo ${dataset_uri} | sed 's/"//g' | awk -F'/' '{print $NF}'`
    if [[ "${dataset_id}" =~ .cache$ ]]
    then
        dataset_id=${dataset_id%%.*}
    fi

    [[ "${DATASET_UNKNOWN}" = "${dataset_id}" ]] && continue

    DATASET_PATH_PARTS="${tenant_id}/${dataset_id}"
    ebs_path="${LOCAL_MOUNT_POINT}/${DATASET_PATH_PARTS}.cache"
    if [[ ! -e ${ebs_path}/${CREATE_CACHE_COMPLETE} ]]
    then
        [[ ${LOCAL_DATASET_CACHE_BUCKET} ]] && local_cache_path="${LOCAL_MAPPING_DIR}/${LOCAL_DATASET_CACHE_BUCKET}/${DATASET_PATH_PARTS}"
        if [[ ${local_cache_path} ]]
        then
            # cache mapping from .nncd_local_editor to container volume
            LOCAL_CACHE_COMPLETE=$(ls "${local_cache_path}/${CREATE_CACHE_COMPLETE}" | awk -F'/' '{print $NF}')
            if [[ ${LOCAL_CACHE_COMPLETE} ]]
            then
                _logging info "cache mapping (local_store -> docker volume: ${dataset_id})"
                mkdir -p $(dirname ${ebs_path})
                ln -s ${local_cache_path} ${ebs_path}
            fi
        fi
    fi
    rm -f ${ebs_path}/${SYNC_LOG}
done


# replace dataset cache dir
if [[ "${CONFIG_FILE##*.}" == "nnp" ]]
then
    unzip -o -d ${WORK_DIR} "${CONFIG_FILE}" "network.prototxt"
    awk -f ${CONF_SCRIPT_HOME}/src/replace_dataset_cache.awk \
        --assign=AWS_EBS_MOUNT_POINT="${LOCAL_MOUNT_POINT}" \
        "${WORK_DIR}/network.prototxt" \
        > "${WORK_DIR}/tmp.prototxt"
    mv "${WORK_DIR}/tmp.prototxt" "${WORK_DIR}/network.prototxt"
    zip -j "${CONFIG_FILE}" "${WORK_DIR}/network.prototxt"
fi

###############################################################################
#
# sync result files (log.txt, status.json, and so on.)
#

_sync_train_results()
{
    snapshot_dirs=($(ls -1t "${OUTPUT_DIR}" | fgrep snapshot | sort -nr))
    if [[ "${snapshot_dirs}" ]]
    then
        snapshot_dir="${snapshot_dirs}"
        if [[ ! -f "${result_ini}" && "${SDCPROJ_FILE}" ]]
        then
            echo "${SC_UTIL} create_result_ini" \
                '-i "'${SDCPROJ_FILE}'"' \
                '-y "'${OUTPUT_DIR}/${snapshot_dir}/${MON_REPORT_YAML}'"' \
                '-o "'${OUTPUT_DIR}/${snapshot_dir}/${RESULT_INI}'"'
            ${SC_UTIL} create_result_ini \
                -i "${SDCPROJ_FILE}" \
                -y "${OUTPUT_DIR}/${snapshot_dir}/${MON_REPORT_YAML}" \
                -o "${OUTPUT_DIR}/${snapshot_dir}/${RESULT_INI}"
        fi

        mkdir -p "${LOCAL_OUTPUT_DIR}" && cp -vrf \
            ${OUTPUT_DIR}/${snapshot_dir}/* "${LOCAL_OUTPUT_DIR}"

        for d in ${snapshot_dirs[@]}
        do
            [[ ${d} == ${snapshot_dir} ]] && continue
            rm -rf "${OUTPUT_DIR}/${d}"
        done

        # create weight parameter text from results_best_XX.nnp
        results_best_nnp=($(ls -1t "${OUTPUT_DIR}" | grep -E "results.nnp|results_best_.*.nnp"))
        if [[ -f "${OUTPUT_DIR}/${results_best_nnp}" ]]
        then
            param_output_dir_name="weight_param_text"
            param_output_dir_path="${OUTPUT_DIR}/${param_output_dir_name}"
            ${EXEC_CLI} decode_param -p "${OUTPUT_DIR}/${results_best_nnp}" -o ${param_output_dir_path} 2>&1
            mkdir -p ${LOCAL_OUTPUT_DIR}/${param_output_dir_name} && \
            cp -vrf ${param_output_dir_path}/* ${LOCAL_OUTPUT_DIR}/${param_output_dir_name}
            rm -rf ${param_output_dir_path}
        fi

        # REMOVE OLD NNP (cuurent/best)
        for prefix in "results_current_" "results_best_"
        do
            nnp_list=($(ls -v ${LOCAL_OUTPUT_DIR}/${prefix}* 2> /dev/null \
                | awk -F'/' '{print $NF}' \
                | tac ))
            retain_nnp=${nnp_list}
            for f in ${nnp_list[@]}
            do
                [[ ${f} == ${retain_nnp} ]] && continue
                rm -f "${LOCAL_OUTPUT_DIR}/${f}"
            done
        done
    fi
}

_sync_forward_results()
{
    if [[ -d "${OUTPUT_DIR}/${INTERMEDIATE_DIR_NAME}" ]]
    then
        mkdir -p ${LOCAL_OUTPUT_DIR}/${INTERMEDIATE_DIR_NAME} && cp -rf \
            ${OUTPUT_DIR}/${INTERMEDIATE_DIR_NAME}/* ${LOCAL_OUTPUT_DIR}/${INTERMEDIATE_DIR_NAME}
    fi
}

_sync_wait()
{
    COUNT=30
    #s3 alter while pgrep aws > /dev/null
    #need wait nnabla-ssh？
    while pgrep '\<cp\>' > /dev/null
    do
        sleep 1
        COUNT=$((${COUNT} - 1))
        if [[ 0 -gt ${COUNT} ]]
        then
            break
        fi
    done
}

###############################################################################
#
# start worker
#

# start worker backgroud tasks
_sync_results_loop()
{
    while :
    do
        sleep ${LOCAL_UPLOAD_INTERVAL_SEC}

        if [[ "${NNABLA_COMMAND}" == "train" ]]
        then
            _sync_train_results
        elif [[ "${NNABLA_COMMAND}" == "forward" ]]
        then
            _sync_forward_results
        fi
    done
}
_sync_results_loop &
SYNC_RESULTS_LOOP_PID=$!

#
# update exit handler
#
sync_handler()
{
    kill ${SYNC_RESULTS_LOOP_PID} 2> /dev/null && sleep 0.5
    kill ${SYNC_LOG_LOOP_PID} 2> /dev/null && sleep 0.5
    kill ${NNABLA_ACTIVE_CHECK_LOOP_PID} 2> /dev/null && sleep 0.5
    kill ${NNABLA_MEMORY_CHECK_LOOP_PID} 2> /dev/null && sleep 0.5

    _sync_logs | while read line
    do
        _logging debug ${line}
    done

    _sync_wait
}
trap sync_handler EXIT

#
# construct console_cli arguments
#
ARGS="${NNABLA_COMMAND}"
[[ "${NNABLA_COMMAND_RESUME}" ]] && ARGS="${ARGS} -r"

[[ ${LOCAL_CONFIG_FILE} ]] && ARGS="${ARGS} -c ${CONFIG_FILE}"
[[ ${LOCAL_PARAM_FILE} ]] && ARGS="${ARGS} -p ${LOCAL_PARAM_FILE}"
[[ ${LOCAL_OUTPUT_DIR} ]] && ARGS="${ARGS} -o ${OUTPUT_DIR}"

if [[ ${LOCAL_DATASET_CSV} ]]
then
    if [[ ${LOCAL_DATASET_CSV} = *".cache" && ${INSTANCE_GROUP} != 1 ]]
    then
        # When use nnabla-ssh, -d option need change .cache file to .csv file
        rel_path="$(echo ${LOCAL_DATASET_CSV} | awk -F'/' '{print $(NF-1)"/"$(NF)}' | sed -E 's|.cache|/index.csv|g')"
        ARGS="${ARGS} -d ${LOCAL_MAPPING_DIR}/${LOCAL_DATASETS_BUCKET}/${rel_path}"
    else
        ARGS="${ARGS} -d ${LOCAL_DATASET_CSV}"
    fi
fi

if [[ "${JOB_TYPE}" == "train" && "${SDCPROJ_FILE}" ]]
then
    # SET SDCPROJ FILE
    ARGS="${ARGS} -s ${SDCPROJ_FILE} -a ${OUTPUT_PARAM_ASSIGN}"

    # CHECK JOB ID PARAMS
    JOB_URL_LIST_FILE="${WORK_DIR}/job_url_list.txt"
    job_url_list_local.py "${project_id}" "${SDCPROJ_FILE}" > ${JOB_URL_LIST_FILE}
    if [[ -s ${JOB_URL_LIST_FILE} ]]
    then
        # APPEND JOB URL LIST
        ARGS="${ARGS} -j ${JOB_URL_LIST_FILE}"
    fi
fi

[[ "${NNABLA_COMMAND}" == "forward" ]] && ARGS="${ARGS} --result_outdir ${INTERMEDIATE_DIR_NAME}"

#
# start console_cli process check
#
_nnabla_active_check_loop()
{
    comp_progress_sum=''
    comp_log_sum=''
    check_cnt=0
    timeout_min=15
    while :
    do
        if [[ ! -e ${OUTPUT_PROGRESS} || ! -e ${OUTPUT_LOGFILE} ]]
        then
            sleep 1
            continue
        fi
        new_progress_sum=$(md5sum ${OUTPUT_PROGRESS} | awk '{print $1}')
        new_log_sum=$(md5sum ${OUTPUT_LOGFILE} | awk '{print $1}')

        if [[ "${comp_progress_sum}" = "${new_progress_sum}" && "${comp_log_sum}" = "${new_log_sum}" ]]
        then
            check_cnt=$((${check_cnt} + 1))
        else
            check_cnt=0
        fi
        comp_progress_sum=${new_progress_sum}
        comp_log_sum=${new_log_sum}

        if [[ ${check_cnt} = ${timeout_min} ]]
        then
            nnabla_pid=$(pgrep -f "$1")
            if [[ -n "${nnabla_pid}" ]]
            then
                kill ${nnabla_pid}
            fi
            _logging error "nnabla is not running for ${timeout_min} minutes"
            break
        fi
        sleep ${NNABLA_ACTIVE_CHECK_INTERVAL_SEC}
    done
}

#
# start console_cli memory check
#
FREE_TOTAL=$(free -t | grep "Total" | awk '{print $4}')
_nnabla_memory_check_loop()
{
    # create oom file when used memory exceeds 95%
    oom_check_line=95

    while :
    do
        check_free=$(free -t | grep "Total" | awk '{print $3}')
        memory_usage=$(echo "scale=2; ${check_free} / ${FREE_TOTAL} * 100" | bc | awk -F'.' '{print $1}')
        [[ ${memory_usage} -ge ${oom_check_line} ]] && break
        sleep 1
    done
    echo "$(date) : nnabla out of memory" > ${NNABLA_OOM_CHECKFILE}
}
_nnabla_memory_check_loop &
NNABLA_MEMORY_CHECK_LOOP_PID=$!

#
#
#

# execute command
if [[ ${INSTANCE_GROUP} != 1 ]]
then
    # nnabla_ssh
    EXEC_CLI="${NNABLA_CLI}"
    export NNABLA_CONFIG_FILE_PATH=${NNABLA_REMOTE_CONF}
else
    #console_cli
    if [[ ${PARALLEL_NUM} != 1 ]]
    then
        EXEC_CLI="${CONSOLE_CLI}"
        ARGS="--multi ${PARALLEL_NUM} ${ARGS}"
    fi
fi

_nnabla_active_check_loop ${EXEC_CLI} &
NNABLA_ACTIVE_CHECK_LOOP_PID=$!

_logging info "${EXEC_CLI} ${ARGS}"
${EXEC_CLI} ${ARGS} 2>&1 | tee -a "${OUTPUT_LOGFILE}"
NNABLA_RESULT_STATUS=$?


# command error check
complete=`grep -c -E "\[nnabla\]: Profile Completed.|\[nnabla\]: Training Completed.|\[nnabla\]: Forward Completed." ${OUTPUT_LOGFILE}`
if [[ ${complete} == 0 ]]
then
    NNABLA_RESULT_STATUS=-1
    _logging error "${EXEC_CLI} command is failed."
fi

# stop worker backgroud tasks
sync_handler

#
# RESULTS HANDLING
#
last_status=$(cat "${OUTPUT_STATUSFILE}" | ${JQ} -r '.status')
if [[ "${last_status}" != "finished" && ${NNABLA_RESULT_STATUS} == 0 ]]
then
    # OVERRIDDEN EXIT STATUS of console_cli
    NNABLA_RESULT_STATUS=-1
    _logging error "${EXEC_CLI} command is unexpected ended."
fi

if [[ "${JOB_TYPE}" == "train" && "${SS_ENABLE}" == 1 ]]
then
    #
    # STRUCTURE SEARCH
    #
    if [[ "${MUTATE_JSON}" ]]
    then
        # UPDATE MUTATE STATUS
        mutate_start_time=$(echo ${MUTATE_JSON} | jq .start_time)
        mutate_count=$(($(echo ${MUTATE_JSON} | jq .count) + 1))
        _logging info \
            "Network structure auto searching," \
            "count $((${mutate_count} - 1)) done"
    else
        # NEW MUTATE STATUS
        mutate_start_time=$(date +"%s.%N")
        mutate_count=1
        _logging info "Begin network structure auto searching."
    fi

    [[ ! "${SS_ATTEMPT_HOURS}" ]] && SS_ATTEMPT_HOURS=0
    [[ ! "${SS_ATTEMPT_TIMES}" ]] && SS_ATTEMPT_TIMES=0
    [[ ! "${MULTI_MUTATE_NUM}" ]] && MULTI_MUTATE_NUM=1
    [[ ! "${MUTATE_BASE_JOB_ID}" ]] && MUTATE_BASE_JOB_ID=${job_id}

    current_timestamp="$(date +%s.%N)"
    cat "${OUTPUT_STATUSFILE}" |
        ${JQ} '
            .mutate.start_time='${mutate_start_time}' |
            .mutate.count='${mutate_count}' |
            .mutate.attempt_hours='${SS_ATTEMPT_HOURS}' |
            .mutate.attempt_times='${SS_ATTEMPT_TIMES}' |
            .mutate.multi_mutate_num='${MULTI_MUTATE_NUM}' |
            .mutate.base_job_id='${MUTATE_BASE_JOB_ID}' |
            .update_timestamp='${current_timestamp}'
        ' > /tmp/s.json \
    && mv /tmp/s.json "${OUTPUT_STATUSFILE}"
fi

if [[ ${NNABLA_RESULT_STATUS} != 0 ]]
then
    #
    # FAILED STATUS SET
    #
    if [[ "${last_status}" != "failed" ]]
    then
        current_timestamp="$(date +%s.%N)"
        cat "${OUTPUT_STATUSFILE}" |
            ${JQ} '
                .status="failed" |
                .end_time='${current_timestamp}' |
                .update_timestamp='${current_timestamp}'
            ' > /tmp/s.json \
            && mv /tmp/s.json "${OUTPUT_STATUSFILE}"
    fi
    #
    # SET ERROR CODE
    #
    if [[ -e ${NNABLA_OOM_CHECKFILE} ]]
    then
        last_error=$(cat "${OUTPUT_STATUSFILE}" | ${JQ} 'select(.last_error != null)')
        if [[ ! "${last_error}" ]]
        then
            cat "${OUTPUT_STATUSFILE}" |
            ${JQ} '
                .last_error={"code":"'${E_NNABLA_OOM}'", "message":"nnabla out of memory"}
                ' > /tmp/s.json \
                && mv /tmp/s.json "${OUTPUT_STATUSFILE}"
        fi
    fi
else
    #
    # UPLOAD OUTPUT RESULTS
    #
    EXEC_CLI="${CONSOLE_CLI}"
    convert_file_prefix="result"
    best_nnp=""
    last_nnp=""
    convert_nnb_path="${OUTPUT_DIR}/${convert_file_prefix}.nnb"
    convert_onnx_path="${OUTPUT_DIR}/${convert_file_prefix}.onnx"
    convert_tf_path="${OUTPUT_DIR}/${convert_file_prefix}.pb"

    ls ${OUTPUT_DIR}/results_best_*.nnp > /dev/null 2>&1
    if [[ $? -eq 0 ]]
    then
        for result_nnp in $(ls -1t ${OUTPUT_DIR}/results_best_*.nnp)
        do
            best_nnp=$(basename ${result_nnp})
            break
        done
    else
        best_nnp="results.nnp"
    fi

    ls ${OUTPUT_DIR}/results_current_*.nnp > /dev/null 2>&1
    if [[ $? -eq 0 ]]
    then
        for result_nnp in $(ls -1t ${OUTPUT_DIR}/results_current_*.nnp)
        do
            last_nnp=$(basename ${result_nnp})
            break
        done
    else
        last_nnp="results.nnp"
    fi

    nnb_command="convert -b ${CONVERT_BATCH_SIZE} ${OUTPUT_DIR}/${best_nnp} ${convert_nnb_path}"
    onnx_command="convert -b ${CONVERT_BATCH_SIZE} ${OUTPUT_DIR}/${best_nnp} ${convert_onnx_path}"
    tf_command="convert -b ${CONVERT_BATCH_SIZE} ${OUTPUT_DIR}/${best_nnp} ${convert_tf_path}"
    if [[ "${NNABLA_COMMAND}" == "train" ]]
    then
        #
        # sync final train result
        #
        _sync_train_results | while read line
        do
            _logging debug ${line}
        done
        # create result_train_best.nnp
        _logging info "create ${TRAIN_BEST_NNP}"
        cp -vf "${OUTPUT_DIR}/${best_nnp}" "${LOCAL_OUTPUT_DIR}/${TRAIN_BEST_NNP}"
        # create result_train_last.nnp
        _logging info "create ${TRAIN_LAST_NNP}"
        cp -vf "${OUTPUT_DIR}/${last_nnp}" "${LOCAL_OUTPUT_DIR}/${TRAIN_LAST_NNP}"

    elif [[ "${NNABLA_COMMAND}" == "forward" ]]
    then
        #
        # sync evaluation result
        #
        if [[ -f ${OUTPUT_RESULT} ]]
        then
            cp -vf "${OUTPUT_RESULT}" "${LOCAL_OUTPUT_DIR}/${FORWARD_RESULT}" \
                | _logging info "cp $(cat -)"
            _logging info "create ${CONFUSION_MATRIX}"
            confusion_matrix.py "${OUTPUT_RESULT}" "${WORK_DIR}" > ${WORK_MATRIX}
            if [[ -s "${WORK_MATRIX}" ]]
            then
                _logging info "${CONFUSION_MATRIX} created"
                for matrix_json in $(ls -1F ${WORK_DIR}/*_matrix.json)
                do
                    cp -vf \
                          "${matrix_json}" \
                          "${LOCAL_OUTPUT_DIR}/$(basename ${matrix_json})" \
                        | _logging info "cp $(cat -)"
                done
                for custom_output_result in $(ls -1F ${WORK_DIR}/*_output_result.db)
                do
                    _logging info "$(basename ${custom_output_result}) created"
                    cp -vf \
                        "${custom_output_result}"\
                        "${LOCAL_OUTPUT_DIR}/$(basename ${custom_output_result})" \
                        | _logging info "cp $(cat -)"
                done
            else
                _logging warning "${CONFUSION_MATRIX} can not created"
            fi
        fi
        _sync_forward_results

        # WRITE BACK NNP FILES (BECAUSE, MAY BE INCLUDE EVALUATION RESULT)
        for nnp_file in $(ls -1 ${OUTPUT_DIR}/*.nnp)
        do
            nnp=$(basename ${nnp_file})
            cp -vf "${OUTPUT_DIR}/${nnp}" "${LOCAL_OUTPUT_DIR}/${nnp}" \
                | _logging info "cp $(cat -)"
        done

        # create result_evaluate.nnp
        _logging info "create ${EVALUATE_NNP}"
        cp -vf ${OUTPUT_DIR}/${best_nnp} ${LOCAL_OUTPUT_DIR}/${EVALUATE_NNP}
        # create result_train_best.nnp
        train_best_nnp=$(ls "${LOCAL_OUTPUT_DIR}/${TRAIN_BEST_NNP}" 2> /dev/null | grep -Ee '.nnp$')
        if [[ -z "${train_best_nnp}" ]]
        then
            cp -p ${OUTPUT_DIR}/${best_nnp} ${OUTPUT_DIR}/${TRAIN_BEST_NNP}
            zip -d ${OUTPUT_DIR}/${TRAIN_BEST_NNP} output_result*.zip
            _logging info "create because there is no ${TRAIN_BEST_NNP}"
            cp -vf "${OUTPUT_DIR}/${TRAIN_BEST_NNP}" "${LOCAL_OUTPUT_DIR}/${TRAIN_BEST_NNP}"
        fi

        # create result_train_last.nnp
        train_last_nnp=$(ls "${LOCAL_OUTPUT_DIR}/${TRAIN_LAST_NNP}" 2> /dev/null | grep -Ee '.nnp$')
        if [[ -z "${train_last_nnp}" ]]
        then
            cp -p ${OUTPUT_DIR}/${last_nnp} ${OUTPUT_DIR}/${TRAIN_LAST_NNP}
            zip -d ${OUTPUT_DIR}/${TRAIN_LAST_NNP} output_result*.zip
            _logging info "create because there is no ${TRAIN_LAST_NNP}"
            cp -vf "${OUTPUT_DIR}/${TRAIN_LAST_NNP}" "${LOCAL_OUTPUT_DIR}/${TRAIN_LAST_NNP}"
        fi
    elif [[ "${NNABLA_COMMAND}" == "profile" ]]
    then
        #
        # sync profile result
        #
        if [[ -f ${OUTPUT_PROFILE} ]]
        then
            cp -rf "${OUTPUT_PROFILE}" "${LOCAL_OUTPUT_DIR}/${PROFILE_RESULT}" \
                | _logging info "cp $(cat -)"
        else
            _logging warning "not found profile result file: ${OUTPUT_PROFILE}"
        fi
    fi

    result_nnb=$(ls "${LOCAL_OUTPUT_DIR}/${convert_file_prefix}.nnb" 2> /dev/null)
    if [[ -z "${result_nnb}" ]]
    then
        _logging info "create $(basename ${convert_nnb_path})"
        ${EXEC_CLI} ${nnb_command}
        cp -vf "${convert_nnb_path}" "${LOCAL_OUTPUT_DIR}/$(basename ${convert_nnb_path})"
    fi

    result_onnx=$(ls "${LOCAL_OUTPUT_DIR}/${convert_file_prefix}.onnx" 2> /dev/null)
    if [[ -z "${result_onnx}" ]]
    then
        _logging info "create $(basename ${convert_onnx_path})"
        ${EXEC_CLI} ${onnx_command}
        cp -vf "${convert_onnx_path}" "${LOCAL_OUTPUT_DIR}/$(basename ${convert_onnx_path})"
    fi

    result_tf=$(ls "${LOCAL_OUTPUT_DIR}/${convert_file_prefix}.pb" 2> /dev/null)
    if [[ -z "${result_tf}" ]]
    then
        _logging info "create $(basename ${convert_tf_path})"
        ${EXEC_CLI} ${tf_command}
        cp -vf "${convert_tf_path}" "${LOCAL_OUTPUT_DIR}/$(basename ${convert_tf_path})"
    fi
    _sync_wait
fi

#
# COUNT STORAGE USED SIZE
#

rm --recursive "${LOCAL_OUTPUT_DIR}/page/"
STORAGE_USED=$(du -s --block-size=1 "${LOCAL_OUTPUT_DIR}/" 2> /dev/null |
                awk '{ print $1 }')
if [[ "${STORAGE_USED}" ]]
then
    current_timestamp="$(date +%s.%N)"
    cat "${OUTPUT_STATUSFILE}" |
        ${JQ} '
            .storage_used='${STORAGE_USED}' |
            .update_timestamp='${current_timestamp}'
        ' > /tmp/s.json \
        && mv /tmp/s.json "${OUTPUT_STATUSFILE}"
fi

# create paging files
if [[ ${NNABLA_RESULT_STATUS} == 0 && "${NNABLA_COMMAND}" == "forward" ]]
then
    TENANT_ID_STR='[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}'
    if [[ "${LOCAL_DATASET_CSV}" =~ ^${LOCAL_MOUNT_POINT}/(${TENANT_ID_STR})/([0-9]+).cache$ ]]
    then
        tenant_id="${BASH_REMATCH[1]}"
        dataset_id="${BASH_REMATCH[2]}"
    fi

    evaluate_page_files_creator_local.py ${project_id} ${job_id} ${tenant_id} ${dataset_id}
    if [[ $? = 0 ]]
    then
        _logging info "Completed to pageing file creator."
    else
        _logging error "Failed to pageing file creator."
    fi
fi


_logging info "worker done"
