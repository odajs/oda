/* Регистрация Инструмента */
const Localization = ODA.regTool('localization');
const domParser = new DOMParser();

Localization.path = import.meta.url.split('/').slice(0, -1).join('/'); // locales path
Localization.translateTagList = ['label', 'h3']

window.top.addEventListener('change-language', e => window.location.reload() )
ODA.loadJSON(Localization.path + '/dictionary/phrases.json').then(res=>{
   res.forEach(i => sessionStorage.setItem(i, '.'))
}).catch(e=>{

})
ODA.loadJSON(Localization.path + '/dictionary/' + ODA.language + '.json').then(res=>{
    Localization.dictionary = Object.assign(Object.create(null),res)
}).catch(e=>{
    Localization.dictionary = Object.create(null)
})

// try       {
//     Localization.dictionary = Object.assign(Object.create(null), await ODA.loadJSON(Localization.path + '/dictionary/' + ODA.language + '.json'));
//     Object.keys(Localization.dictionary).forEach(i => sessionStorage.setItem(i, '.'))
// }
// catch (e) {
//     Localization.dictionary = Object.create(null)
// }


/* Ф-я перевода */
function translateWord(word, uppercases, toStorage = true){
    let key = word.toLowerCase().trim();
    if (key !== '' && toStorage)
        sessionStorage.setItem(key, '.');
    let value = Localization.dictionary[key] || '';
    if (!value || typeof value !== 'string'){
        value = word;
    }
    else if (uppercases) {
        if (uppercases === 1)
            value = value.toCapitalCase();
        else if(word.length === uppercases)
            value = value.toUpperCase();
    }

    return value;
}
const regExp = /([A-Za-z]|\s)+/gi;
Localization.translate = function (text = '', toStorage = true){
    let result = ''
    let prase = ''
    for (let ch of text){
        if (!ch.match(regExp)){
            result += translatePhrase(prase, toStorage) + ch;
            prase = ''
        }
        else
            prase += ch;
    }
    result += translatePhrase(prase, toStorage);
    return result;
}
function translatePhrase(phrase, toStorage){
    if (!phrase.trim())
        return phrase
    let key = phrase.toLowerCase().trim();
    if (toStorage){
        sessionStorage.setItem(key, '.')
    }
    let value =  key.split(' ').length>1?Localization.dictionary[key] || '':'';
    if (!value){
        let word = '';
        let uc = 0;
        for (let ch1 of phrase){
            if (ch1 === ' '){
                value += translateWord(word, uc, toStorage) + ch1;
                uc = 0;
                word  = ''
            }
            else{
                const lch = ch1.toLowerCase()
                uc +=  (lch !== ch1)?1:0
                word += ch1;
            }
        }
        if(word)
            value += translateWord(word, uc, toStorage);
    }
    return value;
}
function _newVal(val) {
    if (!this.isConnected || !val)
        return val;

    switch (this.__translate) {
        case false:
            return val;
        case undefined:
            this.__translate_src = val;
            break;
        default: {
            return this.__translate;
        }
    }
    this.__translate = false;
    switch (this.nodeType) {
        case 3: {
            if (!Localization.translateTagList.includes(this.parentElement?.localName)) {
                return val;
            }
            this.__translate = Localization.translate(val);
        } break;
        case 1: {
            if (!Localization.translateTagList.includes(this.localName)) {
                return val;
            }
            const doc = domParser.parseFromString(val, 'text/html');
            this.__translate = HtmlToText(doc.body.childNodes);
        } break;
        default:
            return val;
    }
    return this.__translate;
}
function HtmlToText(nodes, toStorage = true){
    let result = ''
    for (let i of nodes){
        switch (i.nodeType) {
            case 3: {
                result += Localization.translate(i.textContent, false);
            } break;
            case 1: {
                result += `<${i.localName}>${HtmlToText(i.childNodes, false)}</${i.localName}>`
            } break;
        }
    }
    return result;
}
/* Переопределение Геттера и Сеттера */
const textContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent') //Node.textContent
const textSet = textContent.set;
const textGet = textContent.get;

textContent.set = function (val) {
    if (this.__translate && this.__translate_src !== val){
        this.__translate = undefined;
    }
    const newVal = _newVal.call(this, val)
    textSet.call(this, newVal)  // переводим, перевод сохраняем
}
textContent.get = function () {
    const val = textGet.call(this)
    const newVal = _newVal.call(this, val)
    return newVal
}
Object.defineProperty(Node.prototype, 'textContent', textContent)

const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')
const innerSet = innerHTML.set;
const innerGet = innerHTML.get;

innerHTML.set = function (val) {
    if (this.__translate && this.__translate_src !== val)
        this.__translate = undefined;
    const newVal = _newVal.call(this, val)
    innerSet.call(this, newVal)  // переводим, перевод сохраняем
}
innerHTML.get = function () {
    const val = innerGet.call(this)
    const newVal = _newVal.call(this, val)
    return newVal
}
Object.defineProperty(Element.prototype, 'innerHTML', innerHTML)
import '../containers/containers.js'
/* Нажатие клавиши */
window.addEventListener('keydown', async e => {
    if (e.code !== 'KeyL' || !e.altKey) return;
    // await top.ODA.import('@tools/containers');
    await top.ODA.showDialog('oda-localization-tree', {style: 'margin: 32px'}, {fullSize: true,
        icon: 'icons:flag',
         title: 'Dictionaries',
         autosize: false})
    top.location.reload();
})

/*  */
ODA({ is: 'oda-localization-tree', imports: '@oda/table', extends: 'oda-table',
    template:`
        <style>
            :host{
                @apply --shadow;    
            }
        </style
    `,
    props: {
        showHeader: true,
        colLines: true,
        rowLines: true,
        allowFocus: true,
        allowSort: true,
        lazy: true,
        showFilter: true,
        autoSize: true,
        autoWidth: true, //sort: [[letter]],
    },
    columns: [{ name: 'word', treeMode: true, $sort: 1, fix: 'left', width: 200 },
              { name: 'translate', template: 'oda-localization-input' },
              { name: 'letter', hidden: true, $sortGroups: 1, $expanded: true, $hideExppander: true }],
    attached(){
        this.groups = [this.columns.find(c => c.name === 'letter')];
        this.async(()=>{
            this.dataSet = Object.keys(sessionStorage).filter(w=>{
                return sessionStorage.getItem(w) === '.';
            }).map(w=>{
                return {word: w, letter: w[0], translate: Localization.dictionary[w] || ''}
            })
        })
    }
    // dlDict() {
    //     let rez = { }
    //     this.dataSet.forEach( o => {
    //         if (o.translates != '') rez[o.words.toLowerCase()] = o.translates.toLowerCase()
    //     })
    //     let a = document.createElement("a");
    //     let file = new Blob([JSON.stringify(rez, null, " ")], {type: 'application/json'});
    //     a.href = URL.createObjectURL(file);
    //     a.download = ODA.language + ".json";
    //     a.click();
    // },
    // dlPhrase() {
    //     let rez = []
    //     Object.entries( sessionStorage ).forEach( ([k,v]) => (v==='p')? rez.push(k) : {} )
    //     let a = document.createElement("a");
    //     let file = new Blob([JSON.stringify(rez, null, " ")], {type: 'application/json'});
    //     a.href = URL.createObjectURL(file);
    //     a.download = "phrases.json";
    //     a.click();
    // }
})

ODA({ is: 'oda-localization-input', template: /*html*/ `
        <style>
            :host{
                @apply --horizontal;
                @apply --header;
                align-self: center;
                @apply --flex;
                height: 100%;
            }
        </style>
    <input @input="onInput" :value="getValue" class="flex" style="padding: 4px; border: none; outline: none;" :header="item?.translate" :placeholder="getPlaceholder()">
    `,
    onInput(e){
        this.item.translate = Localization.dictionary[this.item?.word] =  (e.target.value || '').toLowerCase();
    },
    getValue(){
        return this.item?.translate;
    },
    getPlaceholder(){
        return Localization.translate(this.item?.word);
    }
})

