// import '../lib/vis-network/dist/vis-network.js';
ODA({ is: 'oda-network', imports: '../lib/vis-network/dist/vis-network.js', template: /*html*/`
    <style>
        :host {
            @apply --flex;
            height: 100%;
            position: relative;
            background: white;
        }
        :host > div {
            @apply --flex;
            height: 100%;
            position: relative;
            background: white;
        }
    </style>
    <div id="network-div"></div>
    `,
    _getNewItemId() {
        return this.itemId++;
    },
    $public: {
        get networkDiv() {
            return this.$('#network-div')
        },
        get rootItem() {
            return this.items?.[0];
        },
        dataSet: {
            $type: Array
        },
        items: {
            $type: Array,
            get() {
                const array = Object.assign([], this.dataSet);
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
                return array;
            },
            set(items) {
                [...this.nodes._data.values()].forEach(node => {
                    if (!items.some(i => i.id === node.id))
                        this.nodes.remove(node);
                });
                let lines = [];
                items.forEach(i => {
                    if (i.items && i.items.length > 0) {
                        i.items.forEach(s => {
                            lines.push({ id: s.id, from: i.id, to: s.id });
                        })
                    }
                });
                Object.values(this.edges._data).forEach(edge => {
                    if (!items.some(i => i.id === edge.id))
                        this.edges.remove(edge);
                });
                items.forEach(i => {
                    if (!this.nodes._data.has(i.id)) {
                        this.nodes.add(i);
                    }
                    this.nodes.update(i);
                });
                lines.forEach(i => {
                    if (!this.edges._data.has(i.id))
                        this.edges.add({ id: i.id, from: i.from, to: i.to });
                });
                if (this.network && !this.focusedItem) {
                    this.network.setData({ nodes: this.nodes, edges: this.edges });
                    let clusterOptionsByData = {
                        processProperties: (clusterOptions, childNodes) => {
                            clusterOptions.label = "[ Cluster " + childNodes.length + " ]";
                            return clusterOptions;
                        },
                        clusterNodeProperties: { borderWidth: 2, shape: 'box', font: { size: 30 } }
                    };
                    this.network.clusterByHubsize(undefined, clusterOptionsByData);
                    this.network.stabilize();
                }
            }
        },
        // options: {
        //     $type: Object,
        //     set(options) {
        //         if (this.network) this.network.setOptions(options);
        //     }
        // },
        focusedItem: {
            $type: Object
        },
        physics: {
            $type: Boolean,
            $def: true,
            set(physics) {
                if (this.network) this.network.setOptions({ physics: { enabled: physics } });
            }
        },
        networkEvents: {
            $type: Array,
            $def: ['click', 'doubleClick', 'oncontext', 'dragStart', 'dragging', 'dragEnd', 'zoom', 'showPopup', 'hidePopup', 'select', 'selectNode', 'selectEdge', 'deselectNode', 'deselectEdge', 'hoverNode', 'hoverEdge', 'blurNode', 'blurEdge', 'startStabilizing', 'stabilizationProgress', 'stabilizationIterationsDone', 'stabilized', /*'resize',*/ 'initRedraw', 'beforeDrawing', 'afterDrawing', 'animationFinished', 'configChange']
        },
        network: {
            $type: Object,
            set(network, old) {
                if (old) {
                    this.networkEvents.forEach(e => this.network.off(e));
                }
                if (network) {
                    this.networkEvents.forEach(e => {
                        this.network.on(e, detail => {
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
        nodes: {
            $type: Object
        },
        edges: {
            $type: Object
        },
        itemId: 0,
        refreshCount: 0,
        idKey: 'id',
        parentKey: 'parent'
    },
    $listeners: {
        'dragStart': 'onDragStart',
        'dragging': 'onDragging',
        'dragEnd': 'onDragEnd',
        'selectNode': 'onSelectNode',
        'deselectNode': 'onDeselectNode',
        'doubleClick': 'onDoubleClick',
        'contextmenu': 'onContextmenu',
        'oncontext': 'onContextmenu',
        'resize': 'onResize',
        'stabilizationIterationsDone': 'onStabilizationIterationsDone'
    },
    onDragStart(event, d) {
        if (this.network && event.detail.value.nodes && event.detail.value.nodes.length > 0) {
            if (this.network.isCluster(event.detail.value.nodes[0]) === true) {
                this.physics = true;
                this.network.openCluster(event.detail.value.nodes[0]);
                // this.network.stabilize();
            } else {
                this.network.setOptions({ nodes: { physics: false } });
                this.focusedItem = this.items.find(i => i.id === event.detail.value.id);
            }
        }
    },
    onDragging(event, d) {
        if (event.detail.value.nodes && event.detail.value.nodes.length) {
            const weight = 20;
            const positions = this.network.getPositions();
            for (let i in positions) {
                if (
                    positions.hasOwnProperty(i) &&
                    Math.abs(event.detail.value.pointer.canvas.x - positions[i].x) < weight &&
                    Math.abs(event.detail.value.pointer.canvas.y - positions[i].y) < weight &&
                    parseInt(i) !== event.detail.value.id
                ) {
                    this.network.selectNodes([event.detail.value.id, parseInt(i)]);
                } else {
                    this.network.selectNodes([event.detail.value.id]);
                }
            }
        }
    },
    onDragEnd(event, d) {
        if (this.network && event.detail.value.nodes && event.detail.value.nodes.length) this.network.setOptions({ nodes: { physics: true } });
    },
    onSelectNode(event, d) {
        if (this.network && event.detail.value.nodes && event.detail.value.nodes.length > 0) {
            if (this.network.isCluster(event.detail.value.nodes[0]) === true) {
                this.physics = true;
                this.network.openCluster(event.detail.value.nodes[0]);
                // this.network.stabilize();
            } else {
                this.focusedItem = this.items.find(i => i.id === event.detail.value.id);
                /*if( this.focusedItem && this.focusedItem.links && this.focusedItem.links.length > 0 ) {
                    if( this.network )
                        this.network.setOptions( { nodes: { physics: false } } );
                    this.focusedItem.links.forEach( link => {
                        let toItem = this.items.find( toItem => toItem.item.Root[ this.idKey ] === link );
                        this.edges.add( { from: this.focusedItem.id, to: toItem.id, arrows: 'to', dashes: true } );
                    } );
                }*/
                // if (this.focusedItem.item instanceof odaObject &&
                //     this.focusedItem.item.Root.$gant &&
                //     this.focusedItem.item.Root.$gant[0].$dependens &&
                //     this.focusedItem.item.Root.$gant[0].$dependens.length > 0) {
                //     this.network.setOptions({ nodes: { physics: false } });
                //     this.focusedItem.item.Root.$gant[0].$dependens.forEach(depend => {
                //         let toItem = this.items.find(toItem => toItem.item.Root[this.idKey] === depend.link);
                //         if (!Object.values(this.edges._data).some(edge => edge.from === this.focusedItem.id && edge.to === toItem.id))
                //             this.edges.add({
                //                 from: this.focusedItem.id,
                //                 to: toItem.id,
                //                 arrows: 'to',
                //                 dashes: true
                //             });
                //     });
                // }
                this.camOnNode(this.focusedItem.id);
            }
        }
    },
    onDeselectNode(event, d) {
        Object.values(this.edges._data).filter(edge => !Number.isInteger(edge.id)).forEach(edge => {
            this.edges.remove(edge);
        });
        if (this.focusedItem && event.detail.value.nodes && !event.detail.value.nodes.length && this.focusedItem.id !== this.rootItem.id) {
            this.focusedItem = this.items.find(i => i.id === this._getParentNode(this.focusedItem).id);
            this.camOnNode(this.focusedItem.id);
            this.network.selectNodes([this.focusedItem.id]);
        } else if (this.focusedItem && event.detail.value.nodes && !event.detail.value.nodes.length && this.focusedItem.id === this.rootItem.id) {
            this.focusedItem = null;
            this.camOnNode(0, 0.5);
        }
    },
    onDoubleClick(event, d) {
        if (event.detail.value.nodes && event.detail.value.nodes.length && this.focusedItem.item instanceof odaObject) {
            this.focusedItem.item.show();
        } else if (event.detail.value.nodes && event.detail.value.nodes.length && this.focusedItem.item instanceof odaStorage) {
            this.focusedItem.item.navigate();
        }
    },
    async onContextmenu(event, d) {
        if (event.detail.value?.pointer) {
            const weight = 20;
            const positions = this.network.getPositions();
            for (let i in positions) {
                if (
                    positions.hasOwnProperty(i) &&
                    Math.abs(event.detail.value.pointer.canvas.x - positions[i].x) < weight &&
                    Math.abs(event.detail.value.pointer.canvas.y - positions[i].y) < weight
                ) {
                    const nodeId = parseInt(i);
                    const item = this.nodes._data.get(nodeId).item;
                    item.showMenu({ contextItem: item });
                    if(item) {
                        this.listen('event', '_onEvent', { target: item });
                        this.focusedItem = this.items.find(item => item.id === nodeId);
                    }
                    this.focusNode(nodeId);
                }
            }
        }
    },
    onResize(e, d) {
        if (this.network) this.network.setOptions({ height: '100%' });
        //this.network.stabilize();
    },
    onStabilizationIterationsDone() {
        this.physics = false;
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
    attached() {
        this.nodes ??= new vis.DataSet([]);
        this.edges ??= new vis.DataSet([]);
        let data = {
            nodes: this.nodes,
            edges: this.edges
        };
        let opts = {
            //width: (this.offsetWidth) + 'px',
            //height: this.offsetHeight + 'px'
            // height: '878px'
        };
        const options = {
            locale: navigator.language.substr(0, 2),
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
        };
        Object.assign(opts, options);

        this.network = new vis.Network(this.networkDiv, data, opts);
    },
    _getParentNode(node) {
        const nodeId = typeof node === 'object' ? node.id : node || node;
        let parentEdge = [...this.edges._data.values()].find(edge => edge.to === nodeId);
        return [...this.nodes._data.values()].find(node => node.id === parentEdge.from);
    },
    focusNode(node = 0) {
        const nodeId = typeof node === 'object' ? node.id : node || node;
        this.network.selectNodes([nodeId]);
    },
    camOnNode(node = 0, scale) {
        const nodeId = typeof node === 'object' ? node.id : node || node;
        const calcScale = scale ? scale : (this.nodes._data.get(nodeId).items && this.nodes._data.get(nodeId).items.length > 1) ? 2 - (1 - 1 / this.nodes._data.get(nodeId).items.length) * 1.5 : 2;
        const options = {
            animation: {
                duration: 500,
            },
            scale: calcScale,
        };
        this.network.focus(nodeId, options);
    },
    refresh() {
        this.debounce('refresh', () => {
            this.refreshCount++;
        }, 10);
    }
});