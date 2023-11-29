let allPorts = [];
if (self?.onconnect === null) { self.onconnect = onconnect; }
function onconnect(e) {
    const port = e.ports[0];
    allPorts.push(port);
    // url = port.url;
    port.onmessage = onmessage.bind(port);
};
async function onmessage(e) {
    switch (e.data?.type) {
        case 'init': { 
            allPorts.push(this)
            structureTree ??= compressLoad(urls.map(p => p + 'structure.json'))
            phrases ??= compressLoad( urls.map(p => p+'phrases.json') )
            dictionaries[e.data.lang] ??= loadLang(e.data.lang)
        } break;
        case 'translate': {
            dictionaries[e.data.lang] ??= loadLang(e.data.lang)
     
            structureTree = await structureTree
            phrases = await phrases
            dictionaries[e.data.lang] = await dictionaries[e.data.lang] // loadLang(e.data.lang)

            let rez = translate(e.data.key, dictionaries[e.data.lang]);

            structureTree = compress(structureTree, rez.structureTree)
            phrases = compress(phrases, rez.new)

            this.postMessage({ translate: rez.tr, key: e.data.key, type: 'translate', lang: e.data.lang, cast:rez.cast });
        } break;
        case 'dictionary': {
            this.postMessage({ 
                type: 'dictionary', 
                dictionary: dictionaries[e.data.lang], 
                phrases: phrases, 
                structure: structureTree, 
                lang: e.data.lang,
                // funTr:fn2throw(translate)
             });
        } break;
        case 'update': {
            // dictionaries[e.data.lang] = e.data.dictionary

            cacheFile={}
            // dictionaries[e.data.lang] = undefined
            dictionaries[e.data.lang] = await loadLang(e.data.lang)
            allPorts.forEach(p => p.postMessage({ type: 'update', lang: e.data.lang }))
        } break;
        case 'update_paths': {
            e.data.paths.forEach(p => urls.push(p))
            dictionaries = {}
            // phrases = undefined
            allPorts.forEach(p => p.postMessage({ type: 'update', lang: e.data.lang }))
        } break;
        // case 'edit_translate': {
        //     let data  = {w:{}, p:{}}
        //     // console.log(e.data)
        //     let d = await dictionaries[e.data.lang] || {p:{},w:{}}
        //     if (e.data.class === 'p') {
        //         d.p[e.data.key] = e.data.val
        //         data.p[e.data.key] = e.data.val
        //     }
        //     if (e.data.class === 'w') {
        //         d.w[e.data.key] = e.data.val
        //         data.w[e.data.key] = e.data.val
        //         Object.keys( structureTree?.[e.data.key] || {} ).forEach(t => {
        //             data.p[t]=translate(t, e.data.lang)
        //         })
        //     }
        //     if (e.data.class === 'r') {
        //         console.log('Error: no way to update RegExp') //! no way to update RegExp
        //     }
        //     console.log(data)
        //     // this.postMessage({ type: 'edit_translate', w, p,  lang: e.data.lang})
        //     allPorts.forEach(p => p.postMessage({ type: 'edit_translate', data, lang: e.data.lang}))
        // } break;
    }
}

async function loadLang (lang) {
    let fileNames = lang.split('-').map((_, i, arr) => arr.slice(0, i + 1).join('-') + '.json')
    let dictionaryFiles = urls.map(u => fileNames.map(fn => u + fn)).flat()
    let preDictionaries = compressLoad(dictionaryFiles)
    //preDictionaries.r = preDictionaries.r.map( ([a,b]) => [new RegExp(a),b]) //TODO : нужно отсортировать
    return preDictionaries
}

let urls = ['dictionary/'];
let dictionaries = {};
let phrases;
let structureTree = {}

let cacheFile = {}
function customLoad(x) {
    cacheFile[x] ??= new Promise(resolve => {
        let resolveSave = rez => {
            cacheFile[x] = rez
            resolve(rez)
        }
        fetch(x,{cache: "no-cache"}).then(f=> f.json().then(o => resolveSave(o)).catch(err => resolveSave({}) ) ).catch(err => resolveSave({}) )
    })
    return cacheFile[x]
}
async function compressLoad(arrPath) {
    let load = arrPath.map(async (file) => customLoad (file) )
    return (await Promise.all(load)).reduce(compress, {})
}
function compress(akk, cur) {
    if ((typeof akk === 'object') && (typeof cur === 'object')) {
        for (let k in cur) akk[k] = compress(akk[k], cur[k])
        return akk
    }
    else return cur
}

function toRegExp ([inS, toS]) {
    return [new RegExp ('^' + inS.replace(/{([a-z]*)}/g,'(?<$1>.*)') + '$'), toS.replace(/{([a-z]*)}/g,'$<$1>') ]
}

export function translate(text, dict) {
    text = text.trim()

    // каст RegExp
    let regRez;
    for (let r of (dict.r || []) ) {
        regRez = text.replace(new RegExp(r[0]), r[1]) 
        if (text!==regRez) return {tr:regRez, cast:'RegExp', regExp:r[0]}
    }

    // каст Phrases
    if ( !unDefined(dict.p?.[text])) return {tr:dict.p[text], cast:'Phrases'}

    // каст Auto (replacer нужен для игнорирования при переводе тегов)
    let metaInf = {cast:'Auto', ish:text, structureTree:{}, new:{w:{},p:{}} }
    let replacer = (_, p1, p2) => ((p1.trim() === '') ? p1 : translatePhrase(p1)) + p2
    return {tr:text.replace(/([^<]*?)(<[^>]*>|$)/g, replacer), ...metaInf}

    // перевод фразы
    function translatePhrase(text) {
        let [result, word, test] = ['', '', 'xxx']
        for (let i = 0; i < text.length; i++) {
            test += (text[i].toLowerCase() == text[i]) ? 'm' : 'B'
            test = test.slice(1)
            if ('abcdefghijklmnopqrstuvwxyz'.includes(text[i].toLowerCase())) {
                if (test == 'BBm' || test.slice(1) == 'mB') { result += translateWord(word); word = '' + text[i] }
                else word += text[i]
            }
            else { result += translateWord(word) + text[i]; word = '' }
        }
        if (word != '') result += translateWord(word);
        return result;
    }

    // перевод слова
    function translateWord(word) {
        if (word == '') return ''

        let key = word.toLowerCase().trim();
        metaInf.structureTree[key] ??= {}

        if (key!==metaInf.ish.toLowerCase().trim()) {
            metaInf.structureTree[key][metaInf.ish] = ''
            metaInf.new.p[metaInf.ish] = ''
        }     

        metaInf.new.w[key]=''

        // let test = dict.w?.[key] === undefined | dict.w?.[key] === '' 

        let value = ( unDefined(dict.w?.[key]) ) ? word : dict.w[key]
        return (word.toLowerCase() == word) ? value.toLowerCase()
            : (word.toUpperCase() == word) ? value.toUpperCase()
            : value.slice(0, 1).toUpperCase() + value.slice(1).toLowerCase()
    }

    function unDefined (val) {return (val === undefined || val === '')}
}

function fn2throw (fn) {
    let str = fn.toString()
    let [begin, end] = ['(',')'].map(ch => str.indexOf(ch))
    return [ ...str.slice(begin+1, end).split(','), str.slice(end+1) ]
}

// function tester () {
//     console.log(cacheFile)
// }

// console.log(self)

self.tester = () => {
    console.log(urls)
}