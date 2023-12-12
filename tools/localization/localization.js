import('../containers/containers.js');
import {translate as translateDict} from './localization-ww.js';

/* Регистрация Инструмента */
const Localization = ODA.regTool('localization');
ODA.localization.saveMethod = async (wwObj) => {
    //todo сделать стандартный метод сохранения словарей
    const link = document.createElement('a');
    link.download = wwObj.lang + '.json'
    const data = new Blob([JSON.stringify(wwObj.dictionary, null, 1)])
    link.href = URL.createObjectURL(data, { type: "application/json", encoding: "UTF-8" })
    // link.click(); //! Строка закомментирована для удобства отладки
}
Localization.translateTagList = ['label', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9',  'slot']
Localization.updateDictionary = paths => worker.postMessage({ type: 'update_paths', paths })

Localization.translateString = translateString

ODA.top.addEventListener('change-language', async e => await reTranslate())

let path = import.meta.url.split('/').slice(0, -1).join('/'); // locales path
let translateElemSet = [];
let allTranslates = {}; // Все переводы страницы

async function reTranslate() {
    for (let element of translateElemSet) {
        const bak = element.__bak
        const tr = await translateString(element[bak.src])
        element[bak.name] = tr;
        bak.set.call(element, tr);
    }
}

function translate(val, bak) {
    if ( !val || this[bak.name] !== undefined)
        return;

    if (this.hasAttribute?.('no-translate') ||  this.parentElement?.hasAttribute?.('no-translate')) return;

    let element = this;
    if (bak.test) {
        switch (this.nodeType) {
            case 3: {
                if (this.parentElement?.hasAttribute?.('no-translate') || !Localization.translateTagList.includes(this.parentElement?.localName)) {
                    this[bak.name] = val;
                    return;
                }
                element = this.parentElement;
            } break;
            case 1: {
                if (this.hasAttribute?.('no-translate') || !Localization.translateTagList.includes(this.localName)) {
                    this[bak.name] = val;
                    return;
                }
            } break;
            default: return;
        }
    }
    element.__bak = bak
    translateElemSet.add(element);
    element[bak.src] ??= val; // сохраняем исходное

    Promise.resolve( translateString(val) ).then(res => {
        if (element[bak.src]===val) {
            element[bak.name] = res;
            bak.set.call(element, res)
        }
        else {
            element[bak.src] = bak.get.call(this);
            translate.call(this, element[bak.src], bak);
        }
    })

}

function translateString(val, html = false, lang = ODA.language) {
    allTranslates[lang] ??= {};
    allTranslates[lang][val] ??= {}
    const cache = allTranslates[lang][val];
    if (cache?.translate) return cache.translate
    if (cache?.promise) return cache.promise
    worker.postMessage({ type: 'translate', key: val, html, lang });
    return cache.promise = new Promise(resolve => cache.resolver = resolve)
}

function getHandler(bak) {
    const valDef = bak.get.call(this);

    if (this[bak.src] !== valDef) {
        this[bak.src] = valDef;
        bak.set.call(this, valDef);
    }
    let val = (this[bak.src] !== undefined) ? this[bak.src] : bak.get.call(this)
    const tr = this[bak.name]
    if (tr === undefined) translate.call(this, val, bak)
    else if (typeof tr === 'string') val = tr

    return valDef
}

function setHandler(val, bak) {

    if (this[bak.src] !== val) {
        this[bak.name] = undefined;
        if (!val) this[bak.src] = undefined;
        translate.call(this, val, bak)
    }

    bak.set.call(this, val);
}

/* Переопределение Геттеров и Сеттеров */
[
    [Node, 'textContent', true],
    [Element, 'innerHTML', true],
    [HTMLElement, 'title', false],
    [HTMLInputElement, 'placeholder', false]
].forEach(([ctor, propName, test]) => {
    const propertyDesc = Object.getOwnPropertyDescriptor(ctor.prototype, propName);

    const propertyDescBak = {
        get: propertyDesc.get,
        set: propertyDesc.set,
        name: `__translate_${propName}`,
        src: `__translate_${propName}_src`,
        test
    };

    propertyDesc.get = function () {
        return getHandler.call(this, propertyDescBak);
    };
    propertyDesc.set = function (val) {
        setHandler.call(this, val, propertyDescBak);
    };

    Object.defineProperty(ctor.prototype, propName, propertyDesc);
})



const worker = new ODA.Worker(path + '/localization-ww.js', {type:'module'} );
worker.onmessage = async function (e) {
    switch (e.data?.type) {
        case 'translate': {
            const cache = allTranslates[e.data.lang][e.data.key];
            cache.translate = e.data.translate;
            cache.resolver(e.data.translate);
        } break;
        case 'dictionary': {
            editDictionary_resolve(e.data)
        } break;
        case 'log': {
            console.log(e.data.log)
        } break;
        case 'update': {
            delete allTranslates[e.data.lang]
            await reTranslate()
        } break;
        case 'edit_translate': {
            console.log(e.data)
        } break;
    }
}
worker.onmessageerror = function (e) { console.error(e); }
worker.postMessage({ type: 'init', url: path, lang:ODA.language })

let editDictionary_resolve;
function editDictionary(lang = ODA.language) {
    worker.postMessage({ type: 'dictionary', 'lang': lang })
    return new Promise(resolve => editDictionary_resolve = resolve)
}

/* Нажатие клавиши */
ODA.localization.showDialog = false
window.addEventListener('keydown', async e => {
    if (e.code !== 'KeyL' || !e.altKey || ODA.localization.showDialog) return;
    ODA.localization.showDialog = true;
    let changedEvent;
    try{
        const { control: result } = await ODA.top.ODA.showDialog('oda-localization', {},
            {
                minHeight: '90%', minWidth: '90%', maxWidth: '90%', icon: ODA.getFlags(ODA.language),  title: 'Dictionaries: ' + ODA.language,
                buttons: [
                    {
                        is: 'div',
                        class: 'flex',
                        // tap: e => e.stopPropagation(),
                        style: 'pointer-events: none;'
                    },
                    {
                        label: 'Save dictionary',
                        icon: 'icons:save',
                        class: 'success-invert no-flex',
                        disabled() {
                            if (!changedEvent){
                                changedEvent = (e)=>{
                                    this.$render();
                                }
                                this.control.addEventListener('is-changed-changed', changedEvent)
                            }
                            return !this.control?.isChanged;
                        },
                        tap: async e => {
                            e.stopPropagation();
                            const btn = e.target;
                            const _icon = btn.icon;
                            await btn.control._save();
                            btn.icon = _icon;
                        },

                    }]
            }
        )
        result._save()
    }
    catch (e){

    }
    finally {
        ODA.localization.showDialog = false;
    }
})


ODA({is: 'oda-localization', imports:'@oda/menu', template:/*html*/ `
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            overflow: hidden;
        }
        .head {
            color: var(--dark-color);
            fill: var(--dark-color);
            background-color: var(--dark-background);
            align-items: center;
            padding:4px;
            grid-area:head;
        }
        .letters {
            white-space: break-spaces;
            text-align:center;
            padding:0 8px;
        }
        .letters oda-button {
            display: inline-flex;
            padding:4px;
            margin:0 4px;
        }
        .separator {
            width:.5em;
        }
        .part{
            overflow: hidden;
            @apply --flex;
            @apply --vertical;
            min-width: 50%;
        }
        .scroll{
            overflow-y: auto;
            overflow-x: hidden;
            padding: 0px 8px;
            @apply --flex;
        }
        .title{
            @apply --header;
            @apply --horizontal;
            align-items: center;
        }
        b{
            padding: 12px;
        }
    </style>
    <div class='head horizontal'>
        <oda-button icon-size='20' icon='lineawesome:long-arrow-alt-down-solid' @tap='sortAZ=!sortAZ'>
            {{sortAZ?"AZ":"ZA"}}</oda-button>
        <div class='separator'></div>
        <input style="font-size:inherit;padding:4px" type="search" ::value='searchVal' :placeholder='"quick search"' autofocus>
        <div class='separator'></div>
        <oda-button icon-size='20' :icon='hideModes[hideMode].icon' :label='hideModes[hideMode].label' @tap='showMod($event)'></oda-button>
        <div class='flex'></div>
        <div class='letters'>
            <oda-button ~for='fLetters' :title='$for.item.amount' @tap='firstLetter=$for.item.label' ~class='$for.item.error?"error":""'
                :focused='firstLetter===$for.item.label' >{{$for.item.label}}</oda-button></div>
        <oda-button label='All' title='All' @tap='firstLetter=""' :active='firstLetter===""'></oda-button>
    </div>
    <!-- <oda-localization-panel :target='screen?.words' is-word='true'></oda-localization-panel>
    <oda-localization-panel :target='screen?.phrases' is-word='false'> </oda-localization-panel> -->
    <div class="flex horizontal" style="overflow: hidden;">
        <div  class="part">
            <div class="title">
                <b class="flex">Words</b>
                <div class="no-flex horizontal border info"  ~if="focusedWord" style="align-items: center; padding: 2px 2px 2px 8px">
                    <span>{{focusedWord}}</span>
                    <oda-button icon="icons:close" @tap="focusedWord = ''" style="padding: 0px;"></oda-button>
                </div>
            </div>
            <div class="scroll">
                <oda-localization-fieldset ~for='screen?.words' :legend='$for.item' ::value='words[$for.item]' is-word></oda-localization-fieldset>
            </div>
        </div>
        <div class="part">
            <div class="title">
                <b>Phrases</b>
            </div>
            <div class="scroll">
                 <oda-localization-fieldset ~for='screen?.phrases' :legend='$for.item' ::value='phrases[$for.item]'></oda-localization-fieldset>
            </div>
        </div>
    </div>

    `,
    dictionary:{
        $type: Object,
        get(){ // { type:, dictionary: { w:{}, p:{}, r:[] }, phrases: { w:{}, p:{} }, structure: {}, lang:, funTr: }
            worker.postMessage({ type: 'dictionary', 'lang': ODA.language})
            return new Promise(resolve => editDictionary_resolve = resolve);
        }
    },

    get fLetters() {
        return Object.entries(
            Object.keys({ ...this.words, ...this.phrases }).reduce((a,c)=> {
                a[c.slice(0, 1).toUpperCase()] ??= 0;
                a[c.slice(0, 1).toUpperCase()] += 1
                return a
            }, {})
        ).sort((a, b) => (a[0] > b[0]) ? 1 : -1).map(e => {
            const [label, amount, charCode] = [e[0], e[1], e[0].charCodeAt(0)]
            return { label, amount, error: (charCode < 65) || (charCode > 90) }
        })
    },
    get screen() {
        const compare = (a, b) => ((a > b) ? 1 : -1) * (this.sortAZ ? 1 : -1)
        const filTers = (fList) => { return ([s,v]) => {
            let ff =  {
                searchVal: s.toUpperCase().includes(this.searchVal.toUpperCase()),
                hideMode: ( !(this.hideMode===1) || (v!=='')) && ( !(this.hideMode===2) || (v==='')),
                firstLetter: ((this.firstLetter === '') || (s.toUpperCase().slice(0, 1) === this.firstLetter))
            }
            return fList.map(fName=>ff[fName]).every(a=>a)
        }}
        const chain = (x,fList) => Object.entries(x).filter(filTers(fList)).map(l => l[0]).sort(compare)
        return {
            words: chain(this.words, ['searchVal', 'hideMode', 'firstLetter']),
            phrases: (this.focusedWord)? Object.keys(this?.dictionary?.structure[this.focusedWord]||{}) : chain(this.phrases,['searchVal','hideMode'])
        }
    },

    firstLetter: '',
    sortAZ: true,
    searchVal: '',

    $pdp: {
        get words() {
            return { ...this.dictionary?.phrases?.w, ...this.dictionary?.dictionary?.w };
        },
        get phrases() {
            return { ...this.dictionary?.phrases?.p, ...this.dictionary?.dictionary?.p };
        },

        focusedWord: '',
        isChanged: false,

        async _save() {
            if (!this.isChanged) return;
            this.isChanged = false;

            let newDictionary = { p: {}, w: {}, r: this.dictionary.dictionary.r}
            for (let k in this.phrases) if (this.phrases !== '') newDictionary.p[k] = this.phrases[k]
            for (let k in this.words) if (this.words !== '') newDictionary.w[k] = this.words[k]

            // this.wwObject.dictionary = newDictionary

            await ODA.localization.saveMethod({structure: this.dictionary.structure, phrases:this.dictionary.phrases, dictionary:newDictionary,lang: ODA.language});
            worker.postMessage({ type: 'update', lang: ODA.language }) //? посылаем в worker, возможно нужно обернуть в promise
            // // console.log(this.word)
            // this.word.def = { ...this.word.def, ...newDictionary.w }
            // this.phrase.def = { ...this.phrase.def, ...newDictionary.p }

            return 'Ok'
        },
    },

    hideMode:0,
    hideModes:[
        {label: "show All", icon:'bootstrap:eye', mode:0},
        {label: "hide Empty", icon:'bootstrap:eye-slash', mode:1},
        {label: "hide Filled", icon:'bootstrap:eye-slash-fill', mode:2},
    ],
    async showMod(e) {
            const { control } = await ODA.showDropdown('oda-menu', { items: this.hideModes},
            { animation: 500, parent: e.target, intersect: true, align:'right'});
            if (control?.focusedItem?.mode!=undefined) this.hideMode = control.focusedItem.mode
        },
})

ODA({
    is: 'oda-localization-fieldset', template: /*html*/ `
    <style>
        :host {
            margin:12px 0;
            padding: 2px 0px;
            box-sizing: border-box;
        }
        legend{
            white-space: break-spaces;
            text-align: left;
            margin-left: 4px;
            opacity: .5;
        }
        fieldset {
            margin: 12px 0;
            border-radius: 4px;
            border: 1px solid var(--dark-background);
            background-color: var(--content-background, white);
            color: var(--content-color, black);
            fill: var(--content-color, black);
        }
        .content {
            @apply --horizontal;
            @apply --flex;
        }
        input {
            border: none;
            outline-color: silver;
            font-size: larger;
            text-overflow: ellipsis;
            padding: 4px;
        }
    </style>
    <fieldset class="horizontal" :focused>
        <legend bold @tap="editLegend" no-translate>{{legend}}</legend>
        <input no-translate class="flex"  @focus="onFocus" @blur="onBlur" :value @input="onInpot" :placeholder>
    </fieldset>
    `,
    onInpot(e){
        this.value = e.target.value;
        this.isChanged = true;
    },
    editLegend(e) {
        e.target.setAttribute('contenteditable', true);
    },
    onFocus(e) {
        if (this.isWord) {
            this.focusedWord = this.legend;
        }
        if (this.value==='') {
            this.value = this.placeholder
        }
    },
    onBlur(e) {
        if (!this.isWord) {
            let oldVal = this.value
            this.value = ''
            if (oldVal!== this.placeholder) this.value = oldVal
        }
    },
    legend: String,
    value: String,
    isWord: false,

    get focused() {
        return this.focusedWord === this.legend;
    },
    get placeholder ()  {
        if (this.isWord) return ''
        let tr = translateDict(this.legend, {p:this.phrases, w:this.words, t:[]} ).tr
        return (this.legend !== tr)? tr : ''
    }
})
