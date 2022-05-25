import ODA from '../../../../oda.js';
import '/ext/vis-4.21.0/dist/vis.js';
(() => {
    let _network;
ODA({
    is: 'mind-map-vis',
    template: /*html*/`
        <style>
            :host {
                @apply --flex;
                @apply --vertical;
                height: 100%;
                position: relative;
                background: white;
            }
            :host > div {
                @apply --flex;
                @apply --vertical;
                height: 100%;
                position: relative;
                background: white;
            }
        </style>
        <div ref="mindmapvis"></div>
        <div>{{JSON.stringify(dataS)}}</div>

    `,
    props: {
        dataSet: Array,

        dataS: Array,
        items: Array,
        options: {
            type: Object,
            default: {
                locale: navigator.language,
                nodes: {
                    shape: 'box',
                    shadow: true,
                    color: {
                        border: 'black',
                        background: 'white'
                    },
                    size: 10,
                    margin: 10
                },
                layout: {
                    randomSeed: 8
                },
                /*clustering: {
                    enabled: false,
                    clusterEdgeThreshold: 50
                },*/
                physics: {
                    stabilization: { enabled: true, iterations: 1000 },
                    barnesHut: {
                        gravitationalConstant: -60000,
                        springConstant: 0.02
                    },
                    solver: 'barnesHut',
                    // adaptiveTimestep: false,
                    // timestep: 1
                },
                // smoothCurves: {dynamic:false},
                // zoomExtentOnStabilize: true,
                interaction: {
                    hideEdgesOnDrag: true,
                    keyboard: true
                    //dragNodes: false
                }
            },
            set(options) {
                if (_network) _network.setOptions(options);
            }
        },
        focusedItem: Object,
        physics: {
            type: Boolean,
            default: true,
            set(physics) {
                if (_network) _network.setOptions({ physics: { enabled: physics } });
            }
        },
        _networkEvents: ['click', 'doubleClick', 'oncontext', 'dragStart', 'dragging', 'dragEnd', 'zoom', 'showPopup', 'hidePopup', 'select', 'selectNode', 'selectEdge', 'deselectNode', 'deselectEdge', 'hoverNode', 'hoverEdge', 'blurNode', 'blurEdge', 'startStabilizing', 'stabilizationProgress', 'stabilizationIterationsDone', 'stabilized', /*'resize',*/ 'initRedraw', 'beforeDrawing', 'afterDrawing', 'animationFinished', 'configChange'],
        _network: {
            type: Object,
            set(network, old) {
                if (old) {
                    this._networkEvents.forEach(e => network.off(e));
                }
                if (network) {
                    this._networkEvents.forEach(e => {
                        _network.on(e, detail => {
                            if (detail && detail.nodes && detail.nodes.length) {
                                detail.nodes.forEach(id => {
                                    detail.id = id;
                                    this.fire(e, detail);
                                });
                            } else {
                                this.fire(e, detail);
                            }
                        });
                    });
                }
            }
        },
        _nodes: Object,
        _edges: Object,
        _itemId: 0,
        _refresh: 0,
        idKey: 'id',
        parentKey: 'parent'
    },

    listeners: {
        'dragStart': '_onDragStart',
        'dragging': '_onDragging',
        'dragEnd': '_onDragEnd',
        'selectNode': '_onSelectNode',
        'deselectNode': '_onDeselectNode',
        'doubleClick': '_onDblClick',
        'contextmenu': '_onContextMenu',
        'oncontext': '_onContextMenu',
        'resize': '_onResize',
        'stabilizationIterationsDone': '_onStabilized'
    },

    _onSelectNode(event, d) {
        if (_network && event.detail.value.nodes && event.detail.value.nodes.length > 0) {
            if (_network.isCluster(event.detail.value.nodes[0]) === true) {
                this.physics = true;
                _network.openCluster(event.detail.value.nodes[0]);
                // _network.stabilize();
            } else {
                this.focusedItem = this.items.find(i => i.id === event.detail.value.id);
                /*if( this.focusedItem && this.focusedItem.links && this.focusedItem.links.length > 0 ) {
                    if( _network )
                        _network.setOptions( { nodes: { physics: false } } );
                    this.focusedItem.links.forEach( link => {
                        let toItem = this.items.find( toItem => toItem.item.Root[ this.idKey ] === link );
                        this._edges.add( { from: this.focusedItem.id, to: toItem.id, arrows: 'to', dashes: true } );
                    } );
                }*/
                if (this.focusedItem.item instanceof odaObject &&
                    this.focusedItem.item.Root.$gant &&
                    this.focusedItem.item.Root.$gant[0].$dependens &&
                    this.focusedItem.item.Root.$gant[0].$dependens.length > 0) {
                    _network.setOptions({ nodes: { physics: false } });
                    this.focusedItem.item.Root.$gant[0].$dependens.forEach(depend => {
                        let toItem = this.items.find(toItem => toItem.item.Root[this.idKey] === depend.link);
                        if (!Object.values(this._edges._data).some(edge => edge.from === this.focusedItem.id && edge.to === toItem.id))
                            this._edges.add({
                                from: this.focusedItem.id,
                                to: toItem.id,
                                arrows: 'to',
                                dashes: true
                            });
                    });
                }
                this.camOnNode(this.focusedItem.id);
            }
        }
    },

    _onDeselectNode(event, d) {
        Object.values(this._edges._data).filter(edge => !Number.isInteger(edge.id)).forEach(edge => {
            this._edges.remove(edge);
        });
        if (event.detail.value.nodes && !event.detail.value.nodes.length && this.focusedItem.id !== this.rootItem.id) {
            this.focusedItem = this.items.find(i => i.id === this._getParentNode(this.focusedItem).id);
            this.camOnNode(this.focusedItem.id);
            _network.selectNodes([this.focusedItem.id]);
        } else if (event.detail.value.nodes && !event.detail.value.nodes.length && this.focusedItem.id === this.rootItem.id) {
            this.focusedItem = null;
            this.camOutOfNode();
        }
    },

    _onDragStart(event, d) {
        if (_network && event.detail.value.nodes && event.detail.value.nodes.length > 0) {
            if (_network.isCluster(event.detail.value.nodes[0]) === true) {
                this.physics = true;
                _network.openCluster(event.detail.value.nodes[0]);
                // _network.stabilize();
            } else {
                _network.setOptions({ nodes: { physics: false } });
                this.focusedItem = this.items.find(i => i.id === event.detail.value.id);
            }
        }
    },

    _onDragging(event, d) {
        if (event.detail.value.nodes && event.detail.value.nodes.length) {
            const weight = 20;
            const positions = _network.getPositions();
            for (let i in positions) {
                if (
                    positions.hasOwnProperty(i) &&
                    Math.abs(event.detail.value.pointer.canvas.x - positions[i].x) < weight &&
                    Math.abs(event.detail.value.pointer.canvas.y - positions[i].y) < weight &&
                    parseInt(i) !== event.detail.value.id
                ) {
                    _network.selectNodes([event.detail.value.id, parseInt(i)]);
                } else {
                    _network.selectNodes([event.detail.value.id]);
                }
            }
        }
    },

    _onDragEnd(event, d) {
        if (_network && event.detail.value.nodes && event.detail.value.nodes.length) _network.setOptions({ nodes: { physics: true } });
    },

    _onDblClick(event, d) {
        if (event.detail.value.nodes && event.detail.value.nodes.length && this.focusedItem.item instanceof odaObject) {
            this.focusedItem.item.show();
        } else if (event.detail.value.nodes && event.detail.value.nodes.length && this.focusedItem.item instanceof odaStorage) {
            this.focusedItem.item.navigate();
        }
    },

    async _onContextMenu(event, d) {
        if (event.detail.value.pointer) {
            const weight = 20;
            const positions = _network.getPositions();
            for (let i in positions) {
                if (
                    positions.hasOwnProperty(i) &&
                    Math.abs(event.detail.value.pointer.canvas.x - positions[i].x) < weight &&
                    Math.abs(event.detail.value.pointer.canvas.y - positions[i].y) < weight
                ) {
                    const control = await ODA.createComponent('/web/core/item/lib/menu/menu.html');
                    //control.groups = params.groups;
                    const item = this._nodes._data[i].item;
                    control.contextItem = item;
                    control.open();
                    this.listen('event', '_onEvent', {target: item});
                    this.focusedItem = this.items.find(item => item.id === parseInt(i));
                    this.focusNode(parseInt(i));
                }
            }
        }
    },

    _onResize(e, d) {
        if (_network) _network.setOptions({ height: '100%' });
        //_network.stabilize();
    },

    _onEvent(event, d) {
        switch (event.source) { //create before-save saved after-save update changed change
            case 'changed':
                let changedItem = this.items.find(mapItem => mapItem.item === event.detail.value);
                if (changedItem) {
                    if (event.detail.value instanceof odaObject) {
                        changedItem.label = event.detail.value.name || event.detail.value.oid;
                    } else {
                        changedItem.label = event.detail.value.label;
                    }
                    this.refresh();
                }
                break;
            case 'create':
                let curItem = event.currentTarget;
                let addItem = event.detail.value;
                let mapItem = this.items.find(mapItem => mapItem.item === curItem) || this.rootItem;
                let item = addItem instanceof odaObject ?
                    {
                        item: addItem,
                        label: addItem.name || addItem.oid,
                        p: addItem.p,
                        oid: addItem.oid,
                        shape: 'dot',
                        group: curItem.id
                    } :
                    { item: addItem, label: addItem.label, items: [], group: addItem.id };
                item.id = this._getNewItemId();
                mapItem.items = mapItem.items || [];
                mapItem.items.push(item);
                this.refresh();
                break;
            case 'deleted':
                if (event.currentTarget) {
                    let mapItem = this.items.find(mapItem => mapItem.item === event.currentTarget);
                    if (!mapItem || mapItem === this.rootItem)
                        return;
                    let removingChildren = items => {
                        items.forEach((i, idx) => {
                            if (i.items && i.items.length) {
                                removingChildren(i.items);
                            }
                            items.splice(idx, 1);
                        });
                    };
                    if (mapItem && mapItem.items && mapItem.items.length) {
                        removingChildren(mapItem.items);
                    }
                    let removingItems = items => {
                        items.forEach((i, idx) => {
                            if (i.id === mapItem.id) {
                                items.splice(idx, 1);
                            } else {
                                if (i.items && i.items.length === 0 && i.expanded) {
                                    i.expanded = false;
                                }
                                if (i.items && i.items.length) {
                                    removingItems(i.items);
                                }
                            }
                        });
                    };
                    removingItems(this.items);
                }
                this.refresh();
                break;
        }
    },

    _onStabilized() {
        this.physics = false;
    },

    _getNewItemId() {
        return this._itemId++;
    },

    get rootItem() {
        return this.items[0];
    },

    observers: [
        '_setItems(dataSet, _refresh, dataS)',
        '_updateNetwork(items, _network)',
    ],

    attached() {
        this._nodes = this._nodes || new vis.DataSet([]);
        this._edges = this._edges || new vis.DataSet([]);
        let data = {
            nodes: this._nodes,
            edges: this._edges
        };
        let opts = {
            //width: (this.offsetWidth) + 'px',
            //height: this.offsetHeight + 'px'
            height: '878px'

        };
        Object.assign(opts, this.options);

        _network = new vis.Network(this.$refs.mindmapvis, data, opts);
        this._network = {};
    },

    _setItems(dataSet) {
        let array = [];
        Object.assign(array, dataSet);
        let expanding = (data, level) => {

            let children = data.filter(i => i[this.parentKey] && i[this.idKey] !== i[this.parentKey]);
            children.forEach(i => {
                let item = data.find(p => p[this.idKey] === i[this.parentKey]);
                delete i[this.parentKey];
                if (item) {
                    item.items = item.items || [];
                    if (!item.items.includes(i))
                        item.items.push(i);
                } else {
                    data.push(i);
                    // children.splice(children.indexOf(i),1);
                }
                data.splice(data.indexOf(i), 1);
            });

            let expands = data.filter(i => {
                i.id = (typeof i.id !== 'undefined') ? i.id : this._getNewItemId();
                if (!i.expanded) {
                    this.fire('expand', i);
                    i.expanded = true;
                }
                return i.expanded && i.items && i.items.length;
            });
            level++;
            expands.forEach(e => {
                let idx = array.indexOf(e);
                array.splice(idx + 1, 0, ...e.items);
                expanding(e.items, level);
            });
        };
        if (array.length > 0)
            expanding(array, 0);
        this.items = array;
    },

    _updateNetwork(items) {
        Object.values(this._nodes._data).forEach(node => {
            if (!items.some(i => i.id === node.id))
                this._nodes.remove(node);
        });

        let lines = [];
        items.forEach(i => {
            if (i.items && i.items.length > 0) {
                i.items.forEach(s => {
                    lines.push({ id: s.id, from: i.id, to: s.id });
                })
            }
        });

        Object.values(this._edges._data).forEach(edge => {
            if (!items.some(i => i.id === edge.id))
                this._edges.remove(edge);
        });

        items.forEach(i => {
            if (!this._nodes._data[i.id]) {
                this._nodes.add(i);
            }
            this._nodes.update(i);
        });

        lines.forEach(i => {
            if (!this._edges._data[i.id])
                this._edges.add({ id: i.id, from: i.from, to: i.to });
        });

        if (_network && !this.focusedItem) {
            _network.setData({ nodes: this._nodes, edges: this._edges });
            let clusterOptionsByData = {
                processProperties: (clusterOptions, childNodes) => {
                    clusterOptions.label = "[ Cluster " + childNodes.length + " ]";
                    return clusterOptions;
                },
                clusterNodeProperties: { borderWidth: 2, shape: 'box', font: { size: 30 } }
            };
            _network.clusterByHubsize(undefined, clusterOptionsByData);
            _network.stabilize();
        }
    },

    _getParentNode(node) {
        const nodeId = typeof node === 'object' ? node.id : node || node;
        let parentEdge = Object.values(this._edges._data).find(edge => edge.to === nodeId);
        return Object.values(this._nodes._data).find(node => node.id === parentEdge.from);
    },

    focusNode(node = 0) {
        const nodeId = typeof node === 'object' ? node.id : node || node;
        _network.selectNodes([nodeId]);
    },

    camOnNode(node = 0) {
        let nodeId = typeof node === 'object' ? node.id : node || node;
        const calcScale = (this._nodes._data[nodeId].items && this._nodes._data[nodeId].items.length > 1) ? 2 - (1 - 1 / this._nodes._data[nodeId].items.length) * 1.5 : 2;
        let options = {
            animation: {
                duration: 500,
            },
            scale: calcScale,
        };
        _network.focus(nodeId, options);
    },

    camOutOfNode(node = 0) {
        let nodeId = typeof node === 'object' ? node.id : node || node;
        let options = {
            animation: {
                duration: 500,
            },
            scale: 0.5,
        };
        _network.focus(nodeId, options);
    },

    refresh() {
        this.debounce('refresh', () => {
            this._refresh++;
        }, 10);
    }


});
})();