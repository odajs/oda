/* Регистрация Инструмента */
const Localization = ODA.regTool('localization');
Localization.currentLocal = ODA.language  // под вопросом

Localization.path = import.meta.url.split('/').slice(0, -1).join('/'); // locales path
Localization.inPage = { phrase: {}, words: {} }
Localization.dictionary = { phrase: {}, words: {} }
Localization.translateTagList = ['label', 'h3']

// отдельно храним "переревод фраз" -- p, "перевод слов" -- w, "исходные фразы" -- ip 
// ip -- это то, что раньше было inPage.phrase, inPage.words не храним, вычисляем налету.
Localization.StorPrefix = {p:'#phrase#', w:'#words#', ip:'#ip#'}

Localization.StorGet = (x) => { 
    const entries = Object.entries(sessionStorage)
        .filter(([k,v]) => k.slice(0,Localization.StorPrefix[x].length)===Localization.StorPrefix[x] )
        .map(([k,v]) => [k.slice(ODA.localization.StorPrefix[x].length),v]  )
    return Object.fromEntries(entries)

}
Localization.StorClear = () => { Object.keys(Localization.StorPrefix).forEach (x =>
        Object.keys(Localization.StorGet(x))
            .forEach(k => sessionStorage.removeItem(Localization.StorPrefix[x] +k))    )
} 

Localization.setLocale = async (rfc_locale) => {
    // Localization.available = false
    if (rfc_locale===sessionStorage.getItem('curLocal')) return
    sessionStorage.setItem('curLocal', rfc_locale)

    Localization.StorClear()
    let phrases; // Для чего тут try, если он все равно никак не спасает от вала ошибок при попытке загрузить несуществующий файл?
    try { phrases = await ODA.loadJSON(Localization.path + '/dictionary/phrases.json'); }
    catch (e) { console.log(e);  phrases = [];}
    phrases.forEach(i => sessionStorage.setItem(Localization.StorPrefix.ip + i, sessionStorage.getItem(i)) )

    let dictionary = { phrase: {}, words: {} }
    const paths = rfc_locale.split('-').map((_, i, ar) => ar.slice(0, i + 1).join('-') + '.json')
    const localesAvailable = await ODA.loadJSON(Localization.path + '/dictionary/_.dir')
    const availablePaths = paths.filter(p => localesAvailable.includes(p))
    const dictList = await Promise.all(availablePaths.map((p) => ODA.loadJSON(Localization.path +'/dictionary/'+  p)))
    Object.assign(dictionary.phrase, ...dictList.map(d => d.phrase))
    Object.assign(dictionary.words, ...dictList.map(d => d.words))
    // console.log(Object.entries(dictionary.words))
    Object.entries(dictionary.phrase).forEach(([k,v]) => sessionStorage.setItem((Localization.StorPrefix.p + k), v))
    Object.entries(dictionary.words).forEach(([k,v]) => sessionStorage.setItem(Localization.StorPrefix.w + k, v))
    // sessionStorage.setItem('#wew#test', 'вавав')

    // if (dictList.length > 0) Localization.available = true
    // else console.log('Localization: ', 'No available dictionary')
}
window.top.addEventListener('change-language', e => {
    window.location.reload();
    // Localization.setLocale(e.detail.value)
})

Localization.setLocale(ODA.language);



/* Ф-я перевода */
Localization.translate = function (text = '') {
    // console.log(text)
    // if (ODA.language === 'en')
    //     return text // Английский язык мы не переводим совсем.
    // const testLeter = new RegExp('[a-z].*?', 'gi')

    const phrase = text.split(/\r?\n/).map(a => a.trim()) //.filter(a => testLeter.test(a))
    // const words = text.split(/\s+/).map(a => a.trim()) //.filter(a => testLeter.test(a))

    phrase.forEach(p => sessionStorage.setItem(Localization.StorPrefix.ip + p, '') ) 

    // phrase.forEach(v => ODA.localization.inPage.phrase[v] = '')
    // words.forEach(v => ODA.localization.inPage.words[v] = '')

    // if (text == 'Search') console.log(text,words, ODA.localization.inPage.words)

    const phraseK = Object.keys(Localization.StorGet('p')) // TODO: Нужно бы закэшипровать вычисление здесь не желательно
    const wordsK = Object.keys(Localization.StorGet('w')) // TODO: Нужно бы закэшипровать вычисление здесь не желательно

    // console.log(wordsK)

    let newVal = text

    if (phraseK.length > 0) { //ODA.localization.dictionary.phrase[md]
        const rephrase = new RegExp('\\b' + phraseK.join('\\b|\\b') + '\\b', "g")
        newVal = newVal.replaceAll(rephrase, md => sessionStorage.getItem(Localization.StorPrefix.p + md) )
    }
    if (wordsK.length > 0) {
        const reWords = new RegExp('\\b' + wordsK.join('\\b|\\b') + '\\b', "g")
        newVal = newVal.replaceAll(reWords, md => sessionStorage.getItem(Localization.StorPrefix.w + md) )
    }

    // console.log(text,newVal)

    return newVal || ''
}




function condNoTranslate(el) {
    const node = el.parentElement ? el.parentElement.$node : el.$node;
    return (!Localization.translateTagList.includes(node?.tag)
        || node.bind?.notranslate || node.attrs?.notranslate != undefined)
}
function _newVal(val) {
    if (/*!this.isConnected || */!val)
        return val;
    // if (this?.$node?.id ===65){
    //     console.log(this, val)
    // }
    switch (this.__translate) {
        case false:
            return val;
        case undefined:
            break;
        default: {
            return this.__translate;
        } break;
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
    this.__translate = Localization.translate( val ) /*+ ': '+ ODA.language*/; //todo перевод
    // console.log(this, this.__translate)
    return this.__translate;
    // // if (val=='Watchers') console.log(val)
    // const flagTranslate = (this.__ft != undefined) ? this.__ft // определяем нужен ли вообще перевод причем 1 раз
    //                     : (!(this.nodeType === 3 || this.nodeType === 1)) ? false
    //                     : ((/\{\{((?:.|\n)+?)\}\}/g.test(val))) ? false
    //                     : (condNoTranslate(this)) ? false : true
    // this.__ft = flagTranslate
    // // if (val === 'OK') console.log(this, condNoTranslate(this))
    // if (!flagTranslate) return val
    // else if (!ODA.localization.available) {this.__t = undefined; return val} // Если словарь не готов, то сбрасываем перевод
    // else if (this.__t != undefined && this.__t != '') return this.__t // Если перевод уже сделан возвращаем его
    // else {this.__t = Localization.translate(val); return this.__t }
}
/* Переопределение Геттера и Сеттера */
const textContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent') //Node.textContent
const textSet = textContent.set;
const textGet = textContent.get;

textContent.set = function (val) {
    if (this.__translate && this.__translate.src !== val)
        this.__translate = undefined;
    const newVal = _newVal.call(this, val)
    textSet.call(this, val)  // переводим, перевод сохраняем
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
    if (e.code === 'KeyL' && e.altKey) {
        try {
            await ODA.import('@tools/containers');
            const result = await ODA.showDialog('oda-localization-tree', {}, { icon: 'icons:flag', title: 'Dictionaries', autosize: false, buttons: [{ label: 'Download', icon: 'icons:file-download' }] })
            result.setNewDict()
            if (result.focusedButton.label === 'Download')
                result.dlDict();
        }
        catch (e) {
            console.error(e);
        }
    }
})


/*  */
ODA({
    is: 'oda-localization-tree', imports: '@oda/table', extends: 'oda-table',
    props: {
        evenOdd: true,
        showHeader: true,
        allowSort: true,
        lazy: true,
        showFilter: true,
        autoSize: true,
        autoWidth: true, //sort: [[letter]],
        dataSet() {
            const words  = Object.entries( ODA.localization.StorGet('w') )
            const phrase = Object.entries( subObAB(ODA.localization.StorGet('p'), words) )

            //console.log(words,phrase)


            // const words = ODA.localization.StorGetW().map(([k,v]) => [k.slice(ODA.localization.StorPrefix.w.length),v]  ) 
            // const phrase = ODA.localization.StorGetP().map(([k,v]) => [k.slice(ODA.localization.StorPrefix.p.length),v]  ) 
            // console.log(words, phrase  )
            let ds = {}

            words.forEach(([k,v]) => ds[k] = {words: k, translates:v, letter: k[0].toLocaleLowerCase(), items: [] } )
            phrase.forEach(([k,v]) => { 
                const localWords = k.split(/\s+/).map(a => a.trim())
                localWords.forEach(w => {
                    if (ds[w] == undefined) ds[w] = { words: w, translates: '', letter: w[0].toLocaleLowerCase(),
                                                      items: [{ words: k, translates: v }] }
                    else ds[w].items.push( { words: k, translates: v })
                })
            })


            // Object.keys(words).forEach(k => ds[k] = {
            //     words: k, translates: ODA.localization.dictionary.words[k]/* (new TRANSLATE(k, 'words'))*/, letter: k[0].toLocaleLowerCase(), items: []
            // })
            // Object.keys(phrase).map(k => {
            //     const testLeter = new RegExp('[a-z].*?', 'gi')
            //     k.split(/\s+/).map(a => a.trim()).filter(a => testLeter.test(a)).forEach(w => {
            //         if (ds[w] == undefined) ds[w] = {
            //             words: w, translates: ODA.localization.dictionary.words[k] /*new TRANSLATE(w, 'words')*/, letter: w[0].toLocaleLowerCase(),
            //             items: [{ words: k, translates: ODA.localization.dictionary.phrase[k]  /*new TRANSLATE(k, 'phrase')*/ }]
            //         }
            //         else { ds[w].items.push({ words: k, translates: ODA.localization.dictionary.phrase[k]/*new TRANSLATE(k, 'phrase')*/ }) }
            //     })
            // })
            this.groups = [this.columns.find(c => c.name === 'letter')];
            return Object.values(ds).map(o => {
                if ( (o.items.length === 1) && (o.words ===  o.items[0].words) ) o.items = []
                return o
            })
        },

    },
    columns: [{ name: 'words', treeMode: true, $sort: 1, fix: 'left' },
    { name: 'translates', template: 'input' },
    { name: 'letter', hidden: true, $sortGroups: 1, $expanded: true, $hideExppander: true }],
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

// CLASS({
//     is: 'TRANSLATE',
//     ctor(key, type) {
//         this.key = key
//         this.type = type
//     },
//     get t() {
//         let rez = ODA.localization.dictionary[this.type][this.key]
//         if (typeof rez === 'string') return rez
//         else return ''
//     },
//     set t(val) { ODA.localization.dictionary[this.type][this.key] = val }
// })
