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

import $ from 'jquery';

class Project {
  constructor() {
    this.init();
  }

  init() {
    $(() => {
      type DescriptionType = {
        ja: string;
        en: string;
      };

      type ExplanationLinkType = {
        ja: string;
        en: string;
      };
      
      type SampleProjectTemplate = {
        copy_count: number;
        star_count: number;
        description: DescriptionType;
        project_id: string;
        project_name: string;
        sdcproj: string;
        explanationLink: ExplanationLinkType;
      };

      const SAMPLE_PROJECT_CONFIG_LIST: SampleProjectTemplate[] = [
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '最もシンプルな1層のニューラルネットワークによる画像の2クラス分類',
            en: 'Image binary classification using the simplest one-layer neural networks'
          },
          project_id: '1',
          project_name: '',
          sdcproj: 'tutorial/basics/01_logistic_regression.sdcproj',
          explanationLink: {
            ja: 'https://support.dl.sony.com/docs-ja/%E3%83%81%E3%83%A5%E3%83%BC%E3%83%88%E3%83%AA%E3%82%A2%E3%83%AB%EF%BC%9A%E3%82%B5%E3%83%B3%E3%83%97%E3%83%AB%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92%E7%94%A8%E3%81%84%E3%81%9F/',
            en: '/docs/training_using_a_sample_project.html'
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '4層Convolutional Neural Networkによる画像の2クラス分類',
            en: 'Image binary classification using 4-layer convolutional neural networks'
          },
          project_id: '2',
          project_name: '',
          sdcproj: 'tutorial/basics/02_binary_cnn.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Auto Encoder',
            en: 'Auto encoder'
          },
          project_id: '3',
          project_name: '',
          sdcproj: 'tutorial/basics/06_auto_encoder.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Deep Neural Networks',
            en: 'Deep neural networks'
          },
          project_id: '4',
          project_name: '',
          sdcproj: 'tutorial/basics/10_deep_mlp.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Convolutional Auto Encoder',
            en: 'Convolutional auto encoder'
          },
          project_id: '5',
          project_name: '',
          sdcproj: 'tutorial/basics/11_deconvolution.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Residual NetworksによるMNISTデータセットの分類',
            en: 'Image classification using residual networks on MNIST dataset'
          },
          project_id: '6',
          project_name: '',
          sdcproj: 'tutorial/basics/12_residual_learning.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '重みを2値化することでパラメータを大幅に削減したDNN',
            en: 'DNN that consumes much less memory by weight binalization'
          },
          project_id: '10',
          project_name: '',
          sdcproj: 'tutorial/binary_networks/binary_connect_mnist_MLP.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '重みを2値化することでパラメータを大幅に削減したCNN',
            en: 'CNN that consumes much less memory by weight binalization'
          },
          project_id: '11',
          project_name: '',
          sdcproj: 'tutorial/binary_networks/binary_connect_mnist_LeNet.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '重みとデータパスを2値化することでパラメータ、演算量を大幅に削減したDNN',
            en: 'DNN that consumes much less memory and computation by weight and data path binalization'
          },
          project_id: '12',
          project_name: '',
          sdcproj: 'tutorial/binary_networks/binary_net_mnist_MLP.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '重みとデータパスを2値化することでパラメータ、演算量を大幅に削減したCNN',
            en: 'CNN that consumes much less memory and computation by weight and data path binalization'
          },
          project_id: '13',
          project_name: '',
          sdcproj: 'tutorial/binary_networks/binary_net_mnist_LeNet.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '重みを2値化することでパラメータを大幅に削減したDNN',
            en: 'DNN that consumes much less memory by weight binalization'
          },
          project_id: '14',
          project_name: '',
          sdcproj: 'tutorial/binary_networks/binary_weight_mnist_MLP.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '最もシンプルなRecurrent Neural Network',
            en: 'The simplest recurrent neural networks'
          },
          project_id: '15',
          project_name: '',
          sdcproj: 'tutorial/recurrent_neural_networks/elman_net.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '双方向のRecurrent Neural Networks',
            en: 'Bi-directional recurrent neural networks'
          },
          project_id: '16',
          project_name: '',
          sdcproj: 'tutorial/recurrent_neural_networks/bidirectional_elman_net.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Attention機構を持つRecurrent Neural Network',
            en: 'Recurrent neural networks with attention'
          },
          project_id: '17',
          project_name: '',
          sdcproj: 'tutorial/recurrent_neural_networks/elman_net_with_attention.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Gated Recurrent Unit（GRU）と呼ばれるRecurrent Neural Networksの構造',
            en: 'Gated recurrent unit (GRU)'
          },
          project_id: '18',
          project_name: '',
          sdcproj: 'tutorial/recurrent_neural_networks/gated_recurrent_unit(GRU).sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Long Short Term Memory（LSTM）と呼ばれるRecurrent Neural Networksの構造',
            en: 'Long short term memory (LSTM)'
          },
          project_id: '19',
          project_name: '',
          sdcproj: 'tutorial/recurrent_neural_networks/long_short_term_memory(LSTM).sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'LSTMを用いたAuto Encoder',
            en: 'Auto encoder using LSTM'
          },
          project_id: '20',
          project_name: '',
          sdcproj: 'tutorial/recurrent_neural_networks/LSTM_auto_encoder.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'GRUを2回重ねたもの',
            en: 'Recurrent neural networks with 2 GRUs'
          },
          project_id: '21',
          project_name: '',
          sdcproj: 'tutorial/recurrent_neural_networks/stacked_GRU.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'CNNによるグーチョキパー、それ以外の4種の画像を分類。SPRESENSEでのデモ用サンプル',
            en: 'Example of 4-class hand-sign image classification for SPRESENSE'
          },
          project_id: '27',
          project_name: '',
          sdcproj: 'tutorial/image_classification/hand-sign.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'CNNによる数値画像の11分類。電力計などの数字認識等にも応用できる',
            en: 'Example of 11-class digits image classification for SPRESENSE'
          },
          project_id: '57',
          project_name: '',
          sdcproj: 'tutorial/image_classification/digits.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '入力特徴量の重み学習により認識結果に影響を及ぼす重要な特徴量の可視化する方法',
            en: 'Visualization method of importance of input data by learning weight of input data'
          },
          project_id: '52',
          project_name: '',
          sdcproj: 'tutorial/explainable_dl/01_visualize_weight_of_feature.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'L1 正則化により認識結果に影響を及ぼす重要な特徴量を可視化する方法',
            en: 'Visualization method of importance of input data using L1 regularization'
          },
          project_id: '53',
          project_name: '',
          sdcproj: 'tutorial/explainable_dl/02_l1_regularization.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Attentionにより、認識のために注目された入力データの箇所を明らかにする方法',
            en: 'Visualization method of attention area'
          },
          project_id: '29',
          project_name: '',
          sdcproj: 'tutorial/explainable_dl/03_attention.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '各層の出力結果を可視化する方法',
            en: 'Visualization method to check output of each data path'
          },
          project_id: '30',
          project_name: '',
          sdcproj: 'tutorial/explainable_dl/04_inference_result_at_each_layer.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'ニューラルネットワークによる予測結果の信頼度を可視化する方法',
            en: 'Visualization method of reliability of prediction results by neural networks'
          },
          project_id: '60',
          project_name: '',
          sdcproj: 'tutorial/explainable_dl/05_MCdropout.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '文字と背景を分離する2値セグメンテーション',
            en: 'Binary segmentation to separate letters and background'
          },
          project_id: '54',
          project_name: '',
          sdcproj: 'tutorial/semantic_segmentation/binary_semantic_segmentation.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '画像のセグメンテーション。U-Netと呼ばれるネットワーク構造を利用（20クラス分類）',
            en: '20 class semantic segmentation using U-Net'
          },
          project_id: '31',
          project_name: '',
          sdcproj: 'tutorial/semantic_segmentation/unetlike_125px.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '画像のセグメンテーション。U-Netと呼ばれるネットワーク構造を利用（2クラス分類）',
            en: '2 class semantic segmentation using U-Net'
          },
          project_id: '32',
          project_name: '',
          sdcproj: 'tutorial/semantic_segmentation/unetlike_125px_person.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '４つのキーボードのキースイッチの種類（メンブレン、パンタグラフ、メカニカル青軸、メカニカル赤軸）を打音から判別',
            en: 'Distinguish between four keyboard tap sounds (membrane, pantograph, mechanical blue switch and mechanical red switch)'
          },
          project_id: '59',
          project_name: '',
          sdcproj: 'voice_recognition/wav_keyboard_sound.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Auto Encoderを用いてサイン波に含まれるノイズを検出',
            en: 'Anormary detection from sin wave using auto encoder'
          },
          project_id: '28',
          project_name: '',
          sdcproj: 'tutorial/anomaly_detection/sin_wave_anomaly_detection.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '円、三角、四角形、五角形を含む人工画像データを用いた物体検出',
            en: 'Object detection using synthetic image data including ellipse, triangle, rectangle and pentagon'
          },
          project_id: '55',
          project_name: '',
          sdcproj: 'tutorial/object_detection/synthetic_image_object_detection.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '4層Convolutional Neural Networkによる画像の10クラス分類(MNISTデータセット)',
            en: 'Image classification using 4-layer convolutional neural networks on MNIST dataset'
          },
          project_id: '7',
          project_name: '',
          sdcproj: 'image_recognition/MNIST/LeNet.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'VATと呼ばれるテクニックを用いた半教師あり（少ないラベル付きデータを用いた）学習',
            en: 'Semi-supervised learning using variational auto encoder'
          },
          project_id: '8',
          project_name: '',
          sdcproj: 'image_recognition/MNIST/semi_supervised_learning_VAT.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '4層Convolutional Neural Networkによる画像の10クラス分類(Fashion MNISTデータセット)',
            en: 'Image classification using 4-layer convolutional neural networks on Fashion-MNIST dataset'
          },
          project_id: '35',
          project_name: '',
          sdcproj: 'image_recognition/FashionMNIST/LeNet.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '画像認識ラベルのみからの学習で、Localization（画像位置検出）を可能にするネットワーク',
            en: 'Weakly supervised image localizaion'
          },
          project_id: '37',
          project_name: '',
          sdcproj: 'image_recognition/CIFAR10/resnet/resnet-110-deepmil.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '画像の一部を塗りつぶす画像の水増し手法を用いることで、汎化性能を向上させるテクニック',
            en: 'Image augmentation by masking part of an image'
          },
          project_id: '58',
          project_name: '',
          sdcproj: 'image_recognition/CIFAR10/resnet/resnet-110-cutout.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2枚の画像を合成する画像の水増し手法を用いることで、汎化性能を向上させるテクニック',
            en: 'Image augmentation by blending 2 images'
          },
          project_id: '38',
          project_name: '',
          sdcproj: 'image_recognition/CIFAR10/resnet/resnet-110-mixup.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Residual Networksによる画像分類（CIFAR10データセット）',
            en: 'Image classification using residual networks on CIFAR-10 dataset'
          },
          project_id: '36',
          project_name: '',
          sdcproj: 'image_recognition/CIFAR10/resnet/resnet-110.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Residual Networksによる画像分類（CIFAR100データセット）',
            en: 'Image classification using residual networks on CIFAR-100 dataset'
          },
          project_id: '39',
          project_name: '',
          sdcproj: 'image_recognition/CIFAR100/resnet/resnet-110.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '浅いネットワーク～深いネットワークを同時に表現することでパラメータを削減したCNN',
            en: 'Light weight neural networks that express shallow and deep networks simultaneously'
          },
          project_id: '40',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/densenet/densenet-161.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2015年のImageNet Challengeで優勝した画像認識ネットワーク。Residual Networksと呼ばれる構造を持つ。',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2015'
          },
          project_id: '25',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/residual networks/resnet-101.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2015年のImageNet Challengeで優勝した画像認識ネットワーク。Residual Networksと呼ばれる構造を持つ。',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2015'
          },
          project_id: '26',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/residual networks/resnet-152.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2015年のImageNet Challengeで優勝した画像認識ネットワーク。Residual Networksと呼ばれる構造を持つ。',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2015'
          },
          project_id: '22',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/residual networks/resnet-18.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2015年のImageNet Challengeで優勝した画像認識ネットワーク。Residual Networksと呼ばれる構造を持つ。',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2015'
          },
          project_id: '23',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/residual networks/resnet-34.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2015年のImageNet Challengeで優勝した画像認識ネットワーク。Residual Networksと呼ばれる構造を持つ。',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2015'
          },
          project_id: '24',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/residual networks/resnet-50.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Grouped Convolutionを用いたResidual Networks',
            en: 'Residual networks with grouped convolution'
          },
          project_id: '41',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/resnext/resnext-101.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'シャッフル機構によりパラメータ数と演算量を大幅に削減したCNN',
            en: 'Light weight convolutional neural networks with shuffle structure'
          },
          project_id: '43',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/shufflenet/shufflenet-0.5x.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'シャッフル機構によりパラメータ数と演算量を大幅に削減したCNN',
            en: 'Light weight convolutional neural networks with shuffle structure'
          },
          project_id: '44',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/shufflenet/shufflenet-2.0x.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'シャッフル機構によりパラメータ数と演算量を大幅に削減したCNN',
            en: 'Light weight convolutional neural networks with shuffle structure'
          },
          project_id: '42',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/shufflenet/shufflenet.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'ボトルネック構造によりパラメータ数を大幅に削減したCNN',
            en: 'Light weight convolutional neural networks with bottle-neck structure'
          },
          project_id: '45',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/squeezenet/squeezenet11.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2013年のImageNet Challengeで優勝した画像認識ネットワーク',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2013'
          },
          project_id: '46',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/vgg/vgg-11.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2013年のImageNet Challengeで優勝した画像認識ネットワーク',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2013'
          },
          project_id: '47',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/vgg/vgg-13.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2013年のImageNet Challengeで優勝した画像認識ネットワーク',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2013'
          },
          project_id: '48',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/vgg/vgg-16.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2012年のImageNet Challengeで優勝した画像認識ネットワーク',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2012'
          },
          project_id: '49',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/alexnet.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: '2014年のImageNet Challengeで優勝した画像認識ネットワーク',
            en: 'Neural networks for image classification which is the winner of the ImageNet challenge 2014'
          },
          project_id: '50',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/GoogLeNet.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Network in Networksと呼ばれる構造のCNN',
            en: 'Network in networks'
          },
          project_id: '51',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/nin.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Squeese and Excitationブロックを用いたResNeXt',
            en: 'ResNeXt with "Squeese and Excitation" block'
          },
          project_id: '61',
          project_name: '',
          sdcproj: 'image_recognition/ILSVRC2012/senet-154.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Deep Convolutional Generative Adversarial Networks(DCGAN)',
            en: 'Deep Convolutional Generative Adversarial Networks(DCGAN)'
          },
          project_id: '56',
          project_name: '',
          sdcproj: 'image_generation/mnist_dcgan.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Deep Convolutional Generative Adversarial Networks(DCGAN)',
            en: 'Deep Convolutional Generative Adversarial Networks(DCGAN)'
          },
          project_id: '9',
          project_name: '',
          sdcproj: 'image_generation/mnist_dcgan_with_label.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'Variational Auto Encoder(VAE)',
            en: 'Variational auto encoder (VAE)'
          },
          project_id: '34',
          project_name: '',
          sdcproj: 'image_generation/mnist_vae.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
        {
          copy_count: 0,
          star_count: 0,
          description: {
            ja: 'あやめデータセットを用いたベクトル分類',
            en: 'Vector classification on iris flower dataset'
          },
          project_id: '33',
          project_name: '',
          sdcproj: 'classification/iris/iris.sdcproj',
          explanationLink: {
            ja: '',
            en: ''
          }
        },
      ];

      const $viewAllAction = $('.view-all-action');
      const $default = $('.default');
      const $all = $('.all');
      const $back = $('.back');
      const $tabItem = $('.tab_item');
      // const $publicProject = $('#public-project');
      const $sampleProjectTitle = $('#sample-project-title');
      const $publicProjectTitle = $('#public-project-title');
      const $sampleArea = $('#sample-area');
      const $publicArea = $('#public-area');
      const $starContentProjectList = $('#star_content .project-list');

      $.ajaxSetup({
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        xhrFields: { withCredentials: true }
      });

      $(() => {
        const isJA = window.location.href.indexOf(location.origin + '/ja') != -1;

        $viewAllAction.on('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          $default.hide();
          $('.all' + '.' + id).show();
        });

        $back.on('click', () => {
          $default.show();
          $all.hide();
        });

        $tabItem.on('click', () => {
          $default.show();
          $all.hide();
        });

        $sampleProjectTitle.on('click', () => {
          $sampleArea.show();
          $publicArea.hide();
        });

        $publicProjectTitle.on('click', () => {
          $sampleArea.hide();
          $publicArea.show();
        });

        // $publicProject.attr('src', PUBLIC_PROJECT_PAGE);

        const appendSampleProject = (sampleProjectList:SampleProjectTemplate[], starIds:string[]) => {
          sampleProjectList.forEach((sampleProject) => {
            let sampleProjectConfig:any = null;
            SAMPLE_PROJECT_CONFIG_LIST.forEach((config) => {
              if (config.project_id == sampleProject.project_id) {
                sampleProjectConfig = config;
              }
            });
            if (sampleProjectConfig == null) {
              return;
            }

            let selected = false;
            if (starIds) {
              selected = starIds.indexOf(sampleProject.project_id) != -1;
            }

            let appendItem = '<div class="unit project_' + sampleProject.project_id + '">';
            appendItem += '<div class="image-area">';
            appendItem += '<img src="/assets/images/' + sampleProject.project_id + '.png">';
            appendItem += '</div>';
            appendItem += '<div class="text-area">';
            appendItem += '<div class="title-area">';
            appendItem += '<h3 class="title" title="' + sampleProject.project_name + '">' + sampleProject.project_name + '</h3>';
            appendItem += '</div>';
            appendItem += '<div class="count-area">';
            appendItem += '<div class="copy-count-area" title="Copy count">';
            appendItem += '<div class="copy-img-area"><img src="/assets/images/Copy.svg"></div>';
            appendItem += '<div class="copy-count"></div>';
            appendItem += '</div>';
            appendItem += '<div class="star-count-area" title="Favorite count">';
            appendItem += '<div class="star read-only" data-project-id=' + sampleProject.project_id + '></div>';
            appendItem += '<div class="star-count"></div>';
            appendItem += '</div>';
            appendItem += '</div>';

            if (isJA) {
              appendItem += '<div class="description">' + sampleProjectConfig.description.ja + '</div>';
            } else {
              appendItem += '<div class="description">' + sampleProjectConfig.description.en + '</div>';
            }

            appendItem += '<div class="action">';
            if (isJA) {
              appendItem += '<a href="/console/#/project?project_id=' + sampleProject.project_id + '" target="_top">Cloudで開く</a>';
            } else {
              appendItem += '<a href="/console/#/project?project_id=' + sampleProject.project_id + '" target="_top">Open Project</a>';
            }

            appendItem += '<a href="/assets/sdcproj/' + sampleProjectConfig.sdcproj + '">Save as</a>';

            if (isJA && sampleProjectConfig.explanationLink.ja) {
              appendItem += '<a href="' + sampleProjectConfig.explanationLink.ja + '">解説を読む</a>';
            } else if (!isJA && sampleProjectConfig.explanationLink.en) {
              appendItem += '<a href="' + sampleProjectConfig.explanationLink.en + '" target="_blank">Read commentary</a>';
            }

            appendItem += '</div>';
            appendItem += '</div>';
            appendItem += '</div>';

            $starContentProjectList.append(appendItem);

            const $project = $('.project_' + sampleProject.project_id);
            $project.find('.copy-count').text(sampleProject.copy_count);
            $project.find('.star-count').text(sampleProject.star_count);

            if (selected) {
              $project.find('.star').addClass('selected');
            }
          });
        };
        
        const getSampleProject = (callback:any) => {
          $.ajax({
            url: '/v1/misc/sample_projects?sort_by=-star_count',
            type: 'get',
            dataType: 'json'
          }).done((res) => {
            callback(res.projects);
          }).fail(() => {
          });
        };

        const getStars = (callback:any) => {
          $.ajax({
            url: '/v1/users/' + userId + '/stars/projects',
            type: 'get',
            dataType: 'json'
          }).done((res) => {
            callback(res.project_ids);
          }).fail(() => {
          });
        };

        const addStar = (userId:string, projectId:string | undefined) => {
          $.ajax({
            url: '/v1/users/' + userId + '/stars/projects/' + projectId,
            type: 'put',
            dataType: 'json'
          }).done(() => {
            const $project = $('.project_' + projectId);
            const $stars = $project.find('.star');
            $stars.removeClass('read-only');
          }).fail(() => {
            const $project = $('.project_' + projectId);
            const $stars = $project.find('.star');
            $stars.removeClass('read-only');
            $stars.removeClass('selected');
            const $starCounts = $project.find('.star-count');
            const currentCount = Number($($starCounts[0]).text());
            $starCounts.text(currentCount - 1);
          });
        };

        const deleteStar = (userId:string, projectId:string | undefined) => {
          $.ajax({
            url: '/v1/users/' + userId + '/stars/projects/' + projectId,
            type: 'delete',
            dataType: 'json'
          }).done(() => {
            const $project = $('.project_' + projectId);
            const $stars = $project.find('.star');
            $stars.removeClass('read-only');
          }).fail((e) => {
            try {
              if (e.responseJSON.message == 'Not found starred project') {
                // すでに外している場合はreadonlyだけを削除する
                const $project = $('.project_' + projectId);
                const $stars = $project.find('.star');
                $stars.removeClass('read-only');
              } else {
                const $project = $('.project_' + projectId);
                const $stars = $project.find('.star');
                $stars.removeClass('read-only');
                $stars.addClass('selected');
                const $starCounts = $project.find('.star-count');
                const currentCount = Number($($starCounts[0]).text());
                $starCounts.text(currentCount + 1);
              }
            } catch (error) {
              const $project = $('.project_' + projectId);
              const $stars = $project.find('.star');
              $stars.removeClass('read-only');
              $stars.addClass('selected');
              const $starCounts = $project.find('.star-count');
              const currentCount = Number($($starCounts[0]).text());
              $starCounts.text(currentCount + 1);
            }
          });
        };

        const _onload = (xhr: XMLHttpRequest, resolve: (value?: any) => void, reject: (reason?: any) => void) => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr);
          }
        };

        const getSessionState = (userID: string) => {
          return new Promise((resolve, reject) => {
            const url = '/v1/session/' + userID + '/check';
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.withCredentials = true;
            xhr.onload = _onload.bind(this, xhr, resolve, reject);
            xhr.onerror = reject;
            xhr.send();
          });
        };

        const userId = localStorage.getItem('u');

        if (userId) {
          getSessionState(userId).then(() => {
            getSampleProject((sampleProjects:SampleProjectTemplate[]) => {
              getStars((starIds:string[]) => {
                // サインイン状態の場合
                appendSampleProject(sampleProjects, starIds);
                $('.star').removeClass('read-only');
                $('.star').on('click', () => {
                  const $this = $(this);
                  $this.addClass('read-only');
                  const projectId = $this.attr('data-project-id');
                  const $project = $('.project_' + projectId);
                  const $stars = $project.find('.star');
                  const $starCounts = $project.find('.star-count');
                  // 複数取得できるため、0番目のみでカウントを確認する
                  const currentCount = Number($($starCounts[0]).text());

                  if ($this.hasClass('selected')) {
                    deleteStar(userId, projectId);
                    $stars.removeClass('selected');
                    $starCounts.text(currentCount - 1);
                  } else {
                    addStar(userId, projectId);
                    $stars.addClass('selected');
                    $starCounts.text(currentCount + 1);
                  }
                });
              });
            });
          }, () => {
            // 非サインイン状態の場合
            localStorage.removeItem('u');
            getSampleProject((sampleProjects:any) => {
              getStars((starIds:string[]) => {
                appendSampleProject(sampleProjects, starIds);
              });
            });
          });
        } else {
          // 非サインイン状態の場合
          getSampleProject((sampleProjects:any) => {
            getStars((starIds:string[]) => {
              appendSampleProject(sampleProjects, starIds);
            });
          });
        }
      });
    });
  }
}

export { Project }
