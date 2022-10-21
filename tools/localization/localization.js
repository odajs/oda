/* Регистрация Инструмента */
const Localization = ODA.regTool('localization');


Localization.path = import.meta.url.split('/').slice(0, -1).join('/'); // locales path
Localization.translateTagList = ['label', 'h3']

window.top.addEventListener('change-language', e => window.location.reload() )

try{
    const fr = await ODA.loadJSON(Localization.path+'/dictionary/phrases.json');
    fr.forEach(i => sessionStorage.setItem(i, '?'))
}
catch (e) {}

let dictionary;
try       { dictionary = await ODA.loadJSON(Localization.path+'/dictionary/'+ODA.language + '.json'); }
catch (e) { dictionary = {} }

const separators = [' ', '.', ',', ':', '-', '(', ')', '~', '!', '<', '>', '/', '\\'] 

/* Ф-я перевода */
function translateWord(word, uppercases){
    let key = word.toLowerCase();
    if (key!='') sessionStorage.setItem(key, 'w');
    let value = dictionary[key] || '';
    if (!value){
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
Localization.translate = function (text = ''){
    let key = text.toLowerCase();
    sessionStorage.setItem(key, 'p')
    let value = dictionary[key] || '';
    if (!value){
        let word = '';
        let uc = 0;
        for (let ch of text){
            if (separators.includes(ch)){
                value += translateWord(word, uc) + ch;
                uc = 0;
                word  = ''
            }
            else{
                const lch = ch.toLowerCase()
                uc +=  (lch !== ch)?1:0
                word += ch;
            }
        }
        if(word)
            value += translateWord(word, uc);
    }
    return value;
}

function _newVal(val, mTag=false) {
    if (!this.isConnected || !val)
        return val;
    switch (this.__translate) {
        case false:
            return val;
        case undefined:
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
        } break;
        case 1: {
            if (!Localization.translateTagList.includes(this.localName)) {
                return val;
            }
        } break;
        default:
            return val;
    }

    if (mTag) {
        function replacer(_, p1, p2) {  return ( (p1.trim()==='')?p1:Localization.translate(p1) ) + p2 }
        this.__translate = val.replace(/([^<]*?)(<[^>]*>|$)/g, replacer )
    } else 
        this.__translate = Localization.translate( val )

    return this.__translate;

}
/* Переопределение Геттера и Сеттера */
const textContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent') //Node.textContent
const textSet = textContent.set;
const textGet = textContent.get;

textContent.set = function (val) {
    if (this.__translate && this.__translate.src !== val)
        this.__translate = undefined;
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
    if (this.__translate && this.__translate.src !== val)
        this.__translate = undefined;
    const newVal = _newVal.call(this, val,true)
    innerSet.call(this, newVal)  // переводим, перевод сохраняем
}
innerHTML.get = function () {
    const val = innerGet.call(this)
    const newVal = _newVal.call(this, val,true)
    return newVal
}
Object.defineProperty(Element.prototype, 'innerHTML', innerHTML)

/* Нажатие клавиши */
window.addEventListener('keydown', async e => {
    if (e.code === 'KeyL' && e.altKey) {
        try {
            let exeButton = ''
            await ODA.import('@tools/containers');
            const result = await ODA.showDialog('oda-localization-tree', {}, {
                 icon: 'icons:flag', 
                 title: 'Dictionaries', 
                 autosize: false, 
                 buttons: [ { label: 'Download Dictionary', icon: 'icons:file-download', execute:(e)=> exeButton='dlDict'},
                            { label: 'Download Phrases', icon: 'icons:file-download', execute:(e)=> exeButton='dlPhrase'}]
                })
            if (exeButton==='dlDict') result.dlDict()
            if (exeButton==='dlPhrase') result.dlPhrase()
        }
        catch (e) { }
    }
})

/*  */
ODA({ is: 'oda-localization-tree', imports: '@oda/table', extends: 'oda-table',
    attached() { this._dataSet() } ,
    props: {
        showHeader: true,
        allowSort: true,
        lazy: true,
        showFilter: true,
        autoSize: true,
        autoWidth: true, //sort: [[letter]],
        dataSet : []
    },
    columns: [{ name: 'words', treeMode: true, $sort: 1, fix: 'left' },
              { name: 'translates', template: 'oda-localization-input' },
              { name: 'letter', hidden: true, $sortGroups: 1, $expanded: true, $hideExppander: true }],
    _dataSet() {
        const all = { ...dictionary}
        for (let k of Object.keys(sessionStorage)) if (all[k]===undefined) all[k] = ''
 
        this.groups = [this.columns.find(c => c.name === 'letter')];
        this.dataSet = Object.entries(all).map(([k,v]) => {
            return {words: k.toLowerCase(), translates:v, letter: k.slice(0,1).toLowerCase() }} )
    },
    dlDict() {
        let rez = { }
        this.dataSet.forEach( o => {
            if (o.translates != '') rez[o.words.toLowerCase()] = o.translates.toLowerCase()
        })
        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(rez, null, " ")], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = ODA.language + ".json";
        a.click();
    },
    dlPhrase() {
        let rez = []
        Object.entries( sessionStorage ).forEach( ([k,v]) => (v==='p')? rez.push(k) : {} )
        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(rez, null, " ")], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = "phrases.json";
        a.click();
    }
})

ODA({ is: 'oda-localization-input', template: /*html*/ `
        <style>
            :host{
                @apply --horizontal;
                @apply --header;
                align-self: center;
                @apply --flex;
            }
        </style>
    <input ::value='item.translates' class="flex" style="padding: 4px; height: 100%;" :placeholder>
    `,
    get placeholder(){
        return Localization.translate(this.item.words || '');
    }
})

