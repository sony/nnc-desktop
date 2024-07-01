/* Copyright 2024 Sony Group Corporation. */
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

export default {
    dialogTexts: {
        WORKSPACE_IS_FULL: 'Workspace is full.',
        WORKSPACE_IS_FULL_CONTACT_ADMIN: 'Workspace of the group is full. Please contact your administrator.',
        PLEASE_TRY_AGAIN_AFTER_A_WHILE: 'An error occurred due to a problem with the Internet connection environment. Please try again and try to reload your browser if it does not recover.',
        // PROJECT
        NO_SUCH_PROJECT: 'No such project.',
        AN_UNEXPECTED_ERROR_OCCURED: 'An unexpected error has occurred.',
        INVALID_FORMAT: 'The format of the project file is incorrect.',
        CREATE_NEW_PROJECT: 'You can create a new project from this sample project. Enter a new project name between 1 and 255 characters long. (except \\, /, :, *, ?, ", <, >, |, ;)',
        YOU_CAN_NOT_CREATE_PROJECT: 'You can not create a new project because you reached the limit of project.',
        ENTER_NEW_PROJECT_NAME: 'Enter a new project name between 1 and 255 characters long. (except \\, /, :, *, ?, ", <, >, |, ;)',
        INVALID_CHARACTER_INCLUDED: 'The invalid characters are included.',
        DO_NOT_HAVE_PERMISSION_TO_DELETE: 'You do not have permission to delete the project.',
        DO_NOT_HAVE_PERMISSION_TO_DELETE_JOB: 'You do not have permission to delete the job.',
        PROJECT_LOCKED_USER_CAN_NOT_DELETE: `This project is locked for editing by %@1, so cannot be deleted.`,
        WILL_BE_DELETE: ' will be deleted. Are you sure?',
        PROJECT_LOCKED_SOMEONE_CAN_NOT_DELETE: `This project is locked for editing by someone else, so cannot be deleted.`,
        DO_NOT_HAVE_PERMISSION_TO_DELETE_ONE_OR_MORE: 'You do not have permission to delete one or more projects.',
        ONE_OR_MORE_PROJECTS_LOCKED: `One or more projects are locked, so cannot be deleted.`,
        ALL_PROJECTS_WILL_BE_DELETED: 'All projects you selected will be deleted. Are you sure?',
        YOU_CAN_NOT_DOWNLOAD: 'You can not download the project because it is empty.',
        DOWNLOAD_PROJECT_FAILED: 'Downloading the project failed.',
        UPLOAD_FILE_IS_NOT_CORRECT: 'The file you import is not a correct project file.',
        IT_WILL_TAKE_LONG_TIME: 'It will take a long time to prepare for importing nnp/onnx/pb file. If you reload or go to another page, the preparing process will be canceled.',
        IT_IS_READY_TO_UPLOAD: 'It\'s ready to import it.',
        SELECT_WORKSPACE: 'Select a workspace from the list.',
        NAME_IS_TOO_SHORT_OR_LONG: 'The name is too short or long.',
        IS_COPYING_PROJECT: 'The project being copied can not be copied.',
        USE_BY_ANOTHER_PROCESS: 'This project is currently being used in another process. Please wait until it completes.',
        ONE_OR_MORE_PROJECTS_USE_BY_ANOTHER_PROCESS: 'A project used in another process was found in the selected project. You cannot delete items that are being used by another process, so try again later.',
        THIS_USER_MAY_BE_DELETED: 'This user may be deleted.',
        PROJECT_ID_IS_NOT_CORRECT: 'Project id is not correct.',
        // DATSET
        SAMPLE_DATASET_CAN_NOT_COPY: 'Sample dataset can not be copied.',
        ENTER_NEW_DATASET_NAME: 'Enter a new dataset name between 1 and 255 characters long. (except \\, /, :, *, ?, ", <, >, |, ;)',
        COPY_DATASET_TO_GROUP: 'Copy the dataset to the group workspace. Enter a new dataset name between 1 and 255 characters long. (except \, /, :, *, ?, ", <, >, |, ;)',
        SAMPLE_DATASET_CAN_NOT_DELETE: 'Sample dataset can not be deleted.',
        DO_NOT_HAVE_PERM_TO_DELETE_DATASET: 'You do not have permission to delete the dataset.',
        DO_NOT_HAVE_PERMISSION_TO_DELETE_ONE_OR_MORE_DATASET: 'You do not have permission to delete the one or more dataset.',
        ALL_DATASETS_WILL_BE_DELETED: 'All datasets you selected will be deleted. Are you sure?',
        DEFAULT_ERROR: 'Import Error',
        UPLOAD_DATASET_FILE_IS_NOT_CORRECT: 'The file you import is not a correct dataset file.',
        UPLOAD_DATASET_FILE_SIZE_IS_EXCEEDED: 'Please check the notes when importing.\n',
        ABOUT_DATASET_UPLOAD: 'Precautions for uploading datasets',
        IT_WILL_TAKE_LONG_TIME_FOR_DATASET: 'Import the dataset may take some time. Keep this page as it is until you see the "Ready to import" dialog. Importing may fail if you refresh or move the page.',
        DATASET_UPLOAD_FAILED: 'Dataset import failed. If it remains displayed in the list, delete it from the delete icon.',
        // COMPUTE RESOURCE
        SELECT_INSTANCE_TYPE: 'Select instance type:',
        remoteResG_USER_ID: 'remoteResG user ID:',
        remoteResG_PARTITION_SPEC: 'Specify partition:',
        remoteResG_GPU_NUMBER: 'Number of GPUs:',
        remoteResG_CERT_FILE:'IdentityFile Path:',
        remoteResG_GPU_NUM_LIMIT: 'Number of GPUs shoud be 1-8',
        remoteResG_CERT_SIZE_LIMIT:'Certificate file is too big (more than 100KB)',
        remoteResG_CERT_READ_ERROR:'Certificate file reading failed',
        INVALID_PATH: 'Certificate file Path invalid',
        ADD_INSTANCE_ERROR: 'Add new instance failed.',
        DELETE_INSTANCE_ERROR: 'Delete action failed.',
        ALL_INSTANCE_WILL_BE_DELETED: 'All instances you selected will be deleted. Are you sure?',
        // SERVICE SETTINGS
        SESSION_HAS_EXPIRED: 'Your session has expired, please sign in again.',
        ENTER_YOUR_NICKNAME: `Enter your nickname between 1 and %@1 characters long. (except \, /, :, *, ?, ", <, >, |, ;)`,
        PLEASE_CONTACT_US: 'Please contact us from',
        THE_INQUIRY_FORM: 'the inquiry form',
        WORKSPACE_LIMIT: 'Workspace Limit',
        USED: 'Used',
        IF_YOU_HAVE_QUESTIONS: 'If you have questions, please contact the following mailing list.',
        IF_THE_LINK_DOES_NOT_AUTOMATICALLY_OPEN: '* If the link does not automatically open email software when you click it, please create a new e-mail message in the following format.',
        SELECT_USER_TYPE: 'Select a user type.',
        NICKNAME_WILL_BE_REMOVE_FROM_GROUP: `(%@1) will be removed from the group. Are you sure?`,
        WILL_BE_REMOVE_FROM_GROUP: 'will be removed from the group. Are you sure?',
        ENTER_USER_ID_TO_INVITE: 'Enter User ID to be invited to the group.',
        USER_NOT_FOUND: 'The user not found.',
        UNSUPPORTED_PROVIDER: 'Cannot invite the user who is Google account. Please choose a Sony account user.',
        EMAIL_ADDRESS_NOT_REGISTERED: 'The selected user cannot register because the email address is not registered in the system. To register an e-mail address, sign out as a selected user and sign in again.',
        USER_HAS_ALREADY_INVITED: 'The user has already invited.',
        ALL_SELECTED_USER_REMOVE_FROM_GROUP: 'All users you selected will be removed from the group. Are you sure?',
        USER_ID_IS_TOO_SHORT_OR_LONG: 'User ID is too short or too long.',
        JOB_DETAILS: 'Job Details',
        BODY: 'Body',
        PLEASE_WRITE_DETAIL: '(Please write the details down here.)',
        SUBJECT: 'subject:',
    },
    vueTexts: {
        common: {
            TRAIN: 'Training',
            EVALUATE: 'Evaluation',
            PROFILE: 'Profile',
            jobStatus: {
                QUEUED: 'Queued',
                PREPROCESSING: 'Preprocessing',
                PROCESSING: 'Processing',
                FINISHED: 'Finished',
                SUSPENDED: 'Suspended',
                FAILED: 'Failed'
            },
            SAMPLE: 'SAMPLE',
            ALL: 'ALL',
            OR_MORE: 'or more',
            EQUAL: 'equal',
            OR_LESS: 'or less'
        },
        dashboard: {
            RECENT_PROJECT: 'Recent Projects',
            NO_PROJECT: 'No project',
            RECENT_JOB: 'Recent Jobs',
            NO_JOB: 'No job',
            INFORMATION: 'Information'
        },
        projects: {
            NEW_PROJECT: 'New Project',
            UPLOAD_PROJECT: 'Import Project',
            SEARCH: 'Search',
            NAME: 'Name',
            MODIFIED: 'Modified',
            ACTION: 'Action',
            SAVING: 'Saving',
            FAILED_TO_SAVE: 'Failed to save',
            OVERVIEW: 'Overview',
            JOB_LIST: 'Job List',
            DELETE: 'Delete',
            LABEL_TITLE: 'Please enter new label names.',
            CREATE_LABEL: '(Create a new label)',
            INVALID_CHARACTER_INCLUDED: 'The invalid characters are included.',
            UPLOAD_PROJECT_TITLE: `Supported format:  \n.sdcproj, .prototxt, .nntxt, .onnx, .nnp and .pb`,
            DROP_OR_CLICK: 'Drop a file or click here.',
            ENTER_NEW_PROJECT_NAME: 'Enter a new project name between 1 and 255 characters long. (except \\, /, :, *, ?, ", <, >, |, ;)',
            NAME_IS_TOO_SHORT_OR_LONG: 'The name is too short or long.'
        },
        datasets: {
            UPLOAD_DATASET: 'Import Dataset',
            UPLOAD_DATASET_FROM_BROWSER: 'Import Dataset from browser',
            SEARCH: 'Search',
            NAME: 'Name',
            ACTION: 'Action',
            SAVING: 'Saving',
            FAILED_TO_UPLOAD: 'Failed to import',
            DELETE: 'Delete',
            PREVIEW: 'Preview',
            UPLOADING: 'Importing',
            EXPANDING: 'Expanding',
            FINISH: 'Finish',
            COPY_THE_FOLLOWING: 'Copy the following hash code and use it with the dataset uploader or Nnabla command line.',
            SOME_PIECES_OF_DATA: 'Some pieces of data for preview are preparing.',
            TRY_AGAIN: 'Please try again later.',
            LABEL_TITLE: 'Please enter new label names.',
            CREATE_LABEL: '(Create a new label)',
            INVALID_CHARACTER_INCLUDED: 'The invalid characters are included.',
            UPLOAD_DATASET_TITLE: `Supported format: \n.zip, .tar, .gz`,
            DROP_OR_CLICK: 'Drop a file or click here.',
            ENTER_NEW_DATASET_NAME: `Enter a new dataset name between 1 and 255 characters long. (except \\, /, :, *, ?, ", <, >, |, ;)'`,
            NAME_IS_TOO_SHORT_OR_LONG: 'The name is too short or long.',
            ROWS: 'Rows',
            COLS: 'Cols'
        },
        computeResource: {
            ACTION: 'Action',
            ADD_RESOURCE:'Add Resource',
            DELETE: 'Delete',
            JOB_LIST: 'Job List',
            LOCAL: 'LOCAL',
            MODIFIED: 'Modified',
            NAME: 'Name',
            OVERVIEW: 'Overview',
            TYPE: 'Type'
        },
        jobHistory: {
            TITLE: 'Job History',
            NAME: 'Name',
            OWNER_ID: 'Owner ID',
            PROCESSOR: 'Processor',
            TIME: 'Time',
            AMOUNT: 'Amount',
            MODIFIED: 'Modified'
        },
        serviceSettings: {
            HOUR: 'H',
            USED: 'used',
            NO_NAME: 'No name',
            SET: 'set',
            LANGUAGE: 'Language: ',
            COMPUTE_HOURS: 'Compute hours',
            WORKSPACE: 'Workspace',
            COMMUNITY: 'Community',
            TRY_AGAIN: 'Please try again later.',
            WITHDRAW: 'Withdraw from Neural Network Console',
            PLAN: 'Plan:',
            CHANGE: 'change',
            MEMBERS: 'Members',
            TECHNICAL_SUPPORT: 'Technical Support',
            VIEW_DETAILS: 'View details',
            CHANGE_LIMIT: 'Change Limit',
            CHANGE_SIZE: 'Change Size',
            CONTACT: 'Contact',
            TIMES_MONTH: 'times/month'
        },
        tenantMembers: {
            ADD_NEW: '+ Add New',
            NAME: 'Name',
            TYPE: 'Type',
            WORKSPACE_USAGE: 'Workspace Usage',
            ACTION: 'Action',
            DELETE: 'Delete',
            JOB_AMOUNT: 'Job Amount',
            TOTAL: 'total',
            THIS_MONTH: 'this month',
            LAST_MONTH: 'last month',
            PROCESSOR: 'Processor',
            TIME: 'Time',
            AMOUNT: 'Amount'
        },
        deactivate: {
            WITHDRAW_FROM_NURAL_NETWORK_CONSOLE: 'Withdraw from Neural Network Console',
            THANK_YOU_FOR_USING_NNC: 'Thank you for using Neural Network Console.',
            BE_SURE_TO_READ_THE_FOLLOWING: 'Be sure to read the following notes before withdrawing.',
            IF_YOU_AGREE_WITH_ALL_OF_THESE: 'If you agree with all of these, please activate the checkbox and press the withdraw button.',
            WE_ARE_WAITING_FOR_YOUR_FEEDBACK: 'We are waiting for your feedback. We\'d appreciate it if you would comment on the Community. Thank you very much for using Neural Network Console.',
            TRAINING_AND_EVALUATION_DURING_EXECUTION: 'Training and evaluation during execution are stopped and all projects and datasets are deleted.',
            ALL_PREVIOUS_RESULTS: 'All previous results will also be deleted, but if you download the projects before withdrawing, you can use them in Windows application version.',
            ONCE_APPLYING_FOR_WITHDRAWING: 'Once applying for withdrawing, we can not cancel the procedure.',
            EVEN_IF_YOU_WITHDRAW_NNC: 'Even if you withdraw Neural Network Console, the account service will be still available depends on what service you have.',
            I_AGREE: 'I Agree',
            YOU_CANNOT_WITHDRAW: 'You cannot withdraw from the membership, because you still own one or more groups.',
            NOTES: 'Notes'
        },
        leftMenu: {
            DASHBOARD: 'Dashboard',
            PROJECT: 'Project',
            DATASET: 'Dataset',
            COMPUTE_RESOURCE: 'Compute Resource',
            JOB_HISTORY: 'Job History',
            SAMPLE_PROJECT: 'Sample Project',
            SERVICE_SETTINGS: 'Service Settings',
            REACHED_FREE_LIMIT: 'Reached the limit',
            CLOSE_TO_FREE_LIMIT: 'Close to the limit',
            REACHED_LIMIT: 'Reached the limit',
            CLOSE_TO_LIMIT: 'Close to the limit',
            WELCOME_TO_NNC: 'Welcome to Neural Network Console!',
            WHY_DONT_YOU_GET_STARTED: 'Why don\'t you get started using a rich variety of sample projects?'
        },
        accountMenu: {
            ACCOUNT_SETTINGS: 'Account Settings',
            SERVICE_SETTINGS: 'Service Settings',
            DOCS: 'Docs & Tutorials',
            ABOUT: 'About',
            TERMS_OF_SERVICE: 'Terms of Service',
            LICENSES: 'Licenses',
            LOGOUT: 'Logout'
        }
    }
};