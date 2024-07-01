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

import { ref, nextTick } from 'vue'
import { defineStore } from 'pinia'
import {useUtilsStore} from './utils'
import {useGraphStore} from './graph'
import {useLayerStore} from './editor/layer'
import {useEditorStore} from './editor'
import {useLinkStore} from './editor/link'
import {useNNABLACoreDefStore} from './nnabla_core_def'
import {useSelectionStore} from './selection'
import {useDefinitionsStore} from './misc/definitions'
import {useHistoryStore} from './history'

export const useNetworkStore = defineStore('network', () => {
  const utils_store = useUtilsStore()
  const history_store = useHistoryStore()
  const link_store = useLinkStore()
  const editor_store = useEditorStore()
  const layer_store = useLayerStore()
  const graph_store = useGraphStore()
  const definition_store = useDefinitionsStore()
  const selection_store = useSelectionStore()
  const nnabla_core_store = useNNABLACoreDefStore()

  const data = ref<any>({ 
    graphs: [{ name: 'Main', nodes: [], links: [] }], 
    target: 'Main' 
  })
  const Graphs = ref<any>({
    // refer neural network graphs
    data: () => data.value.graphs,
    // reset to giving graphs
    reset: (networks: any) => {_resetGraphs(networks)},
    // flush current editing graph into data
    flush: () => _serializeCurrentGraph(),
    select: (name: any) => _select(name),
    // force feed calculated properties
    feed: _feedProperties,
    // feed statistics into current graph
    stat: _feedStatistics,
    // reflect errors to each layers
    error: _feedErrors,
    // auto arrange layers
    arrange: _arrangeLayers,
    // current target
    target: () => data.value.target,
    // current target index
    targetIndex: () => data.value.graphs.findIndex((graph: any) => graph.name === data.value.target),
  })

  // get all graph names
  function names() {
    return data.value.graphs.map((g: any) => g.name)
  }

  // get graph index by name
  function indexOf(name: any) {
    return names().indexOf(name)
  }

  function unitDisabled() {
    var network = _makeNetworkConfiguration();
    const firstNodes = _getFirstNodes(network.nodes, network.links);
    return firstNodes.length !== 1;
  }

  // reload all graphs from serialized data.
  function _resetGraphs(networks: any, tab?: any){
    if (!Array.isArray(networks) || networks.length === 0) { // fall back
        networks = [{ name: 'Main', nodes: [], links: [] }];
    }

    var _findNode = function(nodes: any, name: any) {
        return nodes.find((node: any) => node.name === name)
    };

    networks = networks.map((network: any) => {
        network.nodes = network.nodes.filter((node: any) => utils_store.getComponent(node.type));
        network.links = network.links.filter((link: any) => _findNode(network.nodes, link.from_node) && _findNode(network.nodes, link.to_node));
        return network;
    });

    data.value.graphs = networks;
    graph_store.clear();
    _deserialize(tab || networks[0].name, true);
  }

  // restore named data to the editor.
  function _deserialize(name: string, calc_prop: boolean) {
    var graph = data.value.graphs[indexOf(name)];
    if (graph) {
        data.value.target = graph.name
        var layers = graph.nodes.map(layer_store.deserialize).filter((layer: any) => layer);
        editor_store.initPropMap(layers); // initialize properties mapping.
        graph.links.forEach(link_store.deserialize);

        // update property panel and statistics.
        if (calc_prop) {
          utils_store.calculate_properties();
        } else {
          utils_store.set_properties();
        }
        graph_store.getLayers().forEach((layer: any) => layer.updateOrderDisplay());
    }
  }

  // serialize current network data into data.graphs.
  function _serializeCurrentGraph(){
    var graph = data.value.graphs[indexOf(data.value.target)];
    if (graph) {
      graph.nodes = graph_store.getLayers((layer: any) => layer.serialize())
      graph.links = graph_store.getLinks((link: any) => link.serialize())
    }
    return graph;
  }

  // calculate new graph name
  function _newName(graphName?: any){
    var graph_name = (graphName || 'Network') + '_';
    return graph_name + names()
    .filter((name: any) => name.indexOf(graph_name) === 0)
    .map((name: any) => Number(name.replace(graph_name, '')))
    .filter((n: any) => !isNaN(n) && n > 1)
    .sort((a: any, b: any) => a - b)
    .reduce((prev: any, curr: any) => prev + (prev === curr), 2);
  }

  // insert new graph
  function _append(name: any, layers?: any, links?: any){
    var graphs = data.value.graphs;
    graphs.splice(graphs.length, 0, { name: name, nodes: layers || [], links: links || [] });
  }

  // delete graph; returns next tab name and deleted graph data.
  function _delete(name: any){
    var graphs = data.value.graphs;
    var index = indexOf(name);
    var graph = graphs[index];
    graphs.splice(index, 1); // delete tab
    if (graphs.length === 0) { // fall back, if there is no tabs.
        _append('Main');
    }
    return {
        index: index,
        deleted: graph,
        'next-target': name === data.value.target ? graphs[0].name : data.value.target,
    };
  }

  // change current selection
  function _select(name: string, isUpdate: boolean = false) {
    _serializeCurrentGraph();
    graph_store.clear();
    $('#network-editor').css('opacity', 0);
    setTimeout(() => {
        $('#network-editor').css('opacity', 1);
    }, definition_store.Definitions.EDIT.NETWORK_HIDDEN_TIME);
    data.value.target = name; // refresh active.
    nextTick(() => {
      editor_store.graphIndex = data.value.graphs.findIndex((graph: any) => graph.name === name);
    });
    _deserialize(name, isUpdate);
    editor_store.windowInit();
  }

  function _feedProperties(name: any, network: any, properties: any){
    if (name === data.value.target) {
        // pass computed property values to root Vue object.
        editor_store.onComputedProperties(network.nodes);

        // make node name to node properties map.
        var map: any = {};
        network.nodes.forEach((node: any) => map[node.name] = node.properties);

        // update each layer's properties.
        graph_store.getLayers((layer: any) => layer.setProperties(map[layer.name()], properties));
        // update each layer's repeat area.
        graph_store.getLayers((layer: any) => layer.deleteRepeatDisplay());
        graph_store.getLayers((layer: any) => layer.updateRepeatDisplay());
    }
  }

  function _feedStatistics(name: any, statistics: any, params: any) {
    graph_store.getLayers((layer: any) => layer.setIsParam(params.indexOf(layer.name()) !== -1));
    const valueOf = (i: any, key: any) => statistics['Statistics_' + i + '_' + key];
    editor_store.updateStatistics(Array.from({length: statistics.NumStatistics})
    .map((_, index) => new Object({
        name: valueOf(index, 'Name'),
        max: valueOf(index, 'Max'),
        sum: valueOf(index, 'Sum'),
    })));
  }

  var _reError = /^([^|]+)\|([^|]+)\|([^|]+)\|.*:\s(.*)$/;
  function _feedErrors(errors: any){
    var graphTab = data.value.target;
    var es = errors.split('\n').map((line: any) => _reError.exec(line)).filter((x: any) => x).map((es: any) => {
        return { graph: es[1], layer: es[2], property: es[3], message: es[4], };
    }).filter((e: any) => e.graph === graphTab);

    // pass computed errors to root Vue object.
    editor_store.onComputedErrors(es);

    graph_store.getLayers((layer: any) => {
        var layerName = layer.name();
        layer.setErrorProperties(es.filter((error: any) => error.layer === layerName));
    });
  }

  function _arrangeLayers(name: any, network: any){
    if (name === data.value.target) {
        var recipe: any = {};
        graph_store.getLayers((layer: any) => {
            var layerName = layer.name();
            var node = network.nodes.find((node: any) => node.name === layerName);
            if (node) {
                recipe[layerName] = { fore: { x: node.x, y: node.y, }, back: layer.getPosition(), };
            }
        });
        var _move = (direction: any) => ((layer: any) => {
            var position = (recipe[layer.name()] || {})[direction];
            if (position) {
                layer.setPosition(position);
            }
        });

        // update each layer's positions by command.
        history_store.execute({
            type: 'push-and-execute',
            argument: {
                name: () => 'Arrange Layers',
                exec: () => graph_store.getLayers(_move('fore')),
                undo: () => graph_store.getLayers(_move('back')),
            },
        });
    }
  }

  function _getFirstNodes(nodes: any, links: any) {
    const firstNodes = nodes.filter((node: any) => !links.find((link: any) => (link.to_node === node.name && link.to_name === '')));
    return firstNodes.filter((layer: any) => (nnabla_core_store.nnablaCore.layers.components.find((component: any) => component.name === layer.type) || {}).input !== 0);
  }

  function _getLastNodes(nodes: any, links: any) {
      return nodes.filter((node: any) => !links.find((link: any) => (link.from_node === node.name && link.from_name === '')));
  }

  function _makeNetworkConfiguration() {
    const linkedWithin = (layers: any) => (link: any) => {
        const source = link.source().layer();
        const destination = link.destination().layer();
        return layers.includes(source) && layers.includes(destination);
    };

    const layers = selection_store.layer.members();
    const links = graph_store.getLinks().filter(linkedWithin(layers));

    return {
        nodes: layers.map((layer: any) => layer.serialize()),
        links: links.map((link: any) => link.serialize())
    }
  }

  function createUnit() {
    editor_store.showUnitCreateDialog([{name: 'Cancel'}, {
        name: 'Create', action: (unitObj: any) => {
            var inputNetworkName = unitObj.name;
            var inputArgumentName = unitObj.argName;
            var inputSearch = unitObj.search;
            var inputValue = unitObj.value;
            var inputType = unitObj.type;

            var currentConfiguration = JSON.parse(JSON.stringify(utils_store.serialize_configuration()));

            var network: any = _makeNetworkConfiguration();

            const firstNodes = _getFirstNodes(network.nodes, network.links);
            const lastNodes = _getLastNodes(network.nodes, network.links);


            // Inputに関しては別タブで使用する用途の為、選択されているもので重複されていない名前を作成
            var newInputName = layer_store.calcDefaultUniqueName('Input', 'Input', selection_store.layer.members());
            // Unitに関しては現在のタブで使用する用途の為、現在のタブで重複されていない名前を作成
            var newUnitName = layer_store.calcDefaultUniqueName('Unit', 'Unit', graph_store.getLayers());

            const networkName = data.value.graphs.findIndex((graph: any) => graph.name === inputNetworkName) === -1 ? inputNetworkName : _newName(inputNetworkName);

            const _createArgument = () => {
                return {
                    name: inputArgumentName,
                    properties: {
                        Search: inputSearch,
                        Type: inputType,
                        Value: inputValue,
                    },
                    type: "Argument",
                    x: 0,
                    y: 0
                }
            };

            const _createInput = () => {
                return {
                    name: newInputName,
                    properties: {
                        Dataset: "x",
                        Generator: "None",
                        GeneratorMultiplier: "1.0",
                        Size: "1,28,28"
                    },
                    type: "Input",
                    x: 500,
                    y: 0
                }
            };

            const _createUnit = () => {
                return {
                    name: newUnitName,
                    properties: {
                        Network: networkName,
                        ParameterScope: "*Name",
                    },
                    type: "Unit",
                    x: firstNodes[0].x,
                    y: firstNodes[0].y
                }
            };

            var targetGraph = data.value.graphs.filter((graph: any) => graph.name === data.value.target)[0];
            targetGraph.nodes = targetGraph.nodes.filter((node: any) => network.nodes.findIndex((selectNode: any) => selectNode.name === node.name) === -1);
            targetGraph.nodes.push(_createUnit());

            const lastLinked = targetGraph.links.find((link: any) => link.from_node === lastNodes[0].name);
            const firstLinked = targetGraph.links.find((link: any) => link.to_node === firstNodes[0].name);

            if (lastLinked) {
                targetGraph.links.push({from_node: newUnitName, from_name: '', to_node: lastLinked.to_node, to_name: ''});
            }
            if (firstLinked) {
                targetGraph.links.push({from_node: firstLinked.from_node, from_name: '', to_node: newUnitName, to_name: ''});
            }

            if (inputArgumentName && inputValue) {
                network.nodes.push(_createArgument());
            }
            network.nodes.push(_createInput());
            network.links.push({from_node: newInputName, from_name: '', to_node: firstNodes[0].name, to_name: ''});
            network.name = networkName;

            utils_store.calcArrangeLayers([network], (configuration: any) => {
                var afterNetworks = JSON.parse(JSON.stringify(targetGraph));
                history_store.execute({
                    type: 'push-and-execute',
                    argument: {
                        exec: () => {
                          graph_store.clear();
                          var layers = afterNetworks.nodes.map(layer_store.deserialize).filter((layer: any) => layer);
                          editor_store.initPropMap(layers);
                          afterNetworks.links.forEach(link_store.deserialize);
                          _append(networkName, configuration.nodes, configuration.links);
                          editor_store.configuration = utils_store.serialize_configuration()
                        },
                        undo: () => {
                          _resetGraphs(JSON.parse(JSON.stringify(currentConfiguration)).networks, data.value.target);
                          editor_store.configuration = utils_store.serialize_configuration()
                        },
                        name: () => 'Create Unit',
                    },
                });
            });
        }
    }]);
  }

  return { 
    data,
    Graphs,
    _select,
    _delete,
    _append,
    _newName,
    _makeNetworkConfiguration,
    _getFirstNodes,
    createUnit,
    unitDisabled
  }
})
