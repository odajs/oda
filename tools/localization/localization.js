

/* Регистрация Инструмента */
const Localization = ODA.regTool('localization');
Localization.currentLocal = ODA.language  // под вопросом

Localization.path = import.meta.url.split('/').slice(0, -1).join('/') + '/dictionary/'; // locales path
Localization.inPage = { phrase: {}, words: {} }
Localization.dictionary = { phrase: {}, words: {} }
Localization.available = false
Localization.translateTagList = ['LABEL', 'H3']
// Localization.reload = () => {

//  }

Localization.setLocale = async (rfc_locale) => {
    Localization.available = false
    const paths = rfc_locale.split('-').map((_, i, ar) => ar.slice(0, i + 1).join('-') + '.json')
    const localesAvailable = await ODA.loadJSON(Localization.path + '_.dir')
    const availablePaths = paths.filter(p => localesAvailable.includes(p))
    const dictList = await Promise.all(availablePaths.map((p) => ODA.loadJSON(Localization.path + p)))
    Object.assign(Localization.dictionary.phrase, ...dictList.map(d => d.phrase))
    Object.assign(Localization.dictionary.words, ...dictList.map(d => d.words))
    if (dictList.length > 0) Localization.available = true
    else console.log('Localization: ', 'No available dictionary')
}

// Object.defineProperty(ODA, 'language', {
//     get() {
//         return globalThis.localStorage.getItem('oda-language') || navigator.language;
//     },
//     set(v) {
//         globalThis.localStorage.setItem('oda-language', v);
//     }
// });

// globalThis.addEventListener('language-changed', function(){console.log("ss")})
// language-changed
// listen('language-changed', 'console.log("ss")', { target: window.top }) 
// Localization.attached = () => { 
//     this.listen('language-changed', 'console.log("ss")', { target: window.top }) 
// },
// Localization.detached = () => { this.unlisten('language-changed', 'console.log("ss")', { target: window.top }) },

Localization.setLocale(ODA.language)
// console.log('jj')

/* Ф-я перевода */
Localization.translate = (defVal = '') => {
    
    if (ODA.language === 'en') return defVal // Английский язык мы не переводим совсем.
    const testLeter = new RegExp('[a-z].*?', 'gi')

    const phrase = defVal.split(/\r?\n/).map(a => a.trim()).filter(a => testLeter.test(a))
    const words = defVal.split(/\s+/).map(a => a.trim()).filter(a => testLeter.test(a))

    phrase.forEach(v => ODA.localization.inPage.phrase[v] = '')
    words.forEach(v => ODA.localization.inPage.words[v] = '')

    // if (defVal == 'Search') console.log(defVal,words, ODA.localization.inPage.words)

    const phraseK = Object.keys(ODA.localization.dictionary.phrase)
    const wordsK = Object.keys(ODA.localization.dictionary.words)

    let newVal = defVal

    if (phraseK.length > 0) {
        const rephrase = new RegExp('\\b' + phraseK.join('\\b|\\b') + '\\b', "g")
        newVal = newVal.replaceAll(rephrase, md => ODA.localization.dictionary.phrase[md])
    }
    if (wordsK.length > 0) {
        const reWords = new RegExp('\\b' + wordsK.join('\\b|\\b') + '\\b', "g")
        newVal = newVal.replaceAll(reWords, md => ODA.localization.dictionary.words[md])
    }

    return newVal || ''
}

// ODA.translateLite = (defVal = '') => {
//     if (ODA.language === 'en') return defVal // Английский язык мы не переводим совсем.

//     const trphrase = ODA.localization.dictionary.phrase[defVal]
//     const trWords = ODA.localization.dictionary.words[defVal]

//     if (trphrase !== undefined) return trphrase
//     if (trWords !== undefined) return trWords

//     return defVal || ''
// }
// Пояснеия:  .__ft -- flag translate -- хранит нужен ли вообще перевод, .__t -- хранит актуальный перевод
// Localization.available -- готов ли перевод


/* Переопределение Геттера и Сеттера */
const textContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent') //Node.textContent
const textSet = textContent.set;
const textGet = textContent.get;
let condNoTranslate = (el) => {
    const node = el.parentElement ? el.parentElement.$node: el.$node;
    return ( !Localization.translateTagList.includes(node?.tag) 
                    || node.bind?.notranslate || node.attrs?.notranslate != undefined)
}
let _newVal = (el,val) => {
    // if (val=='Watchers') console.log(val)
    const flagTranslate = (el.__ft != undefined) ? el.__ft // определяем нужен ли вообще перевод причем 1 раз
                        : (!(el.nodeType === 3 || el.nodeType === 1)) ? false 
                        : ((/\{\{((?:.|\n)+?)\}\}/g.test(val))) ? false 
                        : (condNoTranslate(el)) ? false : true
    el.__ft = flagTranslate
    if (val === 'OK') console.log(el, condNoTranslate(el))
    if (!flagTranslate) return val
    else if (!ODA.localization.available) {el.__t = undefined; return val} // Если словарь не готов, то сбрасываем перевод
    else if (el.__t != undefined && el.__t != '') return el.__t // Если перевод уже сделан возвращаем его
    else {el.__t = Localization.translate(val); return el.__t }
}
textContent.set = function (val) {
    // console.log(this)
    const newVal = _newVal(this,val)
    textSet.call(this, newVal)  // переводим, перевод сохраняем
}
textContent.get = function () {
    const val = textGet.call(this)
    const newVal = _newVal(this,val)
    return newVal

    // const flagTranslate = getFlagTranslate (this,val)
    // this.__ft = flagTranslate

    // if (!flagTranslate) return val

    // if (!(Localization?.available && /* this.isConnected && */ this.nodeType === 3)) return value  // с isConnected не работает  
    // if (this.__translate != undefined) return this.__translate                                      // перевод уже есть
    // if ((/\{\{((?:.|\n)+?)\}\}/g.test(value))) { this.__translate = value; return value }           // нужно обрабатывать без перевода
    // if (condNoTranslate(this)) { this.__translate = value; return value }                           // стили и svg
    // const translates = ODA.translate(value)
    // this.__translate = translates
    // // if ( /Dictionaries/g.test(value) ) console.log(value,this )
    // return translates
}
Object.defineProperty(Node.prototype, 'textContent', textContent)

const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')
const innerSet = innerHTML.set;

innerHTML.set = function (val) {
    const newVal = _newVal(this,val)
    innerSet.call(this, newVal)  // переводим, перевод сохраняем

    // if (val == "Watchers") console.log (val, this)
    // // if (!(Localization.available && this.isConnected && (this.nodeType === 3 || this.nodeType === 1))) {console.log (val) }
    // // else if ((/\{\{((?:.|\n)+?)\}\}/g.test(val))) { }
    // // else if (condNoTranslate(this)) { }
    // // else {console.log (val)}
    
    // innerSet.call(this, val)
}
Object.defineProperty(Element.prototype, 'innerHTML', innerHTML)

// console.log(innerHTML)

/* Нажатие клавиши */
window.addEventListener('keydown', async e => {
    if (e.code === 'KeyL' && e.altKey) {
        try{
            await ODA.import('@tools/containers');
            const result = await ODA.showDialog('oda-localization-tree', {}, {icon: 'icons:flag', title: 'Dictionaries', autosize: false, buttons: [{ label: 'Download', icon: 'icons:file-download' }]})
            result.setNewDict()
            if (result.focusedButton.label === 'Download')
                result.dlDict();
        }
        catch (e){
            console.error(e);
        }
    }
})


/*  */
ODA({is: 'oda-localization-tree', imports: '@oda/table', extends: 'oda-table',
    props: {
        evenOdd: true,
        showHeader: true,
        allowSort: true,
        lazy: true,
        autoSize: true,
        autoWidth: true, //sort: [[letter]],
        dataSet() {
            const words = sumObAB(ODA.localization.inPage.words, ODA.localization.dictionary.words)
            const phrase = subObAB(sumObAB(ODA.localization.inPage.phrase, ODA.localization.dictionary.phrase), words)
            let ds = {}
            Object.keys(words).forEach(k => ds[k] = {
                words: k, translates: (new TRANSLATE(k, 'words')), letter: k[0].toLocaleLowerCase(), items: []
            })
            Object.keys(phrase).map(k => {
                const testLeter = new RegExp('[a-z].*?', 'gi')
                k.split(/\s+/).map(a => a.trim()).filter(a => testLeter.test(a)).forEach(w => {
                    if (ds[w] == undefined) ds[w] = {
                        words: w, translates: new TRANSLATE(w, 'words'), letter: w[0].toLocaleLowerCase(),
                        items: [{ words: k, translates: new TRANSLATE(k, 'phrase') }]
                    }
                    else { ds[w].items.push({ words: k, translates: new TRANSLATE(k, 'phrase') }) }
                })
            })
            console.log(Object.values(ds))
            this.groups = [this.columns.find(c => c.name === 'letter')];
            return Object.values(ds)
        },

    },
    columns: [{ name: 'words', treeMode: true, $sort: 1, fix: 'left' },
    { name: 'translates', template: 'input' },
    { name: 'letter', hidden: true, $sortGroups: 1, $expanded: true }],
})

// ODA({is: 'oda-localization-words', imports: '@oda/basic-input',
//     template: /*html*/ `<oda-basic-input :value='value()' :read-only ></oda-basic-input>`,
//     props: { readOnly: true }, value() { return this.item?.words }
// })
//
// ODA({is: 'oda-localization-translates', extends: 'oda-localization-words',
//     props: {readOnly:false}, value() {return this.item?.Translates?.t}
// })

// ODA({
//     is: 'oda-localization-table', imports: '@oda/table, @oda/button, @oda/basic-input, @oda/toggle, @tools/dropdown, @oda/listbox, @oda/tree',
//     showHeader: true, rowLines: true, colLines: true, evenOdd: true, allowFocus: true, allowSort: true,
//     template: /*html*/ `
//         <style>
//             :host {@apply --vertical; /*height: 300px; */}
//             #battons-row {display: flex;}
//             .selelem {display: flex;/*border:1px solid #f0f0f0;*/ margin: 3px; align-items: center;}
//             .label {line-height:34px;}
//         </style>
//         <div ~if="!newVID" id='battons-row'>
//             <div ~if="!newVID" class='selelem'>
//                 <div class='label' @tap="tDict=!tDict"  :selected='!tDict'>{{_nameDict(0)}}</div>
//                 <oda-toggle ::toggled='tDict' ></oda-toggle>
//                 <div class='label'  @tap="tDict=!tDict"  :selected='tDict'>{{_nameDict(1)}}</div></div>
//             <div ~if="!newVID" class='selelem'>
//                 <div class='label'  @tap="eyeAll=!eyeAll"  :selected='!eyeAll'>Only visible</div>
//                 <oda-toggle ::toggled='eyeAll' ></oda-toggle>
//                 <div class='label' @tap="eyeAll=!eyeAll" :selected='eyeAll'>All</div></div>
//             <div class='selelem'>
//                 <oda-selectbox :items="localesAvailрусский язык
//             <oda-localization-grid ::content="phraseBase" ~if="tDict" :header-names="['phrase','translate']" ></oda-localization-grid>
//             <oda-localization-grid ::content="phraseDop" ~if="tDict && eyeAll"></oda-localization-grid>
//             <oda-localization-grid ::content="wordsBase" ~if="!tDict" :header-names="['words','translate']" ></oda-localization-grid>
//             <oda-localization-grid ::content="wordsDop" ~if="!tDict && eyeAll"></oda-localization-grid>
//         </div>
//         <oda-localization-tree ></oda-localization-tree>
//     `,
//     observers: ['_dataset( currentLocal, lidx)'],
//     props: {
//         newVID: 1,
//         dataSet: [],
//         eyeAll: true, tDict: false,
//         currentLocal: 'forInit', // {get() {return ODA.localization.currentLocal}},
//         phraseBase: [], phraseDop: [], wordsBase: [], wordsDop: [],
//         localesAvailable: [], lidx: {
//             set(lidx) {
//                 Localization.lidx = lidx
//                 Localization._setDictionary(lidx)
//             },
//             get() { return Localization.lidx }
//         },
//     },
//     currentDict() {
//         let toObj = (arr, rez = {}) => { for (let n of arr) { rez[n.key] = n.val }; return rez }
//         let extractObj = namE => toObj(this[namE].filter(el => el.val != ''))
//         return {
//             words: sumObAB(extractObj('wordsBase'), extractObj('wordsDop')),
//             phrase: sumObAB(extractObj('phraseBase'), extractObj('phraseDop'))
//         }
//     },
//     setNewDict() { Localization.dictionary = this.currentDict() },
//     dlDict() {
//         const downLoad = document.createElement('a');
//         downLoad.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(this.currentDict(), null, '\t'));
//         downLoad.setAttribute('download', 'ODA_dictionary.' + this.currentLocal + '.json');
//         downLoad.click();
//     },
//     _nameDict(b) { return b ? 'phrase' : 'words' },
//     _dataset(local, lidx) {
//         const sPW = Localization.phrase, dP = Localization.dictionary.phrase,
//             sW = Localization.words, dW = Localization.dictionary.words, sP = subObAB(sPW, sW);

//         let toData = (ob, rez = []) => { for (let k in ob) { rez.push({ 'key': k, 'val': ob[k] }) }; return rez }

//         this.wordsDop = toData(subObAB(dW, sW))
//         this.wordsBase = toData(sumObAB(supObAB(dW, sW), sW))

//         this.phraseDop = toData(subObAB(dP, sP))
//         this.phraseBase = toData(sumObAB(supObAB(dP, sP), sP))

//         let allWords = sumObAB(sW, dW), allphrase = sumObAB(sPW, dP)
//         let allphraseArr = Object.keys(allphrase).map((key) => { return { col1: key, col2: allphrase[key] } });
//         Object.keys(allWords).map(k => allWords[k] = { col1: k, col2: allWords[k], items: [] })
//         allphraseArr.forEach(o => {
//             o.col1.split(/\s+/).forEach(w => {
//                 if (allWords[w] != undefined) { allWords[w].items = (allWords[w].items) ? [o] : [o].concat(allWords[w].items) }
//                 else { allWords[w] = { col1: w, items: [o] } }
//             })
//         })

//         this.dataSet = Object.values(allWords)
//         this.localesAvailable = Localization.localesAvailable
//     },
//     _lselect() {//<oda-selectbox :items="localesAvailable" ><oda-selectbox></oda-selectbox>
//         const dropdown = document.createElement('oda-list-box');
//         ODA.showDropdown(dropdown, { items: this.localesAvailable }, {}).then(resolve => {
//         });
//     },

// })





// ODA({
//     is: 'oda-localization-grid', imports: '@oda/basic-input', template: /*html*/ `
//         <style>
//             #gridall {display: grid; grid-template-columns: 1fr 1fr; grid-gap: 1px; background:#999; padding:2px;}
//             .key {grid-column:1;background:#fff;}
//             .val {grid-column:2;background:#fff;}
//             oda-basic-input {padding:0;}
//             oda-basic-input.odd  {background:#f0f0f0;}
//             .head {grid-row:1; background:#ddd; text-align:center; font-weight:bold; line-height:26px; position: sticky; top: 0px;}
//         </style>
//         <div id='gridall'>
//             <div class='key head'>{{headerNames[0]}}</div>
//             <div class='val head'>{{headerNames[1]}}</div>
//             <oda-basic-input :class="'key '+ ((index%2)? 'even':'odd')" :style="'grid-row:'+(index+2)" ~for="content" ::value="content[index].key" :read-only="true"> </oda-basic-input>
//             <oda-basic-input :class="'val '+ ((index%2)? 'even':'odd')" :style="'grid-row:'+(index+2)" ~for="content" ::value="content[index].val"> </oda-basic-input>
//         </div>
//     `,
//     props: {
//         content: [],
//         headerNames: [],
//     },
// })

// ODA({
//     is: 'oda-selectbox', imports: '@oda/button', template: /*html*/ `
//         <style>
//             :host {position: relative; }
//             .line {display:flex; width:100%; justify-content: space-between; cursor: pointer; height:40px; }
//             .label {display: inline-grid;}
//             .hide-- {display: none;}
//             .option {position:absolute; background:rgb(240, 240, 240); z-index: 99; border:1px solid rgb(153, 153, 153); }
//             .option oda-button { justify-content: flex-start ; margin:1px -1px; padding:2px;}

//         </style>
//         <div class="line" @tap="showOptions=!showOptions">
//             <oda-icon :icon="items[sidx]?.icon" ></oda-icon>
//             <div class="label">{{items[sidx]?.label}}</div>
//             <oda-icon icon="icons:arrow-drop-down" ></oda-icon>
//         </div>
//         <div ~if="showOptions" class="option">
//             <oda-button ~for="items"    @tap="focusedItem=index" :icon="item?.icon" :label="item.label"></oda-button>
//         </div>
//         `,
//     props: {
//         items: [{ icon: "image:style", label: "style" }, { icon: "communication:vpn-key", label: "vpn-key" }],
//         sidx: 0,
//         showOptions: false,
//         focusedItem: {
//             set(e) {
//                 this.sidx = e
//                 this.showOptions = false
//             }
//         }

//     },
// })




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

CLASS({
    is: 'TRANSLATE',
    ctor(key, type) {
        this.key = key
        this.type = type
    },
    get t() {
        let rez = ODA.localization.dictionary[this.type][this.key]
        if (typeof rez === 'string') return rez
        else return ''
    },
    set t(val) { ODA.localization.dictionary[this.type][this.key] = val }
})
