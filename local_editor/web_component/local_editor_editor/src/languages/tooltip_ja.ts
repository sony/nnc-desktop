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

const tooltip_ja ={
    network: {
        component: {
            IO: 'データの入出力を行います。',
            input: 'ニューラルネットワークの入力層です。',
            output: 'ネットワークの出力です．',
            Basic: '人工ニューロンの演算を行います。',
            affine: '全ての入力値から、OutShapeプロパティで指定する全ての出力ニューロンへの結合を持つ全結合層です。',
            convolution: '入力値に対して畳み込み演算を行うレイヤーです。',
            locallyConnectedLayer: 'スパースコーディングのみの畳み込みレイヤーです．MaxPoolingの後に置かれることが多いです．',
            Pooling: 'Pooling処理を行います。',
            maxPooling: '近傍の入力値の最大値を出力します。',
            averagePooling: '近傍の入力値の平均値を出力します。プロパティはMaxPoolingと共通です。',
            sumPooling: '近傍の入力値の加算値を出力します。プロパティはMaxPoolingと共通です。',
            unpooling: '1つの入力値を複数にコピーして、入力データよりサイズの大きいデータを生成します。',
            upSampling: 'アップサンプリングを行います．',
            Activation: '入力値に非線形な変換を施す活性化処理を行います。',
            tanh: '入力値のTanhによる処理結果を出力します。',
            sigmoid: '入力値のSigmoidによる処理結果を出力します。',
            reLU: '入力値のReLU（Rectified Linear Unit）による処理結果を出力します。',
            cReLU: '入力信号と、入力信号の符号を反転したものに対してそれぞれRelu処理を行い、それぞれの結果をAxisプロパティの示す軸で結合して出力します（Concatenated ReLU）。',
            pReLU: 'ReLUが0以下の入力に対して常に0を出力するのに対し、0以下の入力に対しても一定値をかけて出力するようにしたものです（Parametric ReLU）。',
            eLU: '入力値のELU（Exponential Linear Unit）による処理結果を出力します。',
            cELU: '入力信号と、入力信号の符号を反転したものに対してそれぞれELU処理を行い、それぞれの結果をAxisプロパティの示す軸で結合して出力します（Concatenated ELU）。．',
            abs: '入力値の絶対値を出力します。',
            maxout: '区分線形関数で任意の凸関数を近似する関数です．',
            softmax: '入力値のSoftmax値を出力します。',
            binary: '重みが+1/-1に2値化され，パラメータ数/計算量が削減されます．',
            binaryConnectAffine: '-1、+1にバイナリ化されたWを用いるAffineレイヤーです。',
            binaryConnectConvolution: '-1、+1にバイナリ化されたWを用いるConvolutionレイヤーです。',
            binaryWeightAffine: '-1、+1にバイナリ化されたWを用いた上でScalingを行うことで通常のAffineレイヤーの出力に近づけたAffineレイヤーです。',
            binaryWeightConvolution: '-1、+1にバイナリ化されたWを用いた上でScalingを行うことで通常のConvolutionレイヤーの出力に近づけたConvolutionレイヤーです。',
            xnorNetAffine: 'インプットを1/-1にした後に，それに近似係数を付けたBinaryWeightAffineです．',
            xnorNetConvolution: 'インプットを1/-1にした後に，それに近似係数を付けたBinaryWeightConvolutionです．',
            binaryTanh: '0以下の入力に対し-1を、0より大きい入力に対し+1を出力します。',
            binarySigmoid: '0以下の入力に対し0を、0より大きい入力に対し+1を出力します。',
            Math: 'テンソルに対する演算を行います。',
            product: 'エレメント毎に積を取ります．',
            sum: '指定次元の値の合計を求めます。',
            round: '入力値を四捨五入します。',
            not: '1 - インプットです．',
            "Arithmetic (Scalar)": 'スカラとの算術演算を行います。',
            addScalar: 'インプットに内部変数の値を加えます．',
            mulScalar: 'インプットと内部変数の値の積を取ります．',
            subScalar: 'インプットから内部変数の値を引きます．',
            rSubScalar: '内部変数の値からインプットを引きます．',
            divScalar: 'インプットを内部変数の値で割ります．',
            rDivScalar: '内部変数の値をインプットで割ります．',
            powScalar: 'インプットを内部変数の値で累乗します．',
            rPowScalar: '内部変数の値をインプットで累乗します．',
            maximumScalar: 'インプットと内部変数の値の最大値を取ります．',
            minimumScalar: 'インプットと内部変数の値の最小値を取ります．',
            "Arithmetic (2 Inputs)": '2項演算を行います。',
            add2: '2つのインプットの和です．',
            sub2: '2つのインプットの内，始めの値を後の値で引きます．',
            mul2: '2つのインプットの積です．',
            div2: '2つのインプットの内，始めの値を後の値で割ります．',
            pow2: '2つのインプットの内，始めの値を後の値で累乗します．',
            maximum2: '2つのインプットの最大値を取ります．',
            minimum2: '2つのインプットの最小値を取ります．',
            Others: 'テンソルの加工など、様々な用途に用います。',
            batchNormalization: '入力値を平均0分散1に正規化します。',
            dropout: '入力の要素を指定した確率で0にします。',
            dropmap: 'バッチ中のサンプル単位でドロップします．バッチ的ドロップアウトです．',
            embedding: 'Embedをします．文字，単語等の離散値をベクトル化するのに使用します．',
            localResponseNormalization: '指定された区域で平均0, 分散1の正規化をします．MaxPoolingの後に置かれることが多いです．',
            reshape: '配列の形を指定した形に変換します。',
            flatten: 'テンソルの次元をフラットにします．',
            concate: 'レイヤーを結合します．マルチモーダル入力やフォークしたネットワークの結合に使用します．',
            transpose: 'データの次元の入れ替えを行います。',
            slice: '配列の一部を抽出します。',
            reverse: '指定された軸上の値を反転します．',
            Parameter: 'ニューラルネットワークのパラメータです。',
            LoopControl: '繰り返し処理を記述するために用います。',
            Quantize: '量子化や、量子化を伴う人工ニューロンの演算を行います。',
            Unit: '複数のレイヤーをまとめたユニットを扱います。',
            Loss: '最適化に用いるロス関数です。',
            "Others(Pre Process)": 'データの前処理を行います。',
            Setting: 'ネットワークの設定を行います。',
            Logical: '論理演算を行います。',
            Validation: '精度評価を行います。',
            Trigonometric: '三角関数です。',
            Spectral: '周波数変換を行います。',
            parameter: 'ニューラルネットワークのパラメータです。',
            squaredError: 'データセットの変数との二乗誤差を最小化するニューラルネットワークの出力層です。',
            huberLoss: 'データセットの変数とのHuber Lossを最小化するニューラルネットワークの出力層です。',
            absoluteError: 'データセットの変数との絶対誤差を最小化するニューラルネットワークの出力層です。',
            epsilonInsensitiveLoss: 'Epsilonで指定する範囲を超えたデータセットの変数との絶対誤差を最小化するニューラルネットワークの出力層です。',
            binaryCrossEntropy: 'データセットの変数との交差エントロピーを最小化するニューラルネットワークの出力層です。',
            sigmoidCrossEntropy: 'データセットの変数との交差エントロピーを最小化するニューラルネットワークの出力層です。',
            categoricalCrossEntropy: 'カテゴリIndexで与えられるデータセットの変数との交差エントロピーを最小化するニューラルネットワークの出力層です。',
            softmaxCrossEntropy: 'カテゴリIndexで与えられるデータセットの変数との交差エントロピーを最小化するニューラルネットワークの出力層です。',
            kLMultinomial: '多項分布である入力の確率分布（p）と、データセットの変数（q）とのKullback Leibler距離を最小化するニューラルネットワークの出力層です。',
            workingMemory: '演算結果を一次的に格納することができるバッファです。',
            depthwiseConvolution: '入力値に対して、Map毎に畳み込み演算を行うレイヤーです。',
            deconvolution: '入力値に対して逆畳み込み演算を行うレイヤーです。',
            depthwiseDeconvolution: '入力値に対して、Map毎に逆畳み込み演算を行うレイヤーです。',
            embed: '入力値を0～N-1（Nはクラス数）の整数値で表される離散シンボルであると仮定し、各シンボルに指定サイズの配列を割り当てます。',
            globalAveragePooling: '配列の最後の2次元全体の平均値を出力します。',
            leakyReLU: 'ReLUが0以下の入力に対して常に0を出力するのに対し、0以下の入力に対しても一定値をかけて出力するようにしたものです。',
            sELU: '入力値のSELU（Scaled Exponential Linear Unit）による処理結果を出力します。',
            swish: '入力値のSwishによる処理結果を出力します。',
            repeatStart: '繰り返しの開始位置を示すレイヤーです。',
            repeatEnd: '繰り返し終了位置を示すレイヤーです。',
            recurrentInput: 'Recurrent Neural Networkの時間ループ開始位置を示すレイヤーです。',
            recurrentOutput: 'Recurrent Neural Networkの時間ループ終了位置を示すレイヤーです。',
            delay: 'RecurrentNeuralNetworkにおける時間遅れ信号を示すレイヤーです。',
            fixedPointQuantize: '線形量子化を行います。',
            pow2Quantize: '2べきの量子化を行います。',
            argument: 'ユニットネットワークにおいて、呼び出し元ネットワークからUnitのプロパティとして編集可能にする引数を設定します。',
            fFT: '複素数入力、複素数出力のフーリエ変換を行います。',
            iFFT: '複素数入力、複素数出力の逆フーリエ変換を行います。',
            mean: '指定次元の値の平均を求めます。',
            prod: '指定次元の値の積を求めます。',
            max: '指定次元の値の最大値を求めます。',
            min: '指定次元の値の最小値を求めます。',
            log: 'eを底とする自然対数を計算します。',
            exp: 'eを底とする指数関数を計算します。',
            sign: '負の入力に対し-1を、正の入力に対し+1,、0に対しalphaを出力します。',
            batchMatmul: '入力(A)と、コネクタRの入力(B)の最後の2次元で表される行列の行列積を計算します。',
            ceil: '入力値の小数点以下を切り上げます。',
            floor: '入力値の小数点以下を切り捨てます。',
            sin: 'o=sin(i)',
            cos: 'o=cos(i)',
            tan: 'o=tan(i)',
            sinh: 'o=sinh(i)',
            cosh: 'o=cosh(i)',
            aSin: 'o=arcsin(i)',
            aCos: 'o=arccos(i)',
            aTan: 'o=arctan(i)',
            aSinh: 'o=asinh(i)',
            aCosh: 'o=asinh(i)',
            aTanh: 'o=atanh(i)',
            // addScalar: 'o=i+value',
            // mulScalar: 'o=i*value',
            // rSubScalar: 'o=value-i',
            // rDivScalar:	'o=value/i',
            // powScalar: 'o=i value',
            // rPowScalar:	'o=value i',
            // maximumScalar: 'o=max (i,value)',
            // minimumScalar: 'o=min(i,value)',
            // add2: 'o=i1+i2',
            // sub2: 'o=i1-i2',
            // mul2: 'o=i1*i2',
            // div2: 'o=i1/i2 右辺i2に用いる入力はコネクタRに接続します',
            // pow2: 'o=i1i2 右辺i2に用いる入力はコネクタRに接続します',
            // maxmum2: 'o=max(i1,i2)',
            // minimum2: 'o=min(i1,i2)',
            logicalAnd:	'o= i1 and i2',
            logicalOr: 'o= i1 or i2',
            logicalXor:	'o= i1 xor i2',
            equal: 'o= i1 == i2',
            notEqual: 'o= i1 != i2',
            greaterEqual: 'o= i1 >= i2',
            greater: 'o= i1 > i2',
            lessEqual: 'o= i1 <= i2',
            less: 'o= i1 < i2',
            logicalAndScalar: 'o= i and value',
            logicalOrScalar: 'o= i or value',
            logicalXorScalar: 'o= i xor value',
            equalScalar: 'o= i == value',
            notEqualScalar:	'o= i != value',
            greaterEqualScalar:	'o= i >= value',
            greaterScalar: 'o= i > value',
            lessEqualScalar: 'o= i <= value',
            lessScalar:	'o= i < value',
            logicalNot:	'o= !i',
            binaryError: '入力データと、正解を示すデータセットの変数Tそれぞれについて、0.5以上であるかどうかを基準に0または1へのバイナリ化を行い、バイナリの不一致をデータ毎に評価します。',
            topNError: '正解カテゴリの確率もしくはスコアが全カテゴリ中でTop N位以内に入っているかどうかをデータ毎に評価します。',
            concatenate: '二つ以上の配列を既存の軸で結合します。',
            broadcast: 'データをコピーすることで、要素数が1である配列の次元を指定したサイズに変換します。',
            pad: '配列の各次元に指定サイズの要素を追加します。',
            flip: '配列のうち、指定した次元の要素の順序を反転します。',
            shift: '配列の要素を指定分シフトします。',
            stack: '二つ以上の配列を新しい軸で結合します。',
            matrixDiag: '配列の最後の1次元を対角行列化します。',
            matrixDiagPart: '配列の最後の2次元の対角成分を抽出します。',
            clipGradByValue: '勾配の値を指定した範囲内に収めます。',
            clipGradByNorm: '勾配の値を指定したノルムの範囲に収めます。',
            topKData: '入力に含まれる大きい値から順にK個のみを残しその他の値を0にします。',
            topKGrad: '大きい勾配から順にK個のみを残しその他の値を0にします。',
            sort: '値の大小に応じてデータを並び替えます。',
            prune: '絶対値の小さい値から順に0にします。',
            interpolate: 'データを補完しながら拡大もしくは縮小します。',
            vATNoise: 'Virtual Adversarial Trainingとして知られる手法を実現するために用意されたレイヤーです。',
            unlink: 'Forward計算時は入力をそのまま出力し、Backward計算時は常にゼロを出力します。',
            identity: '入力をそのまま出力します。',
            oneHot: '入力インデックスを元にOneHot配列（特定の要素のみが1の配列）を作成します。',
            meanSubtraction: '入力値を平均0に正規化します。',
            randomFlip: '配列のうち、指定した次元の要素の順序を50%の確率で反転します。',
            randomShift: '配列の要素を指定した範囲内でランダムにシフトします。',
            randomCrop: '配列の一部をランダムに切り出します。',
            imageAugmentation: '入力画像にランダムな変化を加えます。',
            structureSearch: '構造自動探索に関する設定を行います。',
            unit: '現在の呼び出し元ネットワークにユニットネットワークを挿入します。',
            comment: 'ネットワークグラフにコメントを挿入します。',
            lSTM: 'LSTMユニットは試験的に実装されているレイヤーです。',
            broadcastTo: 'このレイヤーはNeural Network Librariesとの互換性を保つために用意されています。',
            nmsDetection2d: 'このレイヤーはNeural Network Librariesとの互換性を保つために用意されています。'
        },
        layer: {
            inputDataset: 'Neural Network Console CSV Format のheader部分のデータに相当する要素を入力します．通常はxです．',
            inputSize: 'データの次元です．カラー画像なら，3,height,widthです．',
            outputInput: 'ラベルに合わせます．10クラスの分類問題の場合なら，10になるように前のレイヤーの出力を調整します．分類問題ならAffine->Softmaxが前のレイヤーに相当します．',
            outputLossFunction: '通常，分類問題ならCategoricalCrossEntropy，回帰問題ならL2Squaredを選択します．',
            outputDataset: 'Neural Network Console CSV Format のheader部分のラベルに相当する要素を入力します．通常はyです．'
        }
    },
    dataset: {
        trainingButton: '学習用のデータセットです．',
        validationButton: '学習用のデータセットです．',
        uploadData: 'データのアップロードです．Download Utility Toolsを使ってデータを圧縮してから，アップロードしてください．アップロードできるファイルは，合計1GBまでです．',
        downloadUploader: 's3へのアップローダーおよびデータ圧縮のユティリティです．'
    },
    config: {
        data: {
            batchSize: 'この単位でサンプルがネットワーク入ります．'
        },
        environment: {
            local: 'Neural Network Consoleがホストされているホストで学習を実行するときに選択します．',
            aws: 'Neural Network ConsoleがAWS上にホストされていて，別インスタンスで学習を行いたいときに選択します．',
            processorType: 'GPUが利用可能な場合はGPUを選択してください．',
            cpu: 'CPUで学習するときに選択します．',
            gpu: 'GPUで学習するときに選択します．',
            multi_gpu: '複数GPUで学習するときに選択します．',
            single: '通常はこれを選択してください．'
        },
        optimizer: {
            baseLearningRate: '学習係数の初期値です．',
            decayParameter: '退化係数です．',
            learningRateControlMethod: '確率的勾配法の学習係数を決定するアルゴリズムです．',
            default: '確率的勾配法です．',
            momentum: '過去の勾配が退化していき現在の勾配の勢いを優先します．',
            adagrad: '適用的に学習係数が決まります．',
            adadelta: '適用的に学習係数が決まります．過去の勾配は指数関数的に影響をなくしていきます．一般的にAdagradより良いと言われています．',
            adam: '適用的に学習係数が決まります．過去の勾配および勾配の勾配は，指数関数的に影響をなくしてきます．良く利用される学習係数の決定手法です．',
            adamAlpha: 'パラメータ更新のステップサイズです．',
            adamBeta1: '過去の1次の勾配の影響が指数関数的に減っていく割合です．',
            adamBeta2: '過去の2次の勾配の影響が指数関数的に減っていく割合です．',
            learningRateMultiplier: '学習係数に掛かる係数です．',
            maxEpochs: '学習データセットを読み込む最大回数です．'
        },
        structureSearch: {
            structureSearchTitle: '構造自動探索です．シードとなるネットワーク構造を与えると，それをベースに最適なネットワーク構造を探索します．',
            iteratorLimit: '自動探索の上限回数です．上限はX，下限はYです．',
            method: '構造自動探索の手法です．',
            random: 'ランダム探索です．',
            networkFeatureGaussianProcess: 'ガウシアンプロセスによる探索です．'
        }
        
    },
    result: {
        tradeOffGraph: '学習誤差，バリデーション誤差，および関和回数の関係です．関和回数が小さくて，バリデーション誤差が小さい結果が良い結果となります．'
    },
    common: {
        backButton: '戻る',
        saveButton: '保存',
        saveAsButton: '別名で保存',
        undoButton: 'Undo',
        redoButton: 'Redo',
        cutButton: '切取り',
        copyButton: 'コピー',
        pasteButton: '貼付け',
        runButton: '学習の実行．現在の設定で学習を実行します．',
        profileButton: '設計中のニューラルネットワークの実行速度を詳細に測定します.',
        stopButton: '学習の中止．現在実行中の学習を中断します．',
        evaluateButton: '評価の実行．学習結果で評価します．'
    }
}

export default tooltip_ja