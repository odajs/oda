import ODA from '../../oda.js';
import '../containers/containers.js'
const Localization = ODA.regTool('localization');

Localization.currentLocal = /* odaUserLocal || */ window.navigator.userLanguage || window.navigator.language || window.navigator.systemLanguage
Localization.path = import.meta.url.split('/').slice(0, -1).join('/') + '/../../locales/'; // locales path
Localization.phraze = {}
Localization.words = {}
Localization.dictionary = { phraze:{'_':'_'}, words:{'_':'_'} }

ODA.loadJSON(Localization.path + '_.dir').then(res => { 
    Localization.localesAvailable = res    
    Localization.lidx = res.findIndex(l => (l.name == Localization.currentLocal))
    if ((res.find(l => (l.name == Localization.currentLocal)))!=undefined)
        ODA.loadJSON(Localization.path + Localization.currentLocal + '.json').then(res => { Localization.dictionary = res})
            .catch(error => { console.log("Errol load dictionary: " + error) })
    }).catch(error => { console.log("Errol load locales available: " + error) })

Localization._setDictionary = function(number) {
    //let nn = Localization.localesAvailable[number].name
    ODA.loadJSON(Localization.path + Localization.localesAvailable[number].name + '.json').then(res => { Localization.dictionary = res})
        .catch(error => { console.log("Errol load dictionary: " + error) })
    //console.log('dd',nn)
}

window.addEventListener('keydown', async e => {
    if (e.code === 'KeyL' && e.altKey) {
        var table = await ODA.createComponent("oda-localization-table");
        ODA.showDialog(table, {}, {
            icon: 'icons:flag', title: 'Dictionarys',
            buttons: [{ label: 'Dowload', icon: 'icons:file-download' }]
        })
            .then(ok => {
                ok.setNewDict()
                if (ok.focusedButton.label == 'Dowload') { ok.dlDict() }
            })
            .catch(err => { });

    }
})

ODA({
    is: 'oda-localization-table', imports: '@oda/table, @oda/button, @oda/basic-input, @oda/toggle, @tools/dropdown, @oda/listbox',
    showHeader: true, rowLines: true, colLines: true, evenOdd: true, allowFocus: true, allowSort: true,
    template: /*html*/ `
        <style>
            #battons-row {display: flex;}
            .selelem {display: flex; border:1px solid #f0f0f0; margin: 3px; }
            .label {line-height:34px;}
        </style>
        <div id='battons-row'>
            <div class='selelem'>
                <div class='label' @tap="tDict=!tDict"  :selected='!tDict'>{{_nameDict(0)}}</div>
                <oda-toggle ::toggled='tDict' ></oda-toggle>
                <div class='label'  @tap="tDict=!tDict"  :selected='tDict'>{{_nameDict(1)}}</div></div>
            <div class='selelem'>
                <div class='label'  @tap="eyeAll=!eyeAll"  :selected='!eyeAll'>Only visible</div>
                <oda-toggle ::toggled='eyeAll' ></oda-toggle>
                <div class='label' @tap="eyeAll=!eyeAll" :selected='eyeAll'>All</div></div>
            <div class='selelem'>
                <oda-selectbox :items="localesAvailable" ::sidx="lidx" ><oda-selectbox>
            </div>
            
        </div>
        <oda-localization-grid ::content="phrazeBase" ~if="tDict" :header-names="['phraze','translate']" ></oda-localization-grid>
        <oda-localization-grid ::content="phrazeDop" ~if="tDict && eyeAll"></oda-localization-grid>
        <oda-localization-grid ::content="wordsBase" ~if="!tDict" :header-names="['words','translate']" ></oda-localization-grid>
        <oda-localization-grid ::content="wordsDop" ~if="!tDict && eyeAll"></oda-localization-grid>

    `,
    observers: ['_dataset( currentLocal, lidx)'],
    props: {
        eyeAll: false, tDict: true,
        currentLocal: 'forInit', // { get() {return ODA.localization.currentLocal} },
        phrazeBase: [], phrazeDop: [], wordsBase: [], wordsDop: [],
        localesAvailable: [], lidx:{
            set (lidx) {
                Localization.lidx=lidx
                Localization._setDictionary(lidx)
            },
            get () {return  Localization.lidx}
        },

    },
    currentDict() {
        let toObj = (arr, rez = {}) => { for (let n of arr) { rez[n.key] = n.val }; return rez }
        let extractObj = namE => toObj(this[namE].filter(el => el.val != ''))
        return {
            words: sumObAB(extractObj('wordsBase'), extractObj('wordsDop')),
            phraze: sumObAB(extractObj('phrazeBase'), extractObj('phrazeDop'))
        }
    },
    setNewDict() { Localization.dictionary = this.currentDict() },
    dlDict() {
        const downLoad = document.createElement('a');
        downLoad.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(this.currentDict(), null, '\t'));
        downLoad.setAttribute('download', 'ODA_dictionary.' + this.currentLocal + '.json');
        downLoad.click();
    },
    _nameDict(b) { return b ? 'phraze' : 'words' },
    _dataset(local,lidx) {
        const sPW = Localization.phraze, dP = Localization.dictionary.phraze,
            sW = Localization.words, dW = Localization.dictionary.words, sP = subObAB(sPW, sW);

        let toData = (ob, rez = []) => { for (let k in ob) { rez.push({ 'key': k, 'val': ob[k] }) }; return rez }

        this.wordsDop = toData(subObAB(dW, sW))
        this.wordsBase = toData(sumObAB(supObAB(dW, sW), sW))

        this.phrazeDop = toData(subObAB(dP, sP))
        this.phrazeBase = toData(sumObAB(supObAB(dP, sP), sP))

        //console.log(Localization.localesAvailable)
        this.localesAvailable=Localization.localesAvailable
        //if (Localization.lidx!=-1) this.lidx = Localization.lidx

    },
    _lselect () {//<oda-selectbox :items="localesAvailable" ><oda-selectbox></oda-selectbox>
        const dropdown = document.createElement('oda-list-box');
        //document.body.appendChild(dropdown);
        //console.log(dropdown)
        ODA.showDropdown(dropdown, {items:this.localesAvailable}, {}).then(resolve => {
           // document.body.removeChild(dropdown);
        });
    },

})

ODA({
    is: 'oda-localization-cel', template: /*html*/ `<oda-basic-input ::value :read-only ></oda-basic-input>`,
    props: {
        value() { return this.item?.[this.column?.name] },
        readOnly() { return (this.column?.name == 'key') }
    }
})

ODA({
    is: 'oda-localization-grid', imports: '@oda/basic-input', template: /*html*/ `
        <style>
            #gridall {display: grid; grid-template-columns: 1fr 1fr; grid-gap: 1px; background:#999; padding:2px;}
            .key {grid-column:1;background:#fff;}
            .val {grid-column:2;background:#fff;}
            oda-basic-input {padding:0;}
            oda-basic-input.odd  {background:#f0f0f0;}
            .head {grid-row:1; background:#ddd; text-align:center; font-weight:bold; line-height:26px;}
        </style>
        <div id='gridall'>
        <div class='key head'>{{headerNames[0]}}</div><div class='val head'>{{headerNames[1]}}</div>
        <oda-basic-input :class="'key '+ ((index%2)? 'even':'odd')" :style="'grid-row:'+(index+2)" ~for="content" ::value="content[index].key" :read-only="true"> </oda-basic-input>
        <oda-basic-input :class="'val '+ ((index%2)? 'even':'odd')" :style="'grid-row:'+(index+2)" ~for="content" ::value="content[index].val"> </oda-basic-input>
        </div>
    `,
    props: {
        content: [],
        headerNames: [],
    },
})

ODA({   is: 'oda-selectbox', imports: '@oda/button',  template: /*html*/ `
        <style>
            :host {position: relative; }
            .line {display:flex; width:100%; justify-content: space-between; cursor: pointer; height:40px; }
            .label {display: inline-grid;}
            .hide-- {display: none;}
            .option {position:absolute; background:rgb(240, 240, 240); z-index: 99; border:1px solid rgb(153, 153, 153); }
            .option oda-button { justify-content: flex-start ; margin:1px -1px; padding:2px;}
            
        </style>
        <div class="line" @tap="showOptions=!showOptions">
            <oda-icon :icon="items[sidx]?.icon" ></oda-icon>
            <div class="label">{{items[sidx]?.label}}</div>
            <oda-icon icon="icons:arrow-drop-down" ></oda-icon>
        </div>
        <div ~if="showOptions" class="option">
            <oda-button ~for="items"    @tap="focusedItem=index" :icon="item?.icon" :label="item.label"></oda-button>
        </div>
        `,
        props: {
            items: [{ icon: "image:style", label: "style" }, { icon: "communication:vpn-key", label: "vpn-key" }],
            sidx:0,
            showOptions:false,
            focusedItem: {set (e) {
                this.sidx=e
                this.showOptions=false
            }}
            
        },
    })


function sumObAB(a, b) { return { ...b, ...a } }
function subObAB(a, b) {
    let rez = { ...a }
    for (let key in b) { if (key in a) delete rez[key] }
    return rez
}
function supObAB(a, b) {
    let rez = {}
    for (let key in a) { if (key in b) rez[key] = a[key] }
    return rez
}