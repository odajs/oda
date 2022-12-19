/* Регистрация Инструмента */
const Localization = ODA.regTool('localization');
ODA.localization.saveMethod = async  (phrases, dictionary)=>{
    // console.log('СОХРАНЕНИЕ СЛОВАРЕЙ')
    ODA.top.location.reload();
    //todo сделать стандартный метод сохранения словарей
}
const domParser = new DOMParser();

Localization.path = import.meta.url.split('/').slice(0, -1).join('/'); // locales path
Localization.translateTagList = ['label', 'h3']

ODA.top.addEventListener('change-language', e => window.location.reload() )



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
    // console.log(val)
    // if ((typeof val == 'string')&&(val.includes('AlligatorTor'))) console.log('all', val)
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
                // if ((typeof val == 'string')&&(val.includes('AlligatorTor'))) console.log('all', val)
                return val;
            }
            // if ((typeof val == 'string')&&(val.includes('AlligatorTor'))) console.log('all', val)
            
            // const doc = domParser.parseFromString(val, 'text/html');

            // this.__translate = HtmlToText(doc.body.childNodes);

            function replacer(_, p1, p2) {  return ( (p1.trim()==='')?p1:Localization.translate(p1) ) + p2 }
            this.__translate = val.replace(/([^<]*?)(<[^>]*>|$)/g, replacer )


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
                result += Localization.translate(i.textContent, toStorage);
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
// textContent.get = function () {
//     const val = textGet.call(this)
//     let newVal = _newVal.call(this, val)
//     if (newVal?.then) {
//         newVal.then (val => {
//             textSet.call(this,val)
//         })
//         return '' // проверить заход
//     }
//     return newVal
// }

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

/* Нажатие клавиши */
window.addEventListener('keydown', async e => {
    if (e.code !== 'KeyL' || !e.altKey) return;
    await import('../containers/containers.js');
    const result = await ODA.top.ODA.showDialog('oda-localization-tree', {style: 'margin: 32px'}, {fullSize: true,
        icon: 'icons:flag',
         title: 'Dictionaries',
         autosize: false})
    const phrases = Object.entries(sessionStorage).filter(i=>{
        return i[1] === '.'
    }).map(i=>{
        return i[0];
    })


    const dictionary = result.dataSet.filter(i=>{
        return i.translate;
    }).reduce((res, i)=>{
        res[i.word] = i.translate;
        return res;
    }, {})
    await ODA.top.ODA.localization.saveMethod(phrases, dictionary);

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
              { name: 'translate', cellTemplate: 'oda-localization-input' },
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


setTimeout(()=>{
    ODA.loadJSON(Localization.path + '/dictionary/phrases.json').then(res=>{
        res.forEach(i => sessionStorage.setItem(i, '.'))
    }).catch(e=>{

    })
    ODA.loadJSON(Localization.path + '/dictionary/' + ODA.language + '.json').then(res=>{
        // console.log(res)
        Localization.dictionary = Object.assign(Object.create(null),res)
    }).catch(e=>{
        console.log(e)
        Localization.dictionary = Object.create(null)
    })
})

function tr(str){
    let object = new Promise((resolve, reject)=>{
        resolves[str] = resolve;
        worker.str({type: 'translate', 'str':str });
        return icons[n];
    })
    return object;
}

let worker = new ODA.Worker(Localization.path + '/localizationW.js');

// worker.onmessage = function (e){
//     switch (e.data?.type){
//         case 'svg':{
//             const dom = parser.parseFromString(e.data.doc, 'text/html');
//             const template = dom.querySelector('template');
//             const size = +template.getAttribute('size') || 0
//             e.data.svg = Array.prototype.reduce.call(template.content.children, (res, i)=>{
//                 res[i.id] = {body: {body: i.outerHTML, size: (+i.getAttribute('size') || size)}};
//                 return res
//             }, {})
//             worker.postMessage(e.data);
//         } break;
//         case 'request':{
//             worker.postMessage(e.data.icon);
//         } break;
//         default:{
//             icons[e.data.icon] = e.data;
//             resolves[e.data.icon]?.(e.data);
//             delete resolves[e.data.icon];
//         } break;
//     }
// }
// worker.onmessageerror = function (e) {
//     console.error(e);
// }

worker.postMessage({type: 'init'})
worker.postMessage({type: 'setlanguage', language: ODA.language})