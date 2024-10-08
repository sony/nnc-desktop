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
        WORKSPACE_IS_FULL: 'ワークスペースに空きがありません',
        WORKSPACE_IS_FULL_CONTACT_ADMIN: 'グループのワークスペースに空きがありません。 管理者にご連絡ください',
        PLEASE_TRY_AGAIN_AFTER_A_WHILE: 'インターネット接続環境の問題などでエラーが発生しました。再度実行を頂き、回復しない場合はブラウザのリロードをお試しください。',
        // PROJECT
        NO_SUCH_PROJECT: 'プロジェクトはありません。',
        AN_UNEXPECTED_ERROR_OCCURED: '予期しないエラーが発生しました。',
        INVALID_FORMAT: 'プロジェクトファイルのフォーマットが正しくありません。',
        CREATE_NEW_PROJECT: `選択したサンプルプロジェクトを元に新しいプロジェクトを作成します。プロジェクト名を入力してください。1～255文字以内で以下の文字は使用できません。\n(\\, /, :, *, ?, ", <, >, |, ;)`,
        YOU_CAN_NOT_CREATE_PROJECT: 'プロジェクト数の上限に達したため、新しいプロジェクトを作成できません。',
        ENTER_NEW_PROJECT_NAME: `新しいプロジェクト名を入力してください。1～255文字以内で以下の文字は使用できません。\n(\\, /, :, *, ?, ", <, >, |, ;)`,
        INVALID_CHARACTER_INCLUDED: '無効な文字が入力されています。',
        DO_NOT_HAVE_PERMISSION_TO_DELETE: '対象のプロジェクトを削除する権限がありません。',
        DO_NOT_HAVE_PERMISSION_TO_DELETE_JOB: '対象のプロジェクトのジョブを削除する権限がありません。',
        PROJECT_LOCKED_USER_CAN_NOT_DELETE: '%@1 が対象のプロジェクトを編集中のため、削除できません。',
        WILL_BE_DELETE: ' を削除します。本当によろしいですか？',
        PROJECT_LOCKED_SOMEONE_CAN_NOT_DELETE: '他のユーザーが対象のプロジェクトを編集中のため、削除できません。',
        DO_NOT_HAVE_PERMISSION_TO_DELETE_ONE_OR_MORE: '対象の中にプロジェクトを削除する権限がないものがあります。',
        ONE_OR_MORE_PROJECTS_LOCKED: '対象の中に編集中のプロジェクトがあるため削除できません。',
        ALL_PROJECTS_WILL_BE_DELETED: '選択されている全てのプロジェクトを削除します。本当によろしいですか？',
        YOU_CAN_NOT_DOWNLOAD: '空のプロジェクトはダウンロードできません。',
        DOWNLOAD_PROJECT_FAILED: 'プロジェクトのダウンロードが失敗しました。',
        UPLOAD_FILE_IS_NOT_CORRECT: 'プロジェクトファイルが選択されていません。',
        IT_WILL_TAKE_LONG_TIME: 'nnp/onnx/pbファイルのアップロードには時間がかかる場合があります。また、アップロードが始まるまでにページをリロードしたり別のページに移ったりするとキャンセルされる場合がありますので、アップロードが始まるまでしばらくお待ち下さい。',
        IT_IS_READY_TO_UPLOAD: 'アップロードの準備が完了しました。',
        SELECT_WORKSPACE: '保存先のワークスペースを選択してください。',
        NAME_IS_TOO_SHORT_OR_LONG: '文字数が短すぎる、もしくは長すぎます。',
        IS_COPYING_PROJECT: 'コピー中のプロジェクトはコピーできません。',
        USE_BY_ANOTHER_PROCESS: 'このプロジェクトは現在別プロセスで使用されています。完了するまでお待ちください。',
        ONE_OR_MORE_PROJECTS_USE_BY_ANOTHER_PROCESS: '対象の中に別プロセスで使用されているプロジェクトが見つかりました。別プロセスで使用中のものは削除できないため、後ほど再度実行ください。',
        THIS_USER_MAY_BE_DELETED: 'このユーザーは削除された可能性があります。',
        PROJECT_ID_IS_NOT_CORRECT: 'プロジェクトIDが不正です。',
        // DATSET
        SAMPLE_DATASET_CAN_NOT_COPY: 'サンプルデータセットはコピーできません。',
        ENTER_NEW_DATASET_NAME: `データセット名を入力してください。1～255文字以内で以下の文字は使用できません。\n(\\, /, :, *, ?, ", <, >, |, ;)`,
        COPY_DATASET_TO_GROUP: `グループのワークスペースに選択したデータセットをコピーします。データセット名を入力してください。1～255文字以内で以下の文字は使用できません。\n(\, /, :, *, ?, ", <, >, |, ;)`,
        SAMPLE_DATASET_CAN_NOT_DELETE: 'サンプルデータセットは削除できません。',
        DO_NOT_HAVE_PERM_TO_DELETE_DATASET: '対象のデータセットを削除する権限がありません。',
        DO_NOT_HAVE_PERMISSION_TO_DELETE_ONE_OR_MORE_DATASET: '対象の中にデータセットを削除する権限がないものがあります。',
        ALL_DATASETS_WILL_BE_DELETED: '選択されている全てのデータセットを削除します。本当によろしいですか？',
        DEFAULT_ERROR: 'アップロードエラー',
        UPLOAD_DATASET_FILE_IS_NOT_CORRECT: 'データセットファイルが選択されていません。',
        UPLOAD_DATASET_FILE_SIZE_IS_EXCEEDED: 'アップロードの際には注意事項をご確認ください。\n',
        ABOUT_DATASET_UPLOAD: 'データセットアップロードの注意事項',
        IT_WILL_TAKE_LONG_TIME_FOR_DATASET: 'データセットのアップロードには時間がかかる場合があります。「アップロード準備完了」のダイアログが表示されるまで、このページはこのままにしてください。ページの更新や移動をするとアップロードが失敗することがあります。',
        DATASET_UPLOAD_FAILED: 'データセットのアップロードに失敗しました。一覧に表示されたままの場合は削除アイコンから削除してください。',
        // COMPUTE RESOURCE
        SELECT_INSTANCE_TYPE: 'Select instance type:',
        remoteResG_USER_ID: 'remoteResG user ID:',
        remoteResG_PARTITION_SPEC: 'Specify partition:',
        remoteResG_GPU_NUMBER: 'Number of GPUs:',
        remoteResG_CERT_FILE: 'IdentityFile Path:',
        remoteResG_GPU_NUM_LIMIT: 'Number of GPUs shoud be 1-8',
        remoteResG_CERT_SIZE_LIMIT: 'Certificate file is too big (more than 100KB)',
        remoteResG_CERT_READ_ERROR: 'Certificate file reading failed',
        INVALID_PATH: 'Certificate file Path invalid',
        ADD_INSTANCE_ERROR: 'Add new instance failed.',
        DELETE_INSTANCE_ERROR: 'Delete action failed.',
        ALL_INSTANCE_WILL_BE_DELETED: 'All instances you selected will be deleted. Are you sure?',
        // SERVICE SETTINGS
        SESSION_HAS_EXPIRED: 'セッションの有効期限が切れました。再度サインインしてください。',
        ENTER_YOUR_NICKNAME: `ニックネームを入力してください。1~%@1文字以内で以下の文字は使用できません。\n( \, /, :, *, ?, ", <, >, |, ;)`,
        PLEASE_CONTACT_US: 'からご連絡ください。',
        THE_INQUIRY_FORM: 'お問い合わせフォーム',
        WORKSPACE_LIMIT: 'Workspace Limit',
        USED: '使用',
        IF_YOU_HAVE_QUESTIONS: 'お問い合わせ内容を、以下のメーリングリスト宛にお送りください。',
        IF_THE_LINK_DOES_NOT_AUTOMATICALLY_OPEN: '※メールリンクをクリックしてもメールソフトが自動で立ち上がらない場合は、以下を記入してメールをお送りください。',
        SELECT_USER_TYPE: 'ユーザーのタイプを選択してください。',
        NICKNAME_WILL_BE_REMOVE_FROM_GROUP: '(%@1) をグループから削除します。本当によろしいですか？',
        WILL_BE_REMOVE_FROM_GROUP: 'をグループから削除します。 よろしいですか?',
        ENTER_USER_ID_TO_INVITE: 'グループに招待するユーザーのIDを入力してください。',
        USER_NOT_FOUND: '対象のユーザーは存在しません。',
        UNSUPPORTED_PROVIDER: '対象のユーザーは、Googleアカウントのユーザーのためグループに参加できません。ソニーアカウントのユーザーをご指定ください。',
        EMAIL_ADDRESS_NOT_REGISTERED: '対象のユーザーは、Emailアドレスがシステムに登録されていないため、登録ができません。Emailアドレスを登録するには、対象のユーザーで一度ログアウトし、再度サインインをお試しください。',
        USER_HAS_ALREADY_INVITED: '対象のユーザーはすでに招待済みです。',
        ALL_SELECTED_USER_REMOVE_FROM_GROUP: '選択されている全てのユーザーをグループから削除します。本当によろしいですか？',
        USER_ID_IS_TOO_SHORT_OR_LONG: 'ユーザーIDが短すぎる、もしくは長すぎます。',
        JOB_DETAILS: '詳細',
        BODY: '本文',
        PLEASE_WRITE_DETAIL: '(こちらに内容をお書きください。)',
        SUBJECT: 'タイトル:',
    },
    vueTexts: {
        common: {
            TRAIN: '学習',
            EVALUATE: '評価',
            PROFILE: 'プロファイル',
            jobStatus: {
                QUEUED: '待機中',
                PREPROCESSING: '前処理',
                PROCESSING: '実行中',
                FINISHED: '完了',
                SUSPENDED: '停止',
                FAILED: '失敗',
            },
            SAMPLE: 'サンプル',
            ALL: '全て',
            OR_MORE: '以上',
            EQUAL: 'イコール',
            OR_LESS: '未満',
        },
        dashboard: {
            RECENT_PROJECT: '最近のプロジェクト',
            NO_PROJECT: 'プロジェクトなし',
            RECENT_JOB: '最近のジョブ',
            NO_JOB: 'ジョブなし',
            INFORMATION: 'Information',
        },
        projects: {
            NEW_PROJECT: 'プロジェクトの新規作成',
            UPLOAD_PROJECT: 'プロジェクトのアップロード',
            SEARCH: '検索',
            NAME: 'プロジェクト名',
            MODIFIED: '更新日',
            ACTION: 'アクション',
            SAVING: '保存中',
            FAILED_TO_SAVE: '失敗',
            OVERVIEW: 'オーバービュー',
            JOB_LIST: 'ジョブ一覧',
            DELETE: '削除',
            LABEL_TITLE: '新しいラベルを入力してください。',
            CREATE_LABEL: '(新規作成)',
            INVALID_CHARACTER_INCLUDED: '無効な文字が入力されています。',
            UPLOAD_PROJECT_TITLE: `対応フォーマット: \n.sdcproj, .prototxt, .nntxt, .onnx, .nnp, .pb`,
            DROP_OR_CLICK: 'ファイルをドロップまたはクリックして選択してください。',
            ENTER_NEW_PROJECT_NAME: `新しいプロジェクト名を入力してください。1～255文字以内で以下の文字は使用できません。\n(\\, /, :, *, ?, ", <, >, |, ;)`,
            NAME_IS_TOO_SHORT_OR_LONG: '文字数が短すぎる、もしくは長すぎます。',
        },
        datasets: {
            UPLOAD_DATASET: 'アップロード',
            UPLOAD_DATASET_FROM_BROWSER: 'ブラウザからアップロード',
            SEARCH: '検索',
            NAME: 'データセット名',
            ACTION: 'アクション',
            SAVING: '保存中',
            FAILED_TO_UPLOAD: '失敗',
            DELETE: '削除',
            PREVIEW: 'プレビュー',
            UPLOADING: 'アップロード中',
            EXPANDING: '展開中',
            FINISH: '完了',
            COPY_THE_FOLLOWING: 'データセットをアップロードするには、専用のアップローダー、またはNnablaコマンドラインから行います。その際に、以下に表示されているコードをコピーしてお使いください。',
            SOME_PIECES_OF_DATA: 'プレビューの準備中です。',
            TRY_AGAIN: 'しばらく経ってからお試しください。',
            LABEL_TITLE: '新しいラベルを入力してください。',
            CREATE_LABEL: '(新規作成)',
            INVALID_CHARACTER_INCLUDED: '無効な文字が入力されています。',
            UPLOAD_DATASET_TITLE: `対応フォーマット: \n.zip, .tar, .gz`,
            DROP_OR_CLICK: 'ファイルをドロップまたはクリックして選択してください。',
            ENTER_NEW_DATASET_NAME: `データセット名を入力してください。1～255文字以内で以下の文字は使用できません。\n(\\, /, :, *, ?, ", <, >, |, ;)`,
            NAME_IS_TOO_SHORT_OR_LONG: '文字数が短すぎる、もしくは長すぎます。',
            ROWS: '行',
            COLS: '列',
        },
        computeResource: {
            ACTION: 'Action',
            ADD_RESOURCE: 'Add Resource',
            DELETE: 'Delete',
            JOB_LIST: 'Job List',
            LOCAL: 'LOCAL',
            MODIFIED: 'Modified',
            NAME: 'Name',
            OVERVIEW: 'Overview',
            TYPE: 'Type',
        },
        jobHistory: {
            TITLE: 'ジョブ履歴',
            NAME: 'ジョブ名',
            OWNER_ID: 'オーナーID',
            PROCESSOR: 'プロセッサー',
            TIME: '実行時間',
            AMOUNT: '料金',
            MODIFIED: '更新日',
        },
        serviceSettings: {
            HOUR: '時間',
            USED: '利用済み',
            NO_NAME: 'ニックネームなし',
            SET: '設定',
            LANGUAGE: '言語: ',
            COMPUTE_HOURS: '実行時間',
            WORKSPACE: 'ワークスペース容量',
            COMMUNITY: 'コミュニティ',
            TRY_AGAIN: 'しばらく時間を置いてお試しください',
            WITHDRAW: 'Neural Network Consoleの退会',
            PLAN: 'プラン:',
            CHANGE: '変更',
            MEMBERS: 'グループメンバー',
            TECHNICAL_SUPPORT: 'テクニカルサポート',
            VIEW_DETAILS: '詳細',
            CHANGE_LIMIT: '変更',
            CHANGE_SIZE: '変更',
            CONTACT: 'お問い合わせ',
            TIMES_MONTH: '回/月',
        },
        tenantMembers: {
            ADD_NEW: '+ 追加',
            NAME: '名前',
            TYPE: 'タイプ',
            WORKSPACE_USAGE: 'ワークスペース使用量',
            ACTION: 'アクション',
            DELETE: '削除',
            JOB_AMOUNT: 'ジョブ実行料金',
            TOTAL: '合計',
            THIS_MONTH: '今月',
            LAST_MONTH: '先月',
            PROCESSOR: 'プロセッサー',
            TIME: '時間',
            AMOUNT: '料金',
        },
        deactivate: {
            WITHDRAW_FROM_NURAL_NETWORK_CONSOLE: 'Neural Network Consoleの退会',
            THANK_YOU_FOR_USING_NNC: 'Neural Network Consoleをご利用頂きありがとうございます。',
            BE_SURE_TO_READ_THE_FOLLOWING: '退会する前に以下の注意事項を必ずお読みください。',
            IF_YOU_AGREE_WITH_ALL_OF_THESE: 'その全てにご同意いただける場合は、チェックボックスを有効にし、退会ボタンをクリックしてください。',
            WE_ARE_WAITING_FOR_YOUR_FEEDBACK: 'よろしければ、コミュニティにコメント頂きフィードバックをいただけると幸いです。これまでのご利用ありがとうございました。',
            TRAINING_AND_EVALUATION_DURING_EXECUTION: '実行中の学習や評価は停止され、すべてのプロジェクト及びデータセットが削除されます。',
            ALL_PREVIOUS_RESULTS: 'これまでの学習結果も全て削除されますが、退会前にプロジェクトをダウンロードすれば、それらをWindowsアプリ版で利用できます。',
            ONCE_APPLYING_FOR_WITHDRAWING: '一旦退会を申し込むと、その手続きを取り消せません。',
            EVEN_IF_YOU_WITHDRAW_NNC: 'Neural Network Consoleを退会しても、ご利用中のその他ソニーのサービスにより、ソニーアカウントは存続します。',
            I_AGREE: '同意します。',
            YOU_CANNOT_WITHDRAW: ' グループの所有者はそのグループから離脱できません。',
            NOTES: '[注意事項]',
        },
        leftMenu: {
            DASHBOARD: 'ダッシュボード',
            PROJECT: 'プロジェクト',
            DATASET: 'データセット',
            COMPUTE_RESOURCE: 'Compute Resource',
            JOB_HISTORY: 'ジョブ履歴',
            SAMPLE_PROJECT: 'サンプルプロジェクト',
            SERVICE_SETTINGS: 'サービス設定',
            REACHED_FREE_LIMIT: '無料上限に達しました',
            CLOSE_TO_FREE_LIMIT: '無料上限に近づいています',
            REACHED_LIMIT: '上限に達しました',
            CLOSE_TO_LIMIT: '上限に近づいています',
            WELCOME_TO_NNC: 'Neural Network Consoleへようこそ!',
            WHY_DONT_YOU_GET_STARTED: '豊富なサンプルプロジェクトから始めてみましょう！',
        },
        accountMenu: {
            ACCOUNT_SETTINGS: 'アカウント設定',
            SERVICE_SETTINGS: 'サービス設定',
            DOCS: 'Docs & Tutorials',
            ABOUT: 'About',
            TERMS_OF_SERVICE: '利用規約',
            LICENSES: 'ライセンス',
            LOGOUT: 'ログアウト'
        }
    }
};
