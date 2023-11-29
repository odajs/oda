ODA({is: 'oda-brain-builder', imports: '@oda/app-layout, @tools/containers, @oda/monaco-editor', extends: 'oda-app-layout',
    template: `
        <oda-brain-builder-structure slot="left-panel" opened icon="icons:list"></oda-brain-builder-structure>
        <oda-monaco-editor :value="textNet" language="json" read-only  slot="main"></oda-monaco-editor>
        <div slot="footer" class="horizontal">
            <label style="margin: 4px;">steps: {{step}}</label>
            <label style="margin: 4px;">spikeCount: {{spikeCount}}</label>
        </div>
    `,

    iconSize:{
        $def: 32,
        $pdp: true
    },
    $pdp:{
        microBrain: null,
        step: 0,
        spikeCount: 0,
        spike(id){
            this.spikeCount++;
        },
        data: {
            name: 'New micro brain',
            items:[{name: 'input', template: 'oda-brain-builder-io-cell'},
                {name: 'layers',  items: [], template: 'oda-brain-builder-layers'},
                {name: 'output', template: 'oda-brain-builder-io-cell'}]
        },
        get textNet(){
            return this.microBrain?.json || '';
            if (this.data.ready)
                return JSON.stringify(this.layers, null, 4);
            return ''
        },
        get layers(){
            return this.data.items[1];
        },
    },
    get title () {
        return this.name;
    },
    name:{
        $pdp: true,
        get(){
            return this.data.name;
        },
        set(n){
            this.data.name = n;
        }
    }

})
ODA({is: 'oda-brain-builder-structure', imports: '@oda/tree, @oda/button', extends: 'oda-tree',
    template:`
        <style>
            oda-button{
                @apply --border;
                @apply --content;
            }
        </style>
        <div class="horizontal header" style="margin: 4px;">
            <oda-button :icon-size :icon="commandIcon" class="flex" :label="command" @tap="doCommand"></oda-button>
            <oda-button :icon-size :disabled="!isReady" @tap="save"  icon="icons:save"></oda-button>
        </div>
    `,

    update(data){
        this.data.items[1] = data;
    },
    get isReady(){
        return this.data.ready;
    },
    autoRowHeight: true,
    cellTemplate: 'oda-brain-builder-layer-cell',
    hideRoot: true,
    get commandIcon(){
        return COMMAND_ICON_MAP[this.command] || '';
    },
    command:{
        $def: 'LOAD',
        get(){
            if (this.data.ready){
                return this.play?'STOP':'START';
            }
            if (this.layers.items.length === 0)
                return 'LOAD';
            return 'GENERATE';
        },
        $list: ['LOAD', 'GENERATE', 'STOP', 'START']
    },
    doCommand(){
        this[this.command]();
    },
    STOP(){
        this.play = false;
    },
    play:{
        set(n){
            if (n){
                worker.builder = this;
                worker.postMessage({type: 'load', net: this.textNet});
                this.async(()=>{
                    this.step = 0;
                    this.spikeCount = 0;
                    worker.postMessage({type: 'start'});
                })
            }
            else{
                worker.postMessage({type: 'stop'});
            }
        }
    },
    START(){
        this.play = true;
    },
    async GENERATE(){
        try{
            let res = {layers: 0, neurons: 0, synapses: 0};
            const generate = (layers)=>{
                if (!layers) return;
                res.layers += layers.length;
                for (let layer of layers){
                    res.neurons += layer.size;
                    for (let link of layer.links){
                        const target = this.getTarget(link, layer);
                        if (!target) throw new Error(`Not found <b>${link.target}</b> target layer for ${link.link}% ${link.positive?'excitatory':'inhibitory'} links in <b>layer ${layer.name}</b> `);
                        link.id = target.name;
                        const sign = link.positive?1:-1;
                        const part = 100 / link.link;
                        let data = [];
                        for (let i = 0; i < layer.size; i++){
                            const arr = (new Array(target.size)).fill(0).map((item, index)=>{
                                if ((Math.random()  * target.size)%part > 1)
                                    return item;
                                res.synapses++;
                                return Math.random() * sign;
                            })
                            data.push(arr);
                        }
                        link.data = data;
                    }
                    generate(layer.items);
                }
            }
            generate(this.layers.items);
            if (!res.layers) throw new Error('No layers defined!')
            if (!res.neurons) throw new Error('No neurons defined!')
            if (!res.synapses) throw new Error('No synapses defined!')
            // this.data.ready = true;
            this.name = 'MB: L:'+res.layers+', N:'+res.neurons+', S:'+res.synapses;
            const imp = await ODA.import('@apps/micro-brain');
            this.microBrain = new imp.default(this.data);
        }
        catch (e){
            ODA.showWarning(e);
        }
    },
    async LOAD(){
        const opts = {
            types: [{
                description: 'MicroBrain Net file',
                accept: {'application/json': ['.json']},
                startIn: 'documents'
            }],
            excludeAcceptAllOption: true,
            multiple: false
        };
        const [fileHandle] = await window.showOpenFilePicker(opts);
        const file = await fileHandle.getFile();
        const reader = new FileReader();
        reader.onload = (e) =>{
            this.model = this.data = JSON.parse(e.target.result);
        }
        reader.readAsText(file);
    },
    $pdp:{
        get dataSet(){
            return this.data.items;
        },
        getTarget(item, layer){
            let next;
            const idx = layer.$parent.items.indexOf(layer)
            switch (item.target){
                case 'next':
                    return layer.$parent.items[idx + 1];
                case 'prev':
                    return layer.$parent.items[idx - 1];
                case 'self':
                    return layer;
                case 'child':
                    return layer.items[0];
                case 'children':
                    return layer.items;
                case 'parent':
                    return layer.$parent;
                case 'first':
                    return this.dataSet[1].items[0]
                case 'last':
                    return this.dataSet[1].items[this.dataSet[1].items.length-1]
            }
        }
    },
    model: null,
    async save(){
        let filename = "MB Net";
        const opts = {
            types: [{
                description: 'MicroBrain Net file',
                accept: {'application/json': ['.json']},
                startIn: 'documents'
            }],
            suggestedName: filename,
            excludeAcceptAllOption: true
        };
        const fileHandle = await window.showSaveFilePicker(opts);
        const writable = await fileHandle.createWritable();
        filename = fileHandle.name.split('.')[0]
        const contents = JSON.stringify(this.data);
        await writable.write(contents);
        await writable.close();
    }

})

CELLS:{
    ODA({is: 'oda-brain-builder-cell', extends: 'oda-table-cell',
        template: `
        <style>
            :host{
                margin-bottom: 1px;
            }
            .field-control{
                margin-left: 8px;
            }
        </style>
    `
    })
    ODA({is: 'oda-brain-builder-layers', extends: 'oda-brain-builder-cell',
        template: `
        <style>
            :host{
                @apply --header;
            }
            ::slotted(*){
                @apply --flex;
                @apply --content;
            }
        </style>
        <slot name="links"></slot>
        <oda-button @tap="add" :icon-size icon="icons:add" style="align-self: baseline" ~if="!microBrain"></oda-button>
    `,
        get count(){
            this.item.items?.length;
        },
        async add(e){
            await ODA.import('@tools/containers');
            let name = this.item.items.length + 1;
            if (this.item.$parent)
                name = this.item.name+'.'+name;
            const el = ODA.createElement('oda-brain-builder-create-layer-dialog');
            await ODA.showDialog(el, {}, {title: 'Add new layer: '+name});

            this.item.items.push({name, size: el.size || 1, items: [], links:[]});
            this.item.__expanded__ = true;
        }
    })
    ODA({is: 'oda-brain-builder-layer-cell', extends: 'oda-brain-builder-layers, this',
        template: `
            <style>
                :host{
                    align-items: flex-start;
                    @apply --content;
                }
                .field-control{
                    display: none;
                }
            </style>
            <div slot="links" class="flex horizontal shadow" style="overflow: hidden;">
                <div class="dark horizontal" style="padding: 4px; font-weight: bolder">
                    <label style="align-self: center;">{{item.name}}</label>
                </div>
                <div class="flex vertical" style="overflow: hidden; opacity: .7">
                    <div class="flex horizontal header" style="align-items: center; padding-left: 4px;">
                         <label :title="item.size+' neurons'" class="flex" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">{{item.size.toLocaleString()}} neurons</label>
                         <div class="horizontal" ~if="!microBrain">
                            <oda-button :icon-size class="no-flex" icon="editor:mode-edit" @tap="_settingsLayer()"></oda-button>
                            <oda-button :icon-size @tap="addLinks" icon="av:playlist-add"></oda-button>
                            <oda-button :icon-size class="no-flex" icon="icons:close" @tap="_removeLayer"></oda-button>
                         </div>

                    </div>
                    <div class="raised horizontal" ~for="items" style="align-items: center" :error="!+$for.item.positive" :success="!!+$for.item.positive">
                        <div class="vertical" :warning="_toLink($for.item) === '?'">
                            <oda-icon :icon-size :icon="_targetIcon($for.item.target)"></oda-icon>
                            <label style="text-align: center; font-weight: bold; font-size: xx-small;">{{_toLink($for.item)}}</label>
                        </div>
                        <label class="flex" style="padding: 4px;" ~html="_linkDescription($for.item)"></label>
                        <div class="horizontal" ~if="!microBrain">
                            <oda-button :icon-size class="no-flex" icon="icons:settings" @tap="_settingsLink($for.item)"></oda-button>
                            <oda-button :icon-size class="no-flex" icon="icons:close" @tap="_removeLink($for.item)"></oda-button>
                        </div>
                    </div>
                </div>
            </div>
        `,
        async _removeLayer(){
            await ODA.showConfirm("Remove layer?");
            this.item.$parent.items.remove(this.item);
        },
        _toLink(item){
            let next;
            const idx = this.item.$parent.items.indexOf(this.item)
            switch (item.target){
                case 'next': {
                    next = this.item.$parent.items[idx + 1];
                } break;
                case 'prev':{
                    next = this.item.$parent.items[idx - 1];
                } break;
                case 'self':{
                    next = this.item;
                } break;
                case 'child':{
                    next = this.item.items[0];
                } break;
                case 'children':{
                    next = this.item.items;
                } break;
                case 'parent':{
                    next = this.item.$parent;
                } break;
                case 'first':{
                    next = this.dataSet[1].items[0]
                } break;
                case 'last':{
                    next = this.dataSet[1].items[this.dataSet[1].items.length-1]
                } break;
            }
            if (next){
                if (Array.isArray(next))
                    return '['+next.length+']';
                else
                    return next.name;
            }
            return '?';
        },
        _linkDescription(item){
            let links = 0;
            const idx = this.item.$parent.items.indexOf(this.item)
            let next;
            switch (item.target){
                case 'next': {
                    next = this.item.$parent.items[idx + 1];
                } break;
                case 'prev':{
                    next = this.item.$parent.items[idx - 1];
                } break;
                case 'self':{
                    next = this.item;
                } break;
                case 'child':{
                    next = this.item.items[0];
                } break;
                case 'children':{
                    next = this.item.items;
                } break;
                case 'parent':{
                    next = this.item.$parent;
                } break;
                case 'first':{
                    next = this.dataSet[1].items[0]
                } break;
                case 'last':{
                    next = this.dataSet[1].items[this.dataSet[1].items.length-1]
                } break;
            }
            if (next){
                if (Array.isArray(next)){
                    for (let ch of next)
                        links += ch.size;
                }
                else{
                    links = next.size;
                }
            }


            return `${item.link}% ${item.positive?'exc':'inh'}<br>${Math.floor(links / 100 * item.link * this.item.size).toLocaleString()}`;
        },
        _targetIcon(target){
            return TARGET_MAP[target];
        },
        async _removeLink(item){
            await ODA.showConfirm("Remove link?");
            this.item.links.remove(item);
        },
        get items(){
            return this.item.links
        },
        async addLinks(){
            const el = ODA.createElement('oda-brain-builder-create-link-dialog');
            await ODA.showDialog(el, {}, { title: 'Add new link for layer ' + this.item.name + '.' });
            this.item.links ??= [];
            this.item.links.push({target: el.target, link: +el.link, positive: el.positive})
        },
        async _settingsLayer(){
            const el = ODA.createElement('oda-brain-builder-create-layer-dialog');
            await ODA.showDialog(el, this.item, { title: 'Add new layer: ' + name });
            this.item.size = el.size || 1;
        },
        async _settingsLink(item){
            const el = ODA.createElement('oda-brain-builder-create-link-dialog');
            await ODA.showDialog(el, item, { title: 'Add new link for layer ' + this.item.name + '.' });
            item.target = el.target;
            item.link = el.link;
            item.positive = el.positive;
        }
    })
    ODA({is: 'oda-brain-builder-io-cell', extends: 'oda-brain-builder-cell',
        template: `
        <style>
            :host{
                @apply --dark;
            }
        </style>
        <oda-button @tap="set" :icon-size icon="icons:more-horiz"></oda-button>
    `,
        set(e){

        }
    })
}
DIALOGS:{
    ODA({
        is: 'oda-brain-builder-create-layer-dialog',
        template: `
            <style>
                :host{
                    padding: 16px;
                    @apply --vertical;
                }
                label{
                    margin-right: 16px;
                    @apply --flex;
                }
                div{
                    padding: 4px;
                }
            </style>
            <div class="horizontal">
                <label>Neurons</label>
                <input autofocus type="number" ::value="size">
            </div>
        `,
        $save:{
            size: 10,
        },
        attached(){
            this.async(()=>{
                this.$('input').focus();
            },100)

        }
    })

    ODA({is: 'oda-brain-builder-create-link-dialog', imports: '@oda/toggle',
        template: `
        <style>
            :host{
                padding: 16px;
                @apply --vertical;
            }
            label{
                padding: 4px;
                @apply --flex;
            }
            div{
                padding: 4px;
            }
        </style>
        <div class="vertical">
            <label style="align-self: center;">fill: {{link}}%</label>
            <input type="range" list="tickmarks" step="10" min="0" max="100" ::value="link">
            <datalist id="tickmarks">
                <option value="0" label="0%">
                <option value="10">
                <option value="20">
                <option value="30">
                <option value="40">
                <option value="50" label="50%">
                <option value="60">
                <option value="70">
                <option value="80">
                <option value="90">
                <option value="100" label="100%">
            </datalist>
        </div>
        <div class="horizontal">
            <label for="inhibition">inhibition</label>
            <oda-toggle ::toggled="positive"></oda-toggle>
            <label for="excitatory">excitatory</label>

        </div>
        <div class="horizontal">
            <label class="no-flex" for="target">target</label>
            <oda-icon :icon="_targetIcon" ></oda-icon>
            <select ::value="target" class="flex" name="example">
                  <option ~for="axis">{{$for.item}}</option>
            </select>
        </div>

    `,
        link: 100,
        positive: true,
        target: 'next',
        axis: ['next', 'prev', 'self', 'child', 'children', 'parent', 'first', 'last'],
        get _targetIcon() {
            return TARGET_MAP[this.target];
        }
    })
}
const TARGET_MAP = {
    'next':'icons:arrow-forward:90',
    'prev':'icons:arrow-forward:270',
    'self':'icons:arrow-forward',
    'child':'icons:arrow-forward:45',
    'children':'av:fast-forward:45',
    'parent':'icons:arrow-forward:225',
    'first':'editor:publish:315',
    'last':'editor:publish:225'
}
const COMMAND_ICON_MAP = {
    'LOAD':'icons:file-upload',
    'GENERATE':'icons:apps',
    'START':'av:play-arrow',
    'STOP':'av:stop',
}

const worker = new Worker('../spike-net/spike-net-ww.js', {type: 'module'});
worker.onmessage = function (e){
    switch (e.data?.type){
        case 'spike':{
            worker.builder.spike(e.data.id);
        } break;
        case 'step':{
            worker.builder.step++;
        } break;
        case 'map':{
            worker.builder.map = e.data.map;
        } break;
        case 'save':{
            worker.builder.update(e.data.data);
        } break;
    }
}
worker.onmessageerror = function (e) {
    console.error(e);
}