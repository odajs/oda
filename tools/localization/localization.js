import ODA from '../../oda.js';
import '../containers/containers.js'
const Localization = ODA.regTool('localization');

function getFirstBrowserLanguage() {
    let nav = window.navigator, i, language,
        browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];

    if (Array.isArray(nav.languages)) {  // support for HTML 5.1 "navigator.languages"
        for (i = 0; i < nav.languages.length; i++) {
            language = nav.languages[i];
            if (language && language.length) { return language; }
        }
    }

    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {  // support for other well known properties in browsers
        language = nav[browserLanguagePropertyKeys[i]];
        if (language && language.length) { return language; }
    }
    return null;
};

// console.log(getFirstBrowserLanguage());

Localization.currentLocal = getFirstBrowserLanguage()
console.log(Localization.currentLocal)

// Localization.currentLocal = /* odaUserLocal || */ window.navigator.userLanguage || window.navigator.language || window.navigator.systemLanguage
Localization.path = import.meta.url.split('/').slice(0, -1).join('/') + '/../../locales/'; // locales path
Localization.phraze = {}
Localization.words = {}
Localization.dictionary = { phraze: { '_': '_' }, words: { '_': '_' } }
ODA.translate = (val) => {
    if (typeof val !== 'string') return val;
    const testLeter = new RegExp('[a-z].*?', 'gi')
    //const sMF = (v,sp) => { retutn v.split(sp).map(a => a.trim()).filter(a =>  testLeter.test(a) ) }
    const phraze = val.split(/\r?\n/).map(a => a.trim()).filter(a => testLeter.test(a))
    const words = val.split(/\s+/).map(a => a.trim()).filter(a => testLeter.test(a))
    //
    phraze.forEach(v => ODA.localization.phraze[v] = '')
    words.forEach(v => ODA.localization.words[v] = '')

    const rePhraze = new RegExp('\\b' + Object.keys(ODA.localization.dictionary.phraze).join('\\b|\\b') + '\\b', "gi");
    const reWords = new RegExp('\\b' + Object.keys(ODA.localization.dictionary.words).join('\\b|\\b') + '\\b', "gi");
    //console.log(reWords)
    var newVal = val.replaceAll(rePhraze, md => ODA.localization.dictionary.phraze[md])
        .replaceAll(reWords, md => ODA.localization.dictionary.words[md]);
    //console.log(val, newVal)
    return newVal
}

ODA.loadJSON(Localization.path + '_.dir').then(res => {
    Localization.localesAvailable = res
    Localization.lidx = res.findIndex(l => (l.name == Localization.currentLocal))
    if ((res.find(l => (l.name == Localization.currentLocal))) != undefined)
        ODA.loadJSON(Localization.path + Localization.currentLocal + '.json').then(res => { Localization.dictionary = res; console.log(res) })
            .catch(error => { console.log("Errol load dictionary: " + error) })
}).catch(error => { console.log("Errol load locales available: " + error) })

Localization._setDictionary = function (number) {
    //let nn = Localization.localesAvailable[number].name
    ODA.loadJSON(Localization.path + Localization.localesAvailable[number].name + '.json').then(res => { Localization.dictionary = res })
        .catch(error => { console.log("Errol load dictionary: " + error) })
    //console.log('dd',nn)
}

window.addEventListener('keydown', async e => {
    if (e.code === 'KeyL' && e.altKey) {
        var table = await ODA.createComponent("oda-localization-table");
        ODA.showDialog(table, {}, {
            icon: 'icons:flag', title: 'Dictionaries', autosize:false,
            buttons: [{ label: 'Download', icon: 'icons:file-download' }]
        })
            .then(ok => {
                ok.setNewDict()
                if (ok.focusedButton.label == 'Download') { ok.dlDict() }
            })
            .catch(err => { });
    }
})

ODA({is:'oda-localisation-tree', imports:'@oda/table', extends:'oda-table',
    props:{
        showHeader:true, colLines: true, rowLines: true, allowSort: true, lazy: true, avtoSize:true,  //sort: [[letter]],
        // dataSet:[],
        dataSet() {
            // return [{words: 'phraze', transletes: '', letter: 'p', items: Array(0)}]
            const words = sumObAB(Localization.words, Localization.dictionary.words)
            const phraze  = subObAB(sumObAB(Localization.phraze, Localization.dictionary.phraze),words)
            console.log(phraze)
            let ds = {}
            Object.keys(words).forEach(k => ds[k] = {words:k, transletes:(new TRANSLATE(k,'words')), letter: k[0].toLocaleLowerCase(), items:[]}  )
            Object.keys(phraze).map(k => {
                const testLeter = new RegExp('[a-z].*?', 'gi')
                // let trob = new TRANSLATE(k,'phraze')
                k.split(/\s+/).map(a => a.trim()).filter(a => testLeter.test(a)).forEach(w => {
                    if (ds[w] == undefined) ds[w] = { words: w, transletes: new TRANSLATE(w,'words'), letter: w[0].toLocaleLowerCase(), 
                                                        items:[{ words: k, transletes:  new TRANSLATE(k,'phraze') }] } 
                    else { ds[w].items.push({words: k, transletes: new TRANSLATE(k,'phraze') }) }
                })
            })
            return Object.values(ds)
            //Promise.all(Object.values(ds)).then(value =>  {return value} ); // Object.keys(words).map((k,i) => { return { words: k, transletes: i, letter: k[0].toLocaleLowerCase() } }) 
        }   
    },
    columns: [{name:'words',treeMode:true,template:'oda-localization-words', $sort: 1},
                {name:'transletes',template:'oda-localization-transletes'},{name:'letter', hidden:true }],
    // async ready() {
    //    // this.groups = [this.columns.find(c => c.name === 'letter')];

    //     // const words = sumObAB(Localization.words, Localization.dictionary.words)
    //     // const phraze  = subObAB(sumObAB(Localization.phraze, Localization.dictionary.phraze),words)
    //     // // console.log(phraze)
    //     // let ds = {}
    //     // Object.keys(words).forEach(k => ds[k] = {words:k, transletes:(new TRANSLATE(k,'words')), letter: k[0].toLocaleLowerCase(), items:[]}  )
    //     // Object.keys(phraze).map(k => {
    //     //     const testLeter = new RegExp('[a-z].*?', 'gi')
    //     //     // let trob = new TRANSLATE(k,'phraze')
    //     //     k.split(/\s+/).map(a => a.trim()).filter(a => testLeter.test(a)).forEach(w => {
    //     //         if (ds[w] == undefined) ds[w] = { words: w, transletes: new TRANSLATE(w,'words'), letter: w[0].toLocaleLowerCase(), 
    //     //                                             items:[{ words: k, transletes:  new TRANSLATE(k,'phraze') }] } 
    //     //         else { ds[w].items.push({words: k, transletes: new TRANSLATE(k,'phraze') }) }
    //     //     })
    //     // })
    //     // console.log('ss:')
    //     // console.log(Object.values(ds))
    //     // this.dataSet =  Object.values(ds)

    // },
   
})

ODA({
    is: 'oda-localization-words', template: /*html*/ `<oda-basic-input :value="value()" :read-only="1" ></oda-basic-input>`,
    value() { return this.item?.[this.column?.name] },
})

ODA({
    is: 'oda-localization-transletes', template: /*html*/ `<oda-basic-input ::value='item.transletes.t'></oda-basic-input>`,
})

ODA({
    is: 'oda-localization-table', imports: '@oda/table, @oda/button, @oda/basic-input, @oda/toggle, @tools/dropdown, @oda/listbox, @oda/tree',
    showHeader: true, rowLines: true, colLines: true, evenOdd: true, allowFocus: true, allowSort: true,
    template: /*html*/ `
        <style>
            :host {@apply --vertical; /*height: 300px; */}
            #battons-row {display: flex;}
            .selelem {display: flex;/*border:1px solid #f0f0f0;*/ margin: 3px; align-items: center;}
            .label {line-height:34px;}
        </style>
        <div ~if="!newVID" id='battons-row'>
            <div ~if="!newVID" class='selelem'>
                <div class='label' @tap="tDict=!tDict"  :selected='!tDict'>{{_nameDict(0)}}</div>
                <oda-toggle ::toggled='tDict' ></oda-toggle>
                <div class='label'  @tap="tDict=!tDict"  :selected='tDict'>{{_nameDict(1)}}</div></div>
            <div ~if="!newVID" class='selelem'>
                <div class='label'  @tap="eyeAll=!eyeAll"  :selected='!eyeAll'>Only visible</div>
                <oda-toggle ::toggled='eyeAll' ></oda-toggle>
                <div class='label' @tap="eyeAll=!eyeAll" :selected='eyeAll'>All</div></div>
            <div class='selelem'>
                <oda-selectbox :items="localesAvailable" ::sidx="lidx" ><oda-selectbox>
            </div>
        </div>
        <div ~if="!newVID" style="overflow: auto;">
            <oda-localization-grid ::content="phrazeBase" ~if="tDict" :header-names="['phraze','translate']" ></oda-localization-grid>
            <oda-localization-grid ::content="phrazeDop" ~if="tDict && eyeAll"></oda-localization-grid>
            <oda-localization-grid ::content="wordsBase" ~if="!tDict" :header-names="['words','translate']" ></oda-localization-grid>
            <oda-localization-grid ::content="wordsDop" ~if="!tDict && eyeAll"></oda-localization-grid>
        </div>
        <oda-localisation-tree ></oda-localisation-tree>
    `,
    observers: ['_dataset( currentLocal, lidx)'],
    props: {
        newVID:1,
        dataSet: [],
        eyeAll: true, tDict: false,
        currentLocal: 'forInit', // {get() {return ODA.localization.currentLocal}},
        phrazeBase: [], phrazeDop: [], wordsBase: [], wordsDop: [],
        localesAvailable: [], lidx: {
            set(lidx) {
                Localization.lidx = lidx
                Localization._setDictionary(lidx)
            },
            get() { return Localization.lidx }
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
    _dataset(local, lidx) {
        const sPW = Localization.phraze, dP = Localization.dictionary.phraze,
            sW = Localization.words, dW = Localization.dictionary.words, sP = subObAB(sPW, sW);

        let toData = (ob, rez = []) => { for (let k in ob) { rez.push({ 'key': k, 'val': ob[k] }) }; return rez }

        this.wordsDop = toData(subObAB(dW, sW))
        this.wordsBase = toData(sumObAB(supObAB(dW, sW), sW))

        this.phrazeDop = toData(subObAB(dP, sP))
        this.phrazeBase = toData(sumObAB(supObAB(dP, sP), sP))

        let allWords = sumObAB(sW, dW), allPhraze = sumObAB(sPW, dP)
        let allPhrazeArr = Object.keys(allPhraze).map((key) => { return { col1: key, col2: allPhraze[key] } });
        Object.keys(allWords).map(k => allWords[k] = { col1: k, col2: allWords[k], items: [] })
        allPhrazeArr.forEach(o => {
            o.col1.split(/\s+/).forEach(w => {
                if (allWords[w] != undefined) { allWords[w].items = (allWords[w].items) ? [o] : [o].concat(allWords[w].items) }
                else { allWords[w] = { col1: w, items: [o] } }
            })
        })

        this.dataSet = Object.values(allWords)
        this.localesAvailable = Localization.localesAvailable
    },
    _lselect() {//<oda-selectbox :items="localesAvailable" ><oda-selectbox></oda-selectbox>
        const dropdown = document.createElement('oda-list-box');
        ODA.showDropdown(dropdown, { items: this.localesAvailable }, {}).then(resolve => {
        });
    },

})

// ODA({
//     is: 'oda-localization-row', template: /*html*/ `
//         <style>
//             .inline {display:flex; background: linear-gradient(0deg, #ddd, #fff);}
            

//         </style>
//         <div class="inline">
//             <oda-basic-input ::value="item.col1" :read-only="true" ></oda-basic-input>
//             <oda-basic-input ::value="item.col2" ></oda-basic-input>
//         </div>`,
//     props: {
//         //value() { return this.item?.[this.column?.name] },
//     }
// })



ODA({
    is: 'oda-localization-grid', imports: '@oda/basic-input', template: /*html*/ `
        <style>
            #gridall {display: grid; grid-template-columns: 1fr 1fr; grid-gap: 1px; background:#999; padding:2px;}
            .key {grid-column:1;background:#fff;}
            .val {grid-column:2;background:#fff;}
            oda-basic-input {padding:0;}
            oda-basic-input.odd  {background:#f0f0f0;}
            .head {grid-row:1; background:#ddd; text-align:center; font-weight:bold; line-height:26px; position: sticky; top: 0px;}
        </style>
        <div id='gridall'>
            <div class='key head'>{{headerNames[0]}}</div>
            <div class='val head'>{{headerNames[1]}}</div>
            <oda-basic-input :class="'key '+ ((index%2)? 'even':'odd')" :style="'grid-row:'+(index+2)" ~for="content" ::value="content[index].key" :read-only="true"> </oda-basic-input>
            <oda-basic-input :class="'val '+ ((index%2)? 'even':'odd')" :style="'grid-row:'+(index+2)" ~for="content" ::value="content[index].val"> </oda-basic-input>
        </div>
    `,
    props: {
        content: [],
        headerNames: [],
    },
})

ODA({
    is: 'oda-selectbox', imports: '@oda/button', template: /*html*/ `
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

CLASS({is: 'TRANSLATE',
    ctor(key,type) {
        this.key = key
        this.type = type
    },
    get t () {
        let rez = ODA.localization.dictionary[this.type][this.key]
        if (typeof rez === 'string') return rez
        else return ''
    },
    set t (val) {ODA.localization.dictionary[this.type][this.key]=val}
})
