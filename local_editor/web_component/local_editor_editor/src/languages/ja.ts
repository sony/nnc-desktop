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

const ja = {
    common: {
        ACTION: 'アクション',
    },
    edit: {
        EDIT: '編集',
        TRAINING: '学習',
        EVALUATION: '評価',
        INFERENCE: '推論',
        DATASET: 'データセット',
        CONFIG: '詳細設定',
        COMPONENTS: 'レイヤー',
        SEARCH: '検索',
        LAYER_PROPERTY: 'レイヤープロパティ',
        contextMenu: {
            UNDO: '元に戻す',
            REDO: 'やり直し',
            CUT: '切り取り',
            COPY: 'コピー',
            PASTE: '貼り付け',
            DELETE: '削除',
            CREATE_UNIT: 'ユニットを作成',
            SELECT_ALL: '全選択',
            INVERSE_LAYER_SELECTION: '選択されていないレイヤーを選択',
            CLEAR_SELECTION: '選択をクリア',
            ARRANGE_LAYERS: 'アレンジレイヤー',
            ZOOM_DEFAULT: '元のサイズに戻す',
            ZOOM_IN: 'ズームイン',
            ZOOM_OUT: 'ズームアウト',
            EXPORT: 'エクスポート',
            EXPORT_PROTOTXT: 'prototxt(Caffe)beta',
            EXPORT_PYTHON: 'Python Code (NNabla)',
            EXPORT_HTML: 'html beta',
        }
    },
    training: {
        JOB_HISTORY: 'ジョブ履歴',
        PAUSE_ALL_JOBS: '実行中のジョブを全て停止',
        jobContextMenu: {
            RENAME: '名前変更',
            OPEN_LEARNING_CURVE: '選択中の結果と学習曲線を比較',
            CLEAR_LEARNING_CURVE: '比較用に表示中の学習曲線をクリア',
            SUSPEND: '停止',
            RESUME: '再開',
            EXPORT: 'Export',
            RE_EDIT: '再編集',
            PUBLISH: '公開',
            PUBLISH_PROJECT: 'プロジェクト',
            PUBLISH_API: 'API',
            DELETE: '削除',
            DELETE_ALL_INCOMPLETE: '未完了のジョブを全て削除',
        },
        graphContextMenu: {
            VIEW: 'ビュー',
            ZOOM: 'ズーム',
            ZOOM_DEFAULT: '元のサイズに戻す',
            ZOOM_IN: 'ズームイン',
            ZOOM_OUT: 'ズームアウト',
            SAVE_CSV: 'CSVを保存',
        },
        LOG: 'ログ',
        PERFORMANCE: 'パフォーマンス',
        ELAPSED: '経過時間',
        REMAINING: '残り時間',
        TOTAL: '合計時間',
        RESOURCE: 'リソース',
        GRAPH_CANNOT_BE_DISPLAYED: 'データがないためグラフを表示することができません。',
        LINEAR_SCALE: 'リニア軸',
        LOG_SCALE: '対数軸',
        EPOCH: '世代',
        LEARNING_CURVE: '学習曲線',
        TRADE_OFF_GRAPH: 'トレードオフグラフ',
        OUTPUT_RESULT: '評価結果',
        CONFUSION_MATRIX: '混同行列',
        OTHERS: 'その他',
        COMPARISON: 'この結果と比較',
        PARETO_OPTIMAL: 'パレート最適',
        CLASSIFICATION_RESULT: '分類結果',
        CLASSIFICATION_MATRIX: '分類マトリックス',
        LIKELIHOOD_GRAPH: '尤度グラフ',
    },
    inference: {
        DROP_OR_CLICK: 'ファイルをドロップするか、ここをクリックしてください。',
        UPLOAD_INPUT_TITLE: `対応フォーマット:  \n.bmp, .jpg, .jpeg, .png, .gif, .tif, .tiff, .dcm, .csv, .npy and .wav`,
    },
    dataset: {
        LINK_DATASET: 'データセットの選択',
        NOT_SET: '選択されていません',
        contextMenu: {
            MOVE_UP: '上に移動',
            MOVE_DOWN: '下に移動',
            ADD: '追加',
            RENAME: '名前変更',
            DELETE: '削除',
        },
        DATASET_LIST: 'データセットリスト',
        NAME: 'データセット名',
        SEARCH: '検索',
        PREVIEW: 'プレビュー',
        ALL: '全て',
    },
    config: {
        CONFIG: '詳細設定',
        contextMenu: {
            ADD_OPTIMIZER: 'Optimizerを追加',
            ADD_EXECUTOR: 'Executorを追加',
            MOVE_UP: '上に移動',
            MOVE_DOWN: '下に移動',
            RENAME: '名前変更',
            DELETE: '削除',
        },
        NETWORK: 'ネットワーク',
        DATASET: 'データセット',
        global: {
            PROJECT_DESCRIPTION: 'プロジェクト説明',
            PROJECT_TAG: 'プロジェクトタグ',
            EDIT: '編集',
            MAX_EPOCH: '学習反復世代数',
            EPOCH: '世代',
            SAVE_BEST: '最高精度のモデルを保存',
            BATCH_SIZE: 'バッチサイズ',
            PRECISION: '精度',
            MONITOR_INTERVAL: 'モニター間隔',
            STRUCTURE_SEARCH: '構造自動探索',
            ENABLE: '有効',
            METHOD: 'メソッド',
            OPTIMIZE: '最適化',
            SEARCH_RANGE: '検索範囲',
            MAX_ATTEMPTS: '最大試行回数',
            HOURS: '時間',
            TIMES: '回',
            NUMBER_OF_PARALLEL_JOBS: 'ジョブの並列数',
        },
        optimizer: {
            EFFECTIVE_RANGE: '有効範囲',
            UPDATER: '最適化アルゴリズム',
        },
        executor: {
            NUMBER_OF_EVALUATIONS: '評価数',
        }
    },
    controller: {
        CONTROLLER: 'コントローラー',
        RUN: '実行',
        SUSPEND: '一時停止',
        RESUME: '再開',
        PROFILE: '事前実行(計算時間推定)',
        TRAIN: '学習',
        STRUCTURE_SEARCH: '構造自動探索',
        EVALUATE: '評価',
        OVERVIEW: 'オーバービュー',
        NETWORK_STATISTICS: 'ネットワーク統計情報',
        DOWNLOAD_PROJECT: 'プロジェクトをダウンロード',
        UPLOAD_INPUT: '入力をアップロードする',
    },
    jobStatus: {
        SCHEDULED: '実行予約中',
        BEFOREPROFILING: 'プロファイル実行待ち',
        BEFORETRAINING: '学習実行待ち',
        BEFOREEVALUATING: '評価実行待ち',
        BEFOREINFERENCE: '推論実行待ち',
        PROFILING: 'プロファイル中',
        TRAINING: '学習実行中',
        EVALUATING: '評価実行中',
        INFERENCING: '推論実行中',
        EVALUATED: '評価実行済み',
        INFERRED: '推論実行済み',
        SUSPENDED: '一時停止',
        INCOMPLETE: '実行失敗',
    },
    NOTICE: 'お知らせ',
    THIS_PROJECT_IS_LOCKED: `対象のプロジェクトは %@1 により編集中のため、Read-Onlyモードで開きます。\nRead-Onlyモードでは、ネットワークの閲覧、コピーおよび学習結果を含むダウンロードが可能です。`,
    ENTER_NEW_PROJECT_NAME: `新しい %@1 名を入力してください。1～255文字以内で以下の文字は使用できません。\n(/, :, *, ?, ", <, >, |, ;)`,
    THE_PROJECT_WITH_NEW_NAME_IS_SAVED_BG: '新しいプロジェクトをバックグラウンドで保存中です。この処理は少し時間がかかることがあります。',
    SEE_YOUR_PROJECTS: 'プロジェクトを見る',
    TIPS: 'Tips: 効率的にジョブ実行を行うためには？',
    ARE_YOU_SURE_WANT_RUN_JOB: '本当に実行してもよろしいですか？',
    DONT_ASK_AGAIN: "次回からこのメッセージを表示しない。",
    ERROR: 'エラー',
    PLEASE_WAIT_FOR_HTML_FORMAT: 'Html形式でのダウンロードが完了するまでお待ちください。進捗状況はページ上部のサークルで表示されています。',
    COMFIRM: '確認',
    DO_YOU_REALLY_WANT_TO_DELETE_INCOMPLETE_RESULTS: '未完了の全ての学習/評価結果 を削除します。本当によろしいですか？',
    USING_THE_NETWORK: '選択中の学習/評価のネットワークをEDITタブで開く',
    OPEN_IT_IN_EDIT_TAB: '',
    USING_THE_WEIGHTED_NETWORK: '選択中の学習/評価のネットワークを重み付きで、EDITタブで開く',
    RETRAIN_SELECTED_JOB: '以前と同じ設定で選択中の学習を再学習する。',
    IF_YOU_WANT_CHANGE_IT: '設定を変更したいは場合は、”EDITタブで開く”を選択してください。',
    NAME_IS_TOO_SHORT_OR_LONG: '名前が短いまたは長すぎます',
    INVALID_CHARACTERES_ARE_INCLUDED: '不正な文字が含まれています',
    INVALID_INT_FORMAT: 'フォーマットが不正です。(-2147483647 ~ 2147483647)',
    OPEN_IN_EDIT_TAB: 'EDITタブで開く',
    OPEN_IN_EDIT_TAB_WITH_WEIGHT: '重み付きでEDITタブで開く',
    RE_TRAIN: '再学習',
    TAGS_WHEN_PROJECT_PUBLISHED: 'プロジェクトを公開するときのタグを入力してください。',
    ENTER_TAGS: 'タグを1~128文字で入力してください。1～128文字以内で以下の文字は使用できません。\n(\, /, :, *, ?, ", <, >, |, ;)\n※複数のタグを登録する場合は、カンマで区切ってください。',
    HTML_DOWNLOAD: 'HTML Download',
    LAYER_REFER: 'https://support.dl.sony.com/docs-ja/layer_reference/#',
    DO_YOU_WANT_TO_DELETE_JOB: '%@1 を削除します。本当によろしいですか？',
    DATA_LOADING_TIMED_OUT: 'データ読み込みがタイムアウトしました',
    THE_NUMBER_OF_LOADING: 'データ数が多いためロードがタイムアウトした可能性があります。',
    AUTHRIZATION_EXPIRED: '認証の有効期限切れ',
    NETWORK_ERROR: 'Network Error',
    PLEASE_CHECK_YOUR_INTERNET: 'インターネットへの接続状況をご確認ください。',
    WORKSPACE_IS_FULL: `ワークスペースの空き容量が不足しています。`,
    LINKED_DATASET_MIGHT_BE_DELETED: `設定されていたデータセットが削除された可能性があります。`,
    THIS_PROCESSOR_DOESNT_SUPPORT: '選択されたプロセッサーは、現在の"Mixed Precision"の設定ではサポートされていません。\n別のプロセッサーを選択するか、CONFIGメニュー内の"Mixed Precision"の設定をHalfからFloatに変更してください。',
    THIS_PROJECT_IS_OPEND_IN_READ_ONLY: `このプロジェクトはRead-Onlyモードのため保存できません。`,
    THIS_PROJECT_BEING_COPIED: '対象のプロジェクトがコピー中です。',
    CAN_NOT_DOWNLOAD_FROM_SCHEDULED_OR_RUNNNING: "実行中またはスケジュールされた学習/評価の処理があるため、ダウンロードできません。",
    FAILED_TO_EXPORT_PROJECT_AS_HTML: 'Html形式でのダウンロードに失敗しました。しばらく経ってから再度お試しください。',
    PLEASE_TRY_AGAIN: "後でお試しください",
    SPECIFIED_DATASET_MIGHT_BE_DELETED: '設定されているデータセットが削除された可能性があります。',
    WORKSPACE_OF_GROUP_IS_FULL_CONTACT_ADMIN: 'グループのワークスペースの空き容量が不足しています。グループの管理者にお問い合わせください。',
    HOURS: ' 時間です',
    NETWORK_ONLY: 'ネットワークのみ',
    NETWORK_JOB: 'ネットワークとその結果',
    ONLY_THE_NETWORK_OF_SELECTED_JOB: '選択中の学習/評価時のネットワークのみを公開',
    THE_NETWORK_AND_RESULTS_OF_SELECTED_JOB: '選択中の学習/評価時のネットワークとその実行結果を公開',
    PLEASE_SEE_THE: 'プロジェクトを公開する際には ',
    LINK: '注意事項',
    FOR_THE_TERM_OF_USE: ' をよくお読みください。',
    ARE_YOU_SURE_YOU_WANT_CANCEL_DOWNLOAD: 'プロジェクトのダウンロードを取り消します。本当によろしいですか？',
    CURRENT_NETWORK: '現在のネットワーク',
    LATEST_JOB: '最新の学習/評価時のネットワーク',
    LATEST_JOB_RESULT: '最新の学習/評価時のネットワークとその結果',
    ONLY_THE_CURRENT_NETWORK: '現在のネットワークのみを公開',
    ONLY_THE_NETWORK_OF_LAST_JOB: '最新の学習/評価時点のネットワークのみを公開',
    NETWORK_AND_RESULTS_OF_LAST_JOB: '最新の学習/評価時点のネットワークとその実行結果を公開',
    THE_PROCESS_OF_PUBLISHING: 'プロジェクトの公開処理はバックグラウンドで実行中です。この処理は少し時間がかかることがあります。',
    SEE_DASHBOARD: 'Dashboardへ移動',
    NOT_FOUND_PARAMETER: '可視化のデータがありません。',
    NOT_FOUND_GRAPH_DATA: 'グラフの表示データがありません。',
    NOT_FOUND_CLASSIFICATION_RESULT: '表示データがありません。',
    AN_UNEXPECTED_ERROR_OCCURED: '予期しないエラーが発生しました。',
    NETWORK_IS_EMPTY: 'ネットワークが空です。\n',
    BATCH_SIZE_IS_LARGER: 'バッチサイズにプロセッサ数を掛けた値はデータセット数より小さくする必要があります。',
    NO_EXECUTOR_DEFINED: '"Executor" が定義されていません。',
    IS_NOT_FOUND_SPECIFIED_IN: '"%@2" で定義されている、データセット "%@1" が見つかりませんでした。',
    HAS_NOT_BEEN_LINKED: '" はリンクされていません。',
    YOU_CANT_PUBLISH_WITHOUT_NAME: 'プロジェクト公開には、ニックネームの設定が必要です。',
    IS_COPYING_PROJECT: 'コピー中のプロジェクトはコピーできません。',
    YOU_CAN_NOT_DOWNLOAD: 'オリジナルファイルが見つかりませんでした。',
    THE_JOB_IS_ALREADY_DELETED: 'このジョブは既に削除されました。',
    THE_PROJECT_MIGHT_BE_DELETED: '該当のプロジェクトが見つかりません。削除されていないかご確認ください。',
}

export default ja