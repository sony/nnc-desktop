<!-- Copyright 2024 Sony Group Corporation. -->
<!--
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
-->

<script lang="ts">
import { Project } from './components/project';

const projectInstance = new Project();
projectInstance.init();

export default {
  name: 'App'
}

</script>

<template>

<div id="app">
  <div class="project_en_only_main project_main en lv2">
    <div class="main-area">
      <div class="tabs">
        <input id="purpose" type="radio" name="tab_item" checked>
        <label class="tab_item" for="purpose">Search by purpose</label>
        <input id="technique" type="radio" name="tab_item">
        <label class="tab_item" for="technique">Search by technique</label>
        <input id="dataset" type="radio" name="tab_item">
        <label class="tab_item" for="dataset">Search by dataset</label>
        <input id="star" type="radio" name="tab_item">
        <label class="tab_item" for="star">Popularity ranking</label>

        <div id="purpose_content" class="tab_content">
          <div class="default project-list">
            <div class="unit view-all view-all-action" data-id="Imagerecognition">
              <div class="image-area">
                <img src="./assets/images/ImageRecognition.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">Image recognition</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
       
            <div class="unit view-all view-all-action" data-id="Imagegeneration">
              <div class="image-area">
                <img src="./assets/images/AutoEncoder.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">Image generation</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
          
            <div class="unit view-all view-all-action" data-id="Imagesegmentation">
              <div class="image-area">
                <img src="./assets/images/imagesegmentation.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">Image segmentation</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
          
            <div class="unit project_59">
              <div class="image-area">
                <img src="./assets/images/59.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="wav_keyboard_sound">wav_keyboard_sound</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="59"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Distinguish between four keyboard tap sounds (membrane, pantograph, mechanical blue switch and mechanical red switch)</div>
                <div class="action">
                  <a href="/console/#/project?project_id=59" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/voice_recognition/wav_keyboard_sound.sdcproj">Save as</a>
                </div>
              </div>
            </div>

            <div class="unit project_28">
              <div class="image-area">
                <img src="./assets/images/28.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.anomaly_detection.sin_wave_anomaly_detection">tutorial.anomaly_detection.sin_wave_anomaly_detection</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="28"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Anormary detection from sin wave using auto encoder</div>
                <div class="action">
                  <a href="/console/#/project?project_id=28" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/anomaly_detection/sin_wave_anomaly_detection.sdcproj">Save as</a>
                </div>
              </div>
            </div>

            <div class="unit project_55">
              <div class="image-area">
                <img src="./assets/images/55.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.object_detection.synthetic_image_object_detection">tutorial.object_detection.synthetic_image_object_detection</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="55"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Object detection using synthetic image data including ellipse, triangle, rectangle and pentagon</div>
                <div class="action">
                  <a href="/console/#/project?project_id=55" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/object_detection/synthetic_image_object_detection.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_33">
              <div class="image-area">
                <img src="./assets/images/33.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="classification.iris.iris">classification.iris.iris</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="33"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Vector classification on iris flower dataset</div>
                <div class="action">
                  <a href="/console/#/project?project_id=33" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/classification/iris/iris.sdcproj">Save as</a>
                </div>
              </div>
            </div>
          </div>
        
          <div class="all Imagerecognition">
            <div class="breadcrumb-list">
              <span class="back">Search by purpose</span>
              <span> > </span>
              <span>Image recognition</span>
            </div>
            <div class="project-list">

              <div class="unit project_1">
                <div class="image-area">
                  <img src="./assets/images/1.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.01_logistic_regression">tutorial.basics.01_logistic_regression</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="1"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image binary classification using the simplest one-layer neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=1" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/01_logistic_regression.sdcproj">Save as</a>
                    <a href="/docs/training_using_a_sample_project.html" target="_blank">Read commentary</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_2">
                <div class="image-area">
                  <img src="./assets/images/2.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.02_binary_cnn">tutorial.basics.02_binary_cnn</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="2"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image binary classification using 4-layer convolutional neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=2" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/02_binary_cnn.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_4">
                <div class="image-area">
                  <img src="./assets/images/4.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.10_deep_mlp">tutorial.basics.10_deep_mlp</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="4"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=4" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/10_deep_mlp.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_6">
                <div class="image-area">
                  <img src="./assets/images/6.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.12_residual_learning">tutorial.basics.12_residual_learning</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="6"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=6" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/12_residual_learning.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_10">
                <div class="image-area">
                  <img src="./assets/images/10.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_connect_mnist_MLP">tutorial.binary_networks.binary_connect_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="10"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=10" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_connect_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_11">
                <div class="image-area">
                  <img src="./assets/images/11.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_connect_mnist_LeNet">tutorial.binary_networks.binary_connect_mnist_LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="11"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">CNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=11" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_connect_mnist_LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_12">
                <div class="image-area">
                  <img src="./assets/images/12.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_net_mnist_MLP">tutorial.binary_networks.binary_net_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="12"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory and computation by weight and data path binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=12" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_net_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_13">
                <div class="image-area">
                  <img src="./assets/images/13.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_net_mnist_LeNet">tutorial.binary_networks.binary_net_mnist_LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="13"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">CNN that consumes much less memory and computation by weight and data path binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=13" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_net_mnist_LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_14">
                <div class="image-area">
                  <img src="./assets/images/14.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_weight_mnist_MLP">tutorial.binary_networks.binary_weight_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="14"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=14" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_weight_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_15">
                <div class="image-area">
                  <img src="./assets/images/15.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.elman_net">tutorial.recurrent_neural_networks.elman_net</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="15"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">The simplest recurrent neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=15" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/elman_net.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_16">
                <div class="image-area">
                  <img src="./assets/images/16.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.bidirectional_elman_net">tutorial.recurrent_neural_networks.bidirectional_elman_net</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="16"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Bi-directional recurrent neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=16" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/bidirectional_elman_net.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_17">
                <div class="image-area">
                  <img src="./assets/images/17.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.elman_net_with_attention">tutorial.recurrent_neural_networks.elman_net_with_attention</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="17"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Recurrent neural networks with attention</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=17" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/elman_net_with_attention.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_18">
                <div class="image-area">
                  <img src="./assets/images/18.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.gated_recurrent_unit(GRU)">tutorial.recurrent_neural_networks.gated_recurrent_unit(GRU)</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="18"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Gated recurrent unit (GRU)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=18" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/gated_recurrent_unit(GRU).sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_19">
                <div class="image-area">
                  <img src="./assets/images/19.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.long_short_term_memory(LSTM)">tutorial.recurrent_neural_networks.long_short_term_memory(LSTM)</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="19"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Long short term memory (LSTM)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=19" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/long_short_term_memory(LSTM).sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_21">
                <div class="image-area">
                  <img src="./assets/images/21.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.stacked_GRU">tutorial.recurrent_neural_networks.stacked_GRU</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="21"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Recurrent neural networks with 2 GRUs</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=21" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/stacked_GRU.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_27">
                <div class="image-area">
                  <img src="./assets/images/27.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.image_classification.hand-sign">tutorial.image_classification.hand-sign</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="27"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Example of 4-class hand-sign image classification for SPRESENSE</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=27" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/image_classification/hand-sign.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_57">
                <div class="image-area">
                  <img src="./assets/images/57.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.image_classification.digits">tutorial.image_classification.digits</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="57"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Example of 11-class digits image classification for SPRESENSE</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=57" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/image_classification/digits.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_52">
                <div class="image-area">
                  <img src="./assets/images/52.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.01_visualize_weight_of_feature">tutorial.explainable_dl.01_visualize_weight_of_feature</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="52"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of importance of input data by learning weight of input data</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=52" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/01_visualize_weight_of_feature.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_53">
                <div class="image-area">
                  <img src="./assets/images/53.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.02_l1_regularization">tutorial.explainable_dl.02_l1_regularization</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="53"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of importance of input data using L1 regularization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=53" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/02_l1_regularization.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_29">
                <div class="image-area">
                  <img src="./assets/images/29.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.03_attention">tutorial.explainable_dl.03_attention</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="29"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of attention area</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=29" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/03_attention.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_30">
                <div class="image-area">
                  <img src="./assets/images/30.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.04_inference_result_at_each_layer">tutorial.explainable_dl.04_inference_result_at_each_layer</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="30"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method to check output of each data path</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=30" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/04_inference_result_at_each_layer.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_60">
                <div class="image-area">
                  <img src="./assets/images/60.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.05_MCdropout">tutorial.explainable_dl.05_MCdropout</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="60"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of reliability of prediction results by neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=60" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/05_MCdropout.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_7">
                <div class="image-area">
                  <img src="./assets/images/7.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.MNIST.LeNet">image_recognition.MNIST.LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="7"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using 4-layer convolutional neural networks on MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=7" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/MNIST/LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_8">
                <div class="image-area">
                  <img src="./assets/images/8.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.MNIST.semi_supervised_learning_VAT">image_recognition.MNIST.semi_supervised_learning_VAT</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="8"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Semi-supervised learning using variational auto encoder</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=8" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/MNIST/semi_supervised_learning_VAT.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_35">
                <div class="image-area">
                  <img src="./assets/images/35.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.FashionMNIST.LeNet">image_recognition.FashionMNIST.LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="35"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using 4-layer convolutional neural networks on Fashion-MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=35" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/FashionMNIST/LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_37">
                <div class="image-area">
                  <img src="./assets/images/37.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-deepmil">image_recognition.CIFAR10.resnet.resnet-110-deepmil</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="37"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Weakly supervised image localizaion</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=37" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-deepmil.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_58">
                <div class="image-area">
                  <img src="./assets/images/58.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-cutout">image_recognition.CIFAR10.resnet.resnet-110-cutout</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="58"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image augmentation by masking part of an image</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=58" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-cutout.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_38">
                <div class="image-area">
                  <img src="./assets/images/38.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-mixup">image_recognition.CIFAR10.resnet.resnet-110-mixup</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="38"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image augmentation by blending 2 images</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=38" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-mixup.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_36">
                <div class="image-area">
                  <img src="./assets/images/36.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110">image_recognition.CIFAR10.resnet.resnet-110</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="36"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on CIFAR-10 dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=36" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_39">
                <div class="image-area">
                  <img src="./assets/images/39.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR100.resnet.resnet-110">image_recognition.CIFAR100.resnet.resnet-110</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="39"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on CIFAR-100 dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=39" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR100/resnet/resnet-110.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_40">
                <div class="image-area">
                  <img src="./assets/images/40.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.densenet.densenet-161">image_recognition.ILSVRC2012.densenet.densenet-161</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="40"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight neural networks that express shallow and deep networks simultaneously</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=40" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/densenet/densenet-161.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_25">
                <div class="image-area">
                  <img src="./assets/images/25.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-101">image_recognition.ILSVRC2012.residual networks.resnet-101</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="25"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=25" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-101.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_26">
                <div class="image-area">
                  <img src="./assets/images/26.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-152">image_recognition.ILSVRC2012.residual networks.resnet-152</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="26"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=26" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-152.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_22">
                <div class="image-area">
                  <img src="./assets/images/22.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-18">image_recognition.ILSVRC2012.residual networks.resnet-18</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="22"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=22" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-18.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_23">
                <div class="image-area">
                  <img src="./assets/images/23.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-34">image_recognition.ILSVRC2012.residual networks.resnet-34</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="23"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=23" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-34.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_24">
                <div class="image-area">
                  <img src="./assets/images/24.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-50">image_recognition.ILSVRC2012.residual networks.resnet-50</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="24"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=24" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-50.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_41">
                <div class="image-area">
                  <img src="./assets/images/41.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.resnext.resnext-101">image_recognition.ILSVRC2012.resnext.resnext-101</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="41"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Residual networks with grouped convolution</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=41" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/resnext/resnext-101.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_43">
                <div class="image-area">
                  <img src="./assets/images/43.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet-0.5x">image_recognition.ILSVRC2012.shufflenet.shufflenet-0.5x</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="43"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=43" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet-0.5x.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_44">
                <div class="image-area">
                  <img src="./assets/images/44.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet-2.0x">image_recognition.ILSVRC2012.shufflenet.shufflenet-2.0x</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="44"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=44" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet-2.0x.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_42">
                <div class="image-area">
                  <img src="./assets/images/42.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet">image_recognition.ILSVRC2012.shufflenet.shufflenet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="42"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=42" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_45">
                <div class="image-area">
                  <img src="./assets/images/45.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.squeezenet.squeezenet11">image_recognition.ILSVRC2012.squeezenet.squeezenet11</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="45"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with bottle-neck structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=45" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/squeezenet/squeezenet11.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_46">
                <div class="image-area">
                  <img src="./assets/images/46.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-11">image_recognition.ILSVRC2012.vgg.vgg-11</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="46"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=46" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-11.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_47">
                <div class="image-area">
                  <img src="./assets/images/47.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-13">image_recognition.ILSVRC2012.vgg.vgg-13</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="47"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=47" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-13.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_48">
                <div class="image-area">
                  <img src="./assets/images/48.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-16">image_recognition.ILSVRC2012.vgg.vgg-16</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="48"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=48" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-16.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_49">
                <div class="image-area">
                  <img src="./assets/images/49.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.alexnet">image_recognition.ILSVRC2012.alexnet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="49"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2012</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=49" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/alexnet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_50">
                <div class="image-area">
                  <img src="./assets/images/50.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.GoogLeNet">image_recognition.ILSVRC2012.GoogLeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="50"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2014</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=50" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/GoogLeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_51">
                <div class="image-area">
                  <img src="./assets/images/51.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.nin">image_recognition.ILSVRC2012.nin</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="51"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Network in networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=51" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/nin.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_61">
                <div class="image-area">
                  <img src="./assets/images/61.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.senet-154">image_recognition.ILSVRC2012.senet-154</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="61"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">ResNeXt with &#34;Squeese and Excitation&#34; block</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=61" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/senet-154.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
            </div>
          </div>
        
          <div class="all Imagegeneration">
            <div class="breadcrumb-list">
              <span class="back">Search by purpose</span>
              <span> > </span>
              <span>Image generation</span>
            </div>
            <div class="project-list">
                
              <div class="unit project_3">
                <div class="image-area">
                  <img src="./assets/images/3.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.06_auto_encoder">tutorial.basics.06_auto_encoder</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="3"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Auto encoder</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=3" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/06_auto_encoder.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_5">
                <div class="image-area">
                  <img src="./assets/images/5.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.11_deconvolution">tutorial.basics.11_deconvolution</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="5"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Convolutional auto encoder</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=5" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/11_deconvolution.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_20">
                <div class="image-area">
                  <img src="./assets/images/20.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.LSTM_auto_encoder">tutorial.recurrent_neural_networks.LSTM_auto_encoder</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="20"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Auto encoder using LSTM</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=20" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/LSTM_auto_encoder.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_56">
                <div class="image-area">
                  <img src="./assets/images/56.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_dcgan">image_generation.mnist_dcgan</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="56"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep Convolutional Generative Adversarial Networks(DCGAN)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=56" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_dcgan.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_9">
                <div class="image-area">
                  <img src="./assets/images/9.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_dcgan_with_label">image_generation.mnist_dcgan_with_label</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="9"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep Convolutional Generative Adversarial Networks(DCGAN)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=9" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_dcgan_with_label.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_34">
                <div class="image-area">
                  <img src="./assets/images/34.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_vae">image_generation.mnist_vae</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="34"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Variational auto encoder (VAE)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=34" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_vae.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
            </div>

          </div>
        
          <div class="all Imagesegmentation">
            <div class="breadcrumb-list">
              <span class="back">Search by purpose</span>
              <span> > </span>
              <span>Image segmentation</span>
            </div>
            <div class="project-list">
                
              <div class="unit project_54">
                <div class="image-area">
                  <img src="./assets/images/54.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.semantic_segmentation.binary_semantic_segmentation">tutorial.semantic_segmentation.binary_semantic_segmentation</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="54"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Binary segmentation to separate letters and background</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=54" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/semantic_segmentation/binary_semantic_segmentation.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_31">
                <div class="image-area">
                  <img src="./assets/images/31.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.semantic_segmentation.unetlike_125px">tutorial.semantic_segmentation.unetlike_125px</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="31"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">20 class semantic segmentation using U-Net</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=31" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/semantic_segmentation/unetlike_125px.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_32">
                <div class="image-area">
                  <img src="./assets/images/32.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.semantic_segmentation.unetlike_125px_person">tutorial.semantic_segmentation.unetlike_125px_person</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="32"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">2 class semantic segmentation using U-Net</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=32" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/semantic_segmentation/unetlike_125px_person.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
            </div>

          </div>
        

        </div>

        <div id="technique_content" class="tab_content">
          <div class="default project-list">
            
            <div class="unit view-all view-all-action" data-id="CNN">
              <div class="image-area">
                <img src="./assets/images/2.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">CNN</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
            
            <div class="unit view-all view-all-action" data-id="ResNet">
              <div class="image-area">
                <img src="./assets/images/6.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">ResNet</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
            
            <div class="unit view-all view-all-action" data-id="DNN">
              <div class="image-area">
                <img src="./assets/images/4.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">DNN</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
            
            <div class="unit view-all view-all-action" data-id="BNN">
              <div class="image-area">
                <img src="./assets/images/10.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">BNN</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
            
            <div class="unit view-all view-all-action" data-id="RNN">
              <div class="image-area">
                <img src="./assets/images/15.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">RNN</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
            
                
            <div class="unit project_1">
              <div class="image-area">
                <img src="./assets/images/1.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.basics.01_logistic_regression">tutorial.basics.01_logistic_regression</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="1"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Image binary classification using the simplest one-layer neural networks</div>
                <div class="action">
                  <a href="/console/#/project?project_id=1" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/basics/01_logistic_regression.sdcproj">Save as</a>
                  <a href="/docs/training_using_a_sample_project.html" target="_blank">Read commentary</a>
                </div>
              </div>
            </div>
                
            <div class="unit project_3">
              <div class="image-area">
                <img src="./assets/images/3.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.basics.06_auto_encoder">tutorial.basics.06_auto_encoder</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="3"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Auto encoder</div>
                <div class="action">
                  <a href="/console/#/project?project_id=3" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/basics/06_auto_encoder.sdcproj">Save as</a>
                </div>
              </div>
            </div>
                
            <div class="unit project_5">
              <div class="image-area">
                <img src="./assets/images/5.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.basics.11_deconvolution">tutorial.basics.11_deconvolution</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="5"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Convolutional auto encoder</div>
                <div class="action">
                  <a href="/console/#/project?project_id=5" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/basics/11_deconvolution.sdcproj">Save as</a>
                </div>
              </div>
            </div>
                
            <div class="unit project_28">
              <div class="image-area">
                <img src="./assets/images/28.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.anomaly_detection.sin_wave_anomaly_detection">tutorial.anomaly_detection.sin_wave_anomaly_detection</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="28"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Anormary detection from sin wave using auto encoder</div>
                <div class="action">
                  <a href="/console/#/project?project_id=28" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/anomaly_detection/sin_wave_anomaly_detection.sdcproj">Save as</a>
                </div>
              </div>
            </div>
                
          </div>
          
          <div class="all CNN">
            <div class="breadcrumb-list">
              <span class="back">Search by technique</span>
              <span> > </span>
              <span>CNN</span>
            </div>
            <div class="project-list">
                  
              <div class="unit project_2">
                <div class="image-area">
                  <img src="./assets/images/2.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.02_binary_cnn">tutorial.basics.02_binary_cnn</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="2"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image binary classification using 4-layer convolutional neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=2" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/02_binary_cnn.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_27">
                <div class="image-area">
                  <img src="./assets/images/27.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.image_classification.hand-sign">tutorial.image_classification.hand-sign</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="27"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Example of 4-class hand-sign image classification for SPRESENSE</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=27" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/image_classification/hand-sign.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_57">
                <div class="image-area">
                  <img src="./assets/images/57.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.image_classification.digits">tutorial.image_classification.digits</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="57"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Example of 11-class digits image classification for SPRESENSE</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=57" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/image_classification/digits.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_30">
                <div class="image-area">
                  <img src="./assets/images/30.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.04_inference_result_at_each_layer">tutorial.explainable_dl.04_inference_result_at_each_layer</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="30"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method to check output of each data path</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=30" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/04_inference_result_at_each_layer.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_60">
                <div class="image-area">
                  <img src="./assets/images/60.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.05_MCdropout">tutorial.explainable_dl.05_MCdropout</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="60"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of reliability of prediction results by neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=60" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/05_MCdropout.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_35">
                <div class="image-area">
                  <img src="./assets/images/35.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.FashionMNIST.LeNet">image_recognition.FashionMNIST.LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="35"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using 4-layer convolutional neural networks on Fashion-MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=35" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/FashionMNIST/LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_54">
                <div class="image-area">
                  <img src="./assets/images/54.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.semantic_segmentation.binary_semantic_segmentation">tutorial.semantic_segmentation.binary_semantic_segmentation</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="54"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Binary segmentation to separate letters and background</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=54" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/semantic_segmentation/binary_semantic_segmentation.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_7">
                <div class="image-area">
                  <img src="./assets/images/7.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.MNIST.LeNet">image_recognition.MNIST.LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="7"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using 4-layer convolutional neural networks on MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=7" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/MNIST/LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_36">
                <div class="image-area">
                  <img src="./assets/images/36.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110">image_recognition.CIFAR10.resnet.resnet-110</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="36"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on CIFAR-10 dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=36" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_39">
                <div class="image-area">
                  <img src="./assets/images/39.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR100.resnet.resnet-110">image_recognition.CIFAR100.resnet.resnet-110</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="39"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on CIFAR-100 dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=39" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR100/resnet/resnet-110.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_40">
                <div class="image-area">
                  <img src="./assets/images/40.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.densenet.densenet-161">image_recognition.ILSVRC2012.densenet.densenet-161</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="40"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight neural networks that express shallow and deep networks simultaneously</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=40" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/densenet/densenet-161.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_43">
                <div class="image-area">
                  <img src="./assets/images/43.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet-0.5x">image_recognition.ILSVRC2012.shufflenet.shufflenet-0.5x</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="43"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=43" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet-0.5x.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_44">
                <div class="image-area">
                  <img src="./assets/images/44.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet-2.0x">image_recognition.ILSVRC2012.shufflenet.shufflenet-2.0x</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="44"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=44" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet-2.0x.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_42">
                <div class="image-area">
                  <img src="./assets/images/42.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet">image_recognition.ILSVRC2012.shufflenet.shufflenet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="42"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=42" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_45">
                <div class="image-area">
                  <img src="./assets/images/45.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.squeezenet.squeezenet11">image_recognition.ILSVRC2012.squeezenet.squeezenet11</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="45"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with bottle-neck structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=45" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/squeezenet/squeezenet11.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_46">
                <div class="image-area">
                  <img src="./assets/images/46.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-11">image_recognition.ILSVRC2012.vgg.vgg-11</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="46"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=46" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-11.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_47">
                <div class="image-area">
                  <img src="./assets/images/47.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-13">image_recognition.ILSVRC2012.vgg.vgg-13</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="47"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=47" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-13.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_48">
                <div class="image-area">
                  <img src="./assets/images/48.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-16">image_recognition.ILSVRC2012.vgg.vgg-16</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="48"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=48" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-16.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_49">
                <div class="image-area">
                  <img src="./assets/images/49.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.alexnet">image_recognition.ILSVRC2012.alexnet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="49"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2012</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=49" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/alexnet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_50">
                <div class="image-area">
                  <img src="./assets/images/50.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.GoogLeNet">image_recognition.ILSVRC2012.GoogLeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="50"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2014</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=50" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/GoogLeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_51">
                <div class="image-area">
                  <img src="./assets/images/51.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.nin">image_recognition.ILSVRC2012.nin</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="51"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Network in networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=51" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/nin.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_6">
                <div class="image-area">
                  <img src="./assets/images/6.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.12_residual_learning">tutorial.basics.12_residual_learning</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="6"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=6" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/12_residual_learning.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_22">
                <div class="image-area">
                  <img src="./assets/images/22.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-18">image_recognition.ILSVRC2012.residual networks.resnet-18</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="22"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=22" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-18.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_23">
                <div class="image-area">
                  <img src="./assets/images/23.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-34">image_recognition.ILSVRC2012.residual networks.resnet-34</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="23"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=23" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-34.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_24">
                <div class="image-area">
                  <img src="./assets/images/24.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-50">image_recognition.ILSVRC2012.residual networks.resnet-50</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="24"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=24" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-50.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_25">
                <div class="image-area">
                  <img src="./assets/images/25.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-101">image_recognition.ILSVRC2012.residual networks.resnet-101</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="25"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=25" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-101.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_26">
                <div class="image-area">
                  <img src="./assets/images/26.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-152">image_recognition.ILSVRC2012.residual networks.resnet-152</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="26"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=26" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-152.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_41">
                <div class="image-area">
                  <img src="./assets/images/41.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.resnext.resnext-101">image_recognition.ILSVRC2012.resnext.resnext-101</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="41"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Residual networks with grouped convolution</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=41" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/resnext/resnext-101.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_61">
                <div class="image-area">
                  <img src="./assets/images/61.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.senet-154">image_recognition.ILSVRC2012.senet-154</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="61"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">ResNeXt with &#34;Squeese and Excitation&#34; block</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=61" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/senet-154.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_11">
                <div class="image-area">
                  <img src="./assets/images/11.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_connect_mnist_LeNet">tutorial.binary_networks.binary_connect_mnist_LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="11"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">CNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=11" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_connect_mnist_LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_13">
                <div class="image-area">
                  <img src="./assets/images/13.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_net_mnist_LeNet">tutorial.binary_networks.binary_net_mnist_LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="13"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">CNN that consumes much less memory and computation by weight and data path binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=13" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_net_mnist_LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_31">
                <div class="image-area">
                  <img src="./assets/images/31.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.semantic_segmentation.unetlike_125px">tutorial.semantic_segmentation.unetlike_125px</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="31"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">20 class semantic segmentation using U-Net</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=31" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/semantic_segmentation/unetlike_125px.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_32">
                <div class="image-area">
                  <img src="./assets/images/32.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.semantic_segmentation.unetlike_125px_person">tutorial.semantic_segmentation.unetlike_125px_person</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="32"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">2 class semantic segmentation using U-Net</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=32" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/semantic_segmentation/unetlike_125px_person.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_59">
                <div class="image-area">
                  <img src="./assets/images/59.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="wav_keyboard_sound">wav_keyboard_sound</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="59"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Distinguish between four keyboard tap sounds (membrane, pantograph, mechanical blue switch and mechanical red switch)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=59" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/voice_recognition/wav_keyboard_sound.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_9">
                <div class="image-area">
                  <img src="./assets/images/9.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_dcgan_with_label">image_generation.mnist_dcgan_with_label</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="9"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep Convolutional Generative Adversarial Networks(DCGAN)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=9" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_dcgan_with_label.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_56">
                <div class="image-area">
                  <img src="./assets/images/56.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_dcgan">image_generation.mnist_dcgan</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="56"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep Convolutional Generative Adversarial Networks(DCGAN)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=56" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_dcgan.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_37">
                <div class="image-area">
                  <img src="./assets/images/37.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-deepmil">image_recognition.CIFAR10.resnet.resnet-110-deepmil</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="37"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Weakly supervised image localizaion</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=37" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-deepmil.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_58">
                <div class="image-area">
                  <img src="./assets/images/58.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-cutout">image_recognition.CIFAR10.resnet.resnet-110-cutout</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="58"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image augmentation by masking part of an image</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=58" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-cutout.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_38">
                <div class="image-area">
                  <img src="./assets/images/38.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-mixup">image_recognition.CIFAR10.resnet.resnet-110-mixup</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="38"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image augmentation by blending 2 images</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=38" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-mixup.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_55">
                <div class="image-area">
                  <img src="./assets/images/55.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.object_detection.synthetic_image_object_detection">tutorial.object_detection.synthetic_image_object_detection</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="55"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Object detection using synthetic image data including ellipse, triangle, rectangle and pentagon</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=55" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/object_detection/synthetic_image_object_detection.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
            </div>

          </div>
          
          <div class="all ResNet">
            <div class="breadcrumb-list">
              <span class="back">Search by technique</span>
              <span> > </span>
              <span>ResNet</span>
            </div>
            <div class="project-list">
                  
              <div class="unit project_6">
                <div class="image-area">
                  <img src="./assets/images/6.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.12_residual_learning">tutorial.basics.12_residual_learning</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="6"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=6" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/12_residual_learning.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_22">
                <div class="image-area">
                  <img src="./assets/images/22.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-18">image_recognition.ILSVRC2012.residual networks.resnet-18</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="22"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=22" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-18.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_23">
                <div class="image-area">
                  <img src="./assets/images/23.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-34">image_recognition.ILSVRC2012.residual networks.resnet-34</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="23"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=23" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-34.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_24">
                <div class="image-area">
                  <img src="./assets/images/24.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-50">image_recognition.ILSVRC2012.residual networks.resnet-50</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="24"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=24" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-50.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_25">
                <div class="image-area">
                  <img src="./assets/images/25.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-101">image_recognition.ILSVRC2012.residual networks.resnet-101</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="25"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=25" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-101.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_26">
                <div class="image-area">
                  <img src="./assets/images/26.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-152">image_recognition.ILSVRC2012.residual networks.resnet-152</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="26"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=26" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-152.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_41">
                <div class="image-area">
                  <img src="./assets/images/41.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.resnext.resnext-101">image_recognition.ILSVRC2012.resnext.resnext-101</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="41"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Residual networks with grouped convolution</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=41" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/resnext/resnext-101.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_61">
                <div class="image-area">
                  <img src="./assets/images/61.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.senet-154">image_recognition.ILSVRC2012.senet-154</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="61"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">ResNeXt with &#34;Squeese and Excitation&#34; block</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=61" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/senet-154.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
            </div>
          </div>
          
          <div class="all DNN">
            <div class="breadcrumb-list">
              <span class="back">Search by technique</span>
              <span> > </span>
              <span>DNN</span>
            </div>
            <div class="project-list">
                  
              <div class="unit project_4">
                <div class="image-area">
                  <img src="./assets/images/4.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.10_deep_mlp">tutorial.basics.10_deep_mlp</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="4"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=4" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/10_deep_mlp.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_10">
                <div class="image-area">
                  <img src="./assets/images/10.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_connect_mnist_MLP">tutorial.binary_networks.binary_connect_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="10"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=10" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_connect_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_12">
                <div class="image-area">
                  <img src="./assets/images/12.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_net_mnist_MLP">tutorial.binary_networks.binary_net_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="12"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory and computation by weight and data path binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=12" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_net_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_14">
                <div class="image-area">
                  <img src="./assets/images/14.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_weight_mnist_MLP">tutorial.binary_networks.binary_weight_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="14"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=14" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_weight_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_52">
                <div class="image-area">
                  <img src="./assets/images/52.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.01_visualize_weight_of_feature">tutorial.explainable_dl.01_visualize_weight_of_feature</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="52"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of importance of input data by learning weight of input data</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=52" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/01_visualize_weight_of_feature.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_53">
                <div class="image-area">
                  <img src="./assets/images/53.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.02_l1_regularization">tutorial.explainable_dl.02_l1_regularization</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="53"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of importance of input data using L1 regularization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=53" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/02_l1_regularization.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_29">
                <div class="image-area">
                  <img src="./assets/images/29.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.03_attention">tutorial.explainable_dl.03_attention</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="29"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of attention area</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=29" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/03_attention.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_33">
                <div class="image-area">
                  <img src="./assets/images/33.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="classification.iris.iris">classification.iris.iris</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="33"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Vector classification on iris flower dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=33" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/classification/iris/iris.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_34">
                <div class="image-area">
                  <img src="./assets/images/34.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_vae">image_generation.mnist_vae</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="34"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Variational auto encoder (VAE)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=34" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_vae.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_8">
                <div class="image-area">
                  <img src="./assets/images/8.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.MNIST.semi_supervised_learning_VAT">image_recognition.MNIST.semi_supervised_learning_VAT</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="8"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Semi-supervised learning using variational auto encoder</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=8" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/MNIST/semi_supervised_learning_VAT.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
            </div>
          </div>
          
          <div class="all BNN">
            <div class="breadcrumb-list">
              <span class="back">Search by technique</span>
              <span> > </span>
              <span>BNN</span>
            </div>
            <div class="project-list">
                  
              <div class="unit project_10">
                <div class="image-area">
                  <img src="./assets/images/10.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_connect_mnist_MLP">tutorial.binary_networks.binary_connect_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="10"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=10" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_connect_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_11">
                <div class="image-area">
                  <img src="./assets/images/11.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_connect_mnist_LeNet">tutorial.binary_networks.binary_connect_mnist_LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="11"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">CNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=11" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_connect_mnist_LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_12">
                <div class="image-area">
                  <img src="./assets/images/12.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_net_mnist_MLP">tutorial.binary_networks.binary_net_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="12"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory and computation by weight and data path binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=12" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_net_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_13">
                <div class="image-area">
                  <img src="./assets/images/13.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_net_mnist_LeNet">tutorial.binary_networks.binary_net_mnist_LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="13"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">CNN that consumes much less memory and computation by weight and data path binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=13" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_net_mnist_LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_14">
                <div class="image-area">
                  <img src="./assets/images/14.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_weight_mnist_MLP">tutorial.binary_networks.binary_weight_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="14"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=14" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_weight_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
            </div>
          </div>
          
          <div class="all RNN">
            <div class="breadcrumb-list">
              <span class="back">Search by technique</span>
              <span> > </span>
              <span>RNN</span>
            </div>
            <div class="project-list">
                  
              <div class="unit project_15">
                <div class="image-area">
                  <img src="./assets/images/15.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.elman_net">tutorial.recurrent_neural_networks.elman_net</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="15"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">The simplest recurrent neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=15" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/elman_net.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_16">
                <div class="image-area">
                  <img src="./assets/images/16.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.bidirectional_elman_net">tutorial.recurrent_neural_networks.bidirectional_elman_net</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="16"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Bi-directional recurrent neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=16" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/bidirectional_elman_net.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_17">
                <div class="image-area">
                  <img src="./assets/images/17.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.elman_net_with_attention">tutorial.recurrent_neural_networks.elman_net_with_attention</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="17"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Recurrent neural networks with attention</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=17" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/elman_net_with_attention.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_18">
                <div class="image-area">
                  <img src="./assets/images/18.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.gated_recurrent_unit(GRU)">tutorial.recurrent_neural_networks.gated_recurrent_unit(GRU)</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="18"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Gated recurrent unit (GRU)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=18" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/gated_recurrent_unit(GRU).sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_19">
                <div class="image-area">
                  <img src="./assets/images/19.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.long_short_term_memory(LSTM)">tutorial.recurrent_neural_networks.long_short_term_memory(LSTM)</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="19"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Long short term memory (LSTM)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=19" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/long_short_term_memory(LSTM).sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_20">
                <div class="image-area">
                  <img src="./assets/images/20.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.LSTM_auto_encoder">tutorial.recurrent_neural_networks.LSTM_auto_encoder</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="20"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Auto encoder using LSTM</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=20" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/LSTM_auto_encoder.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
              <div class="unit project_21">
                <div class="image-area">
                  <img src="./assets/images/21.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.stacked_GRU">tutorial.recurrent_neural_networks.stacked_GRU</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="21"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Recurrent neural networks with 2 GRUs</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=21" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/stacked_GRU.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                  
            </div>
          </div>
          
          
          
        </div>

        <div id="dataset_content" class="tab_content">
          <div class="default project-list">
          
            <div class="unit view-all view-all-action" data-id="smallMNIST">
              <div class="image-area">
                <img src="./assets/images/smallMNIST.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">small MNIST</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
          
            <div class="unit view-all view-all-action" data-id="MNIST">
              <div class="image-area">
                <img src="./assets/images/MNIST.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">MNIST</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
          
            <div class="unit view-all view-all-action" data-id="ImageNet">
              <div class="image-area">
                <img src="./assets/images/ImageNet.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">ImageNet</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
          
            <div class="unit view-all view-all-action" data-id="CIFAR-10100">
              <div class="image-area">
                <img src="./assets/images/cifar.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <img src="./assets/images/Project.svg">
                  <h3 class="title">CIFAR-10/100</h3>
                </div>
                <div class="count-area"></div>
                <div class="description"></div>
                <div class="action"></div>
              </div>
            </div>
          
            <div class="unit project_27">
              <div class="image-area">
                <img src="./assets/images/27.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.image_classification.hand-sign">tutorial.image_classification.hand-sign</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="27"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Example of 4-class hand-sign image classification for SPRESENSE</div>
                <div class="action">
                  <a href="/console/#/project?project_id=27" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/image_classification/hand-sign.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_57">
              <div class="image-area">
                <img src="./assets/images/57.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.image_classification.digits">tutorial.image_classification.digits</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="57"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Example of 11-class digits image classification for SPRESENSE</div>
                <div class="action">
                  <a href="/console/#/project?project_id=57" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/image_classification/digits.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_54">
              <div class="image-area">
                <img src="./assets/images/54.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.semantic_segmentation.binary_semantic_segmentation">tutorial.semantic_segmentation.binary_semantic_segmentation</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="54"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Binary segmentation to separate letters and background</div>
                <div class="action">
                  <a href="/console/#/project?project_id=54" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/semantic_segmentation/binary_semantic_segmentation.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_31">
              <div class="image-area">
                <img src="./assets/images/31.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.semantic_segmentation.unetlike_125px">tutorial.semantic_segmentation.unetlike_125px</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="31"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">20 class semantic segmentation using U-Net</div>
                <div class="action">
                  <a href="/console/#/project?project_id=31" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/semantic_segmentation/unetlike_125px.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_32">
              <div class="image-area">
                <img src="./assets/images/32.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.semantic_segmentation.unetlike_125px_person">tutorial.semantic_segmentation.unetlike_125px_person</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="32"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">2 class semantic segmentation using U-Net</div>
                <div class="action">
                  <a href="/console/#/project?project_id=32" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/semantic_segmentation/unetlike_125px_person.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_28">
              <div class="image-area">
                <img src="./assets/images/28.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.anomaly_detection.sin_wave_anomaly_detection">tutorial.anomaly_detection.sin_wave_anomaly_detection</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="28"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Anormary detection from sin wave using auto encoder</div>
                <div class="action">
                  <a href="/console/#/project?project_id=28" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/anomaly_detection/sin_wave_anomaly_detection.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_55">
              <div class="image-area">
                <img src="./assets/images/55.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="tutorial.object_detection.synthetic_image_object_detection">tutorial.object_detection.synthetic_image_object_detection</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="55"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Object detection using synthetic image data including ellipse, triangle, rectangle and pentagon</div>
                <div class="action">
                  <a href="/console/#/project?project_id=55" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/tutorial/object_detection/synthetic_image_object_detection.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_33">
              <div class="image-area">
                <img src="./assets/images/33.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="classification.iris.iris">classification.iris.iris</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="33"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Vector classification on iris flower dataset</div>
                <div class="action">
                  <a href="/console/#/project?project_id=33" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/classification/iris/iris.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
            <div class="unit project_59">
              <div class="image-area">
                <img src="./assets/images/59.png">
              </div>
              <div class="text-area">
                <div class="title-area">
                  <h3 class="title" title="wav_keyboard_sound">wav_keyboard_sound</h3>
                </div>
                <div class="count-area">
                  <div class="copy-count-area" title="Copy count">
                    <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                    <div class="copy-count"></div>
                  </div>
                  <div class="star-count-area" title="Favorite count">
                    <div class="star read-only" data-project-id="59"></div>
                    <div class="star-count"></div>
                  </div>
                </div>
                <div class="description">Distinguish between four keyboard tap sounds (membrane, pantograph, mechanical blue switch and mechanical red switch)</div>
                <div class="action">
                  <a href="/console/#/project?project_id=59" target="_top">Open Project</a>
                  <a href="/assets/sdcproj/voice_recognition/wav_keyboard_sound.sdcproj">Save as</a>
                </div>
              </div>
            </div>
              
          </div>
        
          <div class="all smallMNIST">
            <div class="breadcrumb-list">
              <span class="back">Search by dataset</span>
              <span> > </span>
              <span>small MNIST</span>
            </div>
            <div class="project-list">
                
              <div class="unit project_1">
                <div class="image-area">
                  <img src="./assets/images/1.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.01_logistic_regression">tutorial.basics.01_logistic_regression</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="1"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image binary classification using the simplest one-layer neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=1" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/01_logistic_regression.sdcproj">Save as</a>
                    <a href="/docs/training_using_a_sample_project.html" target="_blank">Read commentary</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_2">
                <div class="image-area">
                  <img src="./assets/images/2.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.02_binary_cnn">tutorial.basics.02_binary_cnn</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="2"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image binary classification using 4-layer convolutional neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=2" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/02_binary_cnn.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_3">
                <div class="image-area">
                  <img src="./assets/images/3.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.06_auto_encoder">tutorial.basics.06_auto_encoder</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="3"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Auto encoder</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=3" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/06_auto_encoder.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_4">
                <div class="image-area">
                  <img src="./assets/images/4.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.10_deep_mlp">tutorial.basics.10_deep_mlp</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="4"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=4" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/10_deep_mlp.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_5">
                <div class="image-area">
                  <img src="./assets/images/5.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.11_deconvolution">tutorial.basics.11_deconvolution</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="5"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Convolutional auto encoder</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=5" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/11_deconvolution.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_15">
                <div class="image-area">
                  <img src="./assets/images/15.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.elman_net">tutorial.recurrent_neural_networks.elman_net</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="15"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">The simplest recurrent neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=15" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/elman_net.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_16">
                <div class="image-area">
                  <img src="./assets/images/16.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.bidirectional_elman_net">tutorial.recurrent_neural_networks.bidirectional_elman_net</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="16"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Bi-directional recurrent neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=16" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/bidirectional_elman_net.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_17">
                <div class="image-area">
                  <img src="./assets/images/17.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.elman_net_with_attention">tutorial.recurrent_neural_networks.elman_net_with_attention</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="17"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Recurrent neural networks with attention</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=17" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/elman_net_with_attention.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_18">
                <div class="image-area">
                  <img src="./assets/images/18.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.gated_recurrent_unit(GRU)">tutorial.recurrent_neural_networks.gated_recurrent_unit(GRU)</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="18"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Gated recurrent unit (GRU)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=18" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/gated_recurrent_unit(GRU).sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_19">
                <div class="image-area">
                  <img src="./assets/images/19.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.long_short_term_memory(LSTM)">tutorial.recurrent_neural_networks.long_short_term_memory(LSTM)</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="19"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Long short term memory (LSTM)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=19" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/long_short_term_memory(LSTM).sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_20">
                <div class="image-area">
                  <img src="./assets/images/20.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.LSTM_auto_encoder">tutorial.recurrent_neural_networks.LSTM_auto_encoder</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="20"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Auto encoder using LSTM</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=20" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/LSTM_auto_encoder.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_21">
                <div class="image-area">
                  <img src="./assets/images/21.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.recurrent_neural_networks.stacked_GRU">tutorial.recurrent_neural_networks.stacked_GRU</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="21"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Recurrent neural networks with 2 GRUs</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=21" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/recurrent_neural_networks/stacked_GRU.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_52">
                <div class="image-area">
                  <img src="./assets/images/52.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.01_visualize_weight_of_feature">tutorial.explainable_dl.01_visualize_weight_of_feature</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="52"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of importance of input data by learning weight of input data</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=52" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/01_visualize_weight_of_feature.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_53">
                <div class="image-area">
                  <img src="./assets/images/53.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.02_l1_regularization">tutorial.explainable_dl.02_l1_regularization</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="53"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of importance of input data using L1 regularization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=53" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/02_l1_regularization.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_29">
                <div class="image-area">
                  <img src="./assets/images/29.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.03_attention">tutorial.explainable_dl.03_attention</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="29"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of attention area</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=29" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/03_attention.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_30">
                <div class="image-area">
                  <img src="./assets/images/30.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.04_inference_result_at_each_layer">tutorial.explainable_dl.04_inference_result_at_each_layer</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="30"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method to check output of each data path</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=30" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/04_inference_result_at_each_layer.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_60">
                <div class="image-area">
                  <img src="./assets/images/60.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.explainable_dl.05_MCdropout">tutorial.explainable_dl.05_MCdropout</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="60"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Visualization method of reliability of prediction results by neural networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=60" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/explainable_dl/05_MCdropout.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
            </div>
          </div>
        
          <div class="all MNIST">
            <div class="breadcrumb-list">
              <span class="back">Search by dataset</span>
              <span> > </span>
              <span>MNIST</span>
            </div>
            <div class="project-list">
              
              <div class="unit project_6">
                <div class="image-area">
                  <img src="./assets/images/6.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.basics.12_residual_learning">tutorial.basics.12_residual_learning</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="6"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=6" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/basics/12_residual_learning.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_10">
                <div class="image-area">
                  <img src="./assets/images/10.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_connect_mnist_MLP">tutorial.binary_networks.binary_connect_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="10"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=10" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_connect_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_11">
                <div class="image-area">
                  <img src="./assets/images/11.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_connect_mnist_LeNet">tutorial.binary_networks.binary_connect_mnist_LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="11"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">CNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=11" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_connect_mnist_LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_12">
                <div class="image-area">
                  <img src="./assets/images/12.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_net_mnist_MLP">tutorial.binary_networks.binary_net_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="12"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory and computation by weight and data path binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=12" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_net_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_13">
                <div class="image-area">
                  <img src="./assets/images/13.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_net_mnist_LeNet">tutorial.binary_networks.binary_net_mnist_LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="13"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">CNN that consumes much less memory and computation by weight and data path binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=13" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_net_mnist_LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_14">
                <div class="image-area">
                  <img src="./assets/images/14.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="tutorial.binary_networks.binary_weight_mnist_MLP">tutorial.binary_networks.binary_weight_mnist_MLP</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="14"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">DNN that consumes much less memory by weight binalization</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=14" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/tutorial/binary_networks/binary_weight_mnist_MLP.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_7">
                <div class="image-area">
                  <img src="./assets/images/7.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.MNIST.LeNet">image_recognition.MNIST.LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="7"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using 4-layer convolutional neural networks on MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=7" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/MNIST/LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_8">
                <div class="image-area">
                  <img src="./assets/images/8.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.MNIST.semi_supervised_learning_VAT">image_recognition.MNIST.semi_supervised_learning_VAT</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="8"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Semi-supervised learning using variational auto encoder</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=8" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/MNIST/semi_supervised_learning_VAT.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_35">
                <div class="image-area">
                  <img src="./assets/images/35.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.FashionMNIST.LeNet">image_recognition.FashionMNIST.LeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="35"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using 4-layer convolutional neural networks on Fashion-MNIST dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=35" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/FashionMNIST/LeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_56">
                <div class="image-area">
                  <img src="./assets/images/56.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_dcgan">image_generation.mnist_dcgan</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="56"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep Convolutional Generative Adversarial Networks(DCGAN)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=56" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_dcgan.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_9">
                <div class="image-area">
                  <img src="./assets/images/9.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_dcgan_with_label">image_generation.mnist_dcgan_with_label</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="9"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Deep Convolutional Generative Adversarial Networks(DCGAN)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=9" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_dcgan_with_label.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_34">
                <div class="image-area">
                  <img src="./assets/images/34.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_generation.mnist_vae">image_generation.mnist_vae</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="34"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Variational auto encoder (VAE)</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=34" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_generation/mnist_vae.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
            </div>
          </div>
        
          <div class="all ImageNet">
            <div class="breadcrumb-list">
              <span class="back">Search by dataset</span>
              <span> > </span>
              <span>ImageNet</span>
            </div>
            <div class="project-list">
                
              <div class="unit project_40">
                <div class="image-area">
                  <img src="./assets/images/40.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.densenet.densenet-161">image_recognition.ILSVRC2012.densenet.densenet-161</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="40"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight neural networks that express shallow and deep networks simultaneously</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=40" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/densenet/densenet-161.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_25">
                <div class="image-area">
                  <img src="./assets/images/25.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-101">image_recognition.ILSVRC2012.residual networks.resnet-101</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="25"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=25" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-101.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_26">
                <div class="image-area">
                  <img src="./assets/images/26.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-152">image_recognition.ILSVRC2012.residual networks.resnet-152</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="26"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=26" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-152.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_22">
                <div class="image-area">
                  <img src="./assets/images/22.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-18">image_recognition.ILSVRC2012.residual networks.resnet-18</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="22"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=22" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-18.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_23">
                <div class="image-area">
                  <img src="./assets/images/23.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-34">image_recognition.ILSVRC2012.residual networks.resnet-34</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="23"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=23" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-34.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_24">
                <div class="image-area">
                  <img src="./assets/images/24.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.residual networks.resnet-50">image_recognition.ILSVRC2012.residual networks.resnet-50</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="24"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2015</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=24" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/residual networks/resnet-50.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_41">
                <div class="image-area">
                  <img src="./assets/images/41.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.resnext.resnext-101">image_recognition.ILSVRC2012.resnext.resnext-101</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="41"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Residual networks with grouped convolution</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=41" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/resnext/resnext-101.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_43">
                <div class="image-area">
                  <img src="./assets/images/43.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet-0.5x">image_recognition.ILSVRC2012.shufflenet.shufflenet-0.5x</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="43"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=43" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet-0.5x.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_44">
                <div class="image-area">
                  <img src="./assets/images/44.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet-2.0x">image_recognition.ILSVRC2012.shufflenet.shufflenet-2.0x</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="44"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=44" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet-2.0x.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_42">
                <div class="image-area">
                  <img src="./assets/images/42.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.shufflenet.shufflenet">image_recognition.ILSVRC2012.shufflenet.shufflenet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="42"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with shuffle structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=42" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/shufflenet/shufflenet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_45">
                <div class="image-area">
                  <img src="./assets/images/45.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.squeezenet.squeezenet11">image_recognition.ILSVRC2012.squeezenet.squeezenet11</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="45"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Light weight convolutional neural networks with bottle-neck structure</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=45" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/squeezenet/squeezenet11.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_46">
                <div class="image-area">
                  <img src="./assets/images/46.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-11">image_recognition.ILSVRC2012.vgg.vgg-11</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="46"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=46" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-11.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_47">
                <div class="image-area">
                  <img src="./assets/images/47.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-13">image_recognition.ILSVRC2012.vgg.vgg-13</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="47"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=47" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-13.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_48">
                <div class="image-area">
                  <img src="./assets/images/48.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.vgg.vgg-16">image_recognition.ILSVRC2012.vgg.vgg-16</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="48"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2013</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=48" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/vgg/vgg-16.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
            
              <div class="unit project_49">
                <div class="image-area">
                  <img src="./assets/images/49.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.alexnet">image_recognition.ILSVRC2012.alexnet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="49"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2012</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=49" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/alexnet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_50">
                <div class="image-area">
                  <img src="./assets/images/50.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.GoogLeNet">image_recognition.ILSVRC2012.GoogLeNet</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="50"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Neural networks for image classification which is the winner of the ImageNet challenge 2014</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=50" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/GoogLeNet.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_51">
                <div class="image-area">
                  <img src="./assets/images/51.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.nin">image_recognition.ILSVRC2012.nin</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="51"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Network in networks</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=51" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/nin.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              <div class="unit project_61">
                <div class="image-area">
                  <img src="./assets/images/61.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.ILSVRC2012.senet-154">image_recognition.ILSVRC2012.senet-154</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="61"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">ResNeXt with &#34;Squeese and Excitation&#34; block</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=61" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/ILSVRC2012/senet-154.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
            </div>
          </div>
        
          <div class="all CIFAR-10100">
            <div class="breadcrumb-list">
              <span class="back">Search by dataset</span>
              <span> > </span>
              <span>CIFAR-10/100</span>
            </div>
            <div class="project-list">
              
              <div class="unit project_37">
                <div class="image-area">
                  <img src="./assets/images/37.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-deepmil">image_recognition.CIFAR10.resnet.resnet-110-deepmil</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="37"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Weakly supervised image localizaion</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=37" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-deepmil.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
            
              <div class="unit project_58">
                <div class="image-area">
                  <img src="./assets/images/58.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-cutout">image_recognition.CIFAR10.resnet.resnet-110-cutout</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="58"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image augmentation by masking part of an image</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=58" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-cutout.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
            
              <div class="unit project_38">
                <div class="image-area">
                  <img src="./assets/images/38.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110-mixup">image_recognition.CIFAR10.resnet.resnet-110-mixup</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="38"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image augmentation by blending 2 images</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=38" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110-mixup.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
            
              <div class="unit project_36">
                <div class="image-area">
                  <img src="./assets/images/36.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR10.resnet.resnet-110">image_recognition.CIFAR10.resnet.resnet-110</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="36"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on CIFAR-10 dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=36" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR10/resnet/resnet-110.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
            
              <div class="unit project_39">
                <div class="image-area">
                  <img src="./assets/images/39.png">
                </div>
                <div class="text-area">
                  <div class="title-area">
                    <h3 class="title" title="image_recognition.CIFAR100.resnet.resnet-110">image_recognition.CIFAR100.resnet.resnet-110</h3>
                  </div>
                  <div class="count-area">
                    <div class="copy-count-area" title="Copy count">
                      <div class="copy-img-area"><img src="./assets/images/Copy.svg"></div>
                      <div class="copy-count"></div>
                    </div>
                    <div class="star-count-area" title="Favorite count">
                      <div class="star read-only" data-project-id="39"></div>
                      <div class="star-count"></div>
                    </div>
                  </div>
                  <div class="description">Image classification using residual networks on CIFAR-100 dataset</div>
                  <div class="action">
                    <a href="/console/#/project?project_id=39" target="_top">Open Project</a>
                    <a href="/assets/sdcproj/image_recognition/CIFAR100/resnet/resnet-110.sdcproj">Save as</a>
                  </div>
                </div>
              </div>
                
              </div>
            </div>
        </div>

        <div id="star_content" class="tab_content">
          <div class="default project-list"></div>

        </div>

      </div>
    </div>
  </div>

</div>

</template>

<style scoped>
</style>