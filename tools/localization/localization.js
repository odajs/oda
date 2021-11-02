import ODA from '../../oda.js';
import '../containers/containers.js'
const Localization = ODA.regTool('localization');
Localization.path = import.meta.url.split('/').slice(0,-1).join('/');
Localization.phraze = {}
Localization.words= {}

Localization.currentLocal = /* odaUserLocal || */ window.navigator.userLanguage || window.navigator.language || window.navigator.systemLanguage
Localization.pathDictionary = Localization.path + '/ODA_dictionary.' + Localization.currentLocal + '.json'
ODA.loadJSON(Localization.pathDictionary).then( res => { Localization.dictionary = res })
    .catch( error => { console.log("Errol load dictionary: " + error)  })


//Localization.dictionary = { words: {'_':'_'}, phraze: {'_':'_'} }
// import dictionary from  './tst.js'
// //console.log(dictionary)
// Localization.dictionary = dictionary

window.addEventListener('keydown', async e => {
    if (e.code === 'KeyL' && e.altKey){
        //console.log('dialog')
        var table = await ODA.createComponent("oda-localization-table");
        //console.log(table)
        //const lDialog = await 
        ODA.showDialog( table, {}, {icon: 'icons:flag', title: 'Dictionarys',  
                                    buttons: [{ label: 'Dowload', icon: 'icons:file-download' }] } )
            .then( ok => {
                ok.setNewDict() 
                if (ok.focusedButton.label == 'Dowload') {ok.dlDict()}
                
                //console.log(ok.focusedButton)
            })
            .catch(err => {});
        //console.log(lDialog.focusedButton)
        
    }
})

ODA({ is: 'oda-localization-table', imports: '@oda/table, @oda/button, @oda/basic-input, @oda/toggle',
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
                <oda-icon id='flag' :icon="'flags:'+ currentLocal.substr(0, 2).toLowerCase()"  :title="currentLocal" ></oda-icon>
                <oda-basic-input :patern='"[A-Za-z]{2}-[A-Za-z]{2}"' ::value=currentLocal :read-only='true'><oda-basic-input></div>
            
        </div>
        <oda-localization-grid ::content="phrazeBase" ~if="tDict" :header-names="['phraze','translate']" ></oda-localization-grid>
        <oda-localization-grid ::content="phrazeDop" ~if="tDict && eyeAll"></oda-localization-grid>
        <oda-localization-grid ::content="wordsBase" ~if="!tDict" :header-names="['words','translate']" ></oda-localization-grid>
        <oda-localization-grid ::content="wordsDop" ~if="!tDict && eyeAll"></oda-localization-grid>

    `,
    observers: ['_dataset( currentLocal )'],
    props: { 
        eyeAll:false, tDict:true, 
        currentLocal : 'ru-Ru', // { get() {return ODA.localization.currentLocal} },
        phrazeBase:[], phrazeDop:[], wordsBase:[], wordsDop:[],
        
    },
    currentDict ()  {
            let toObj = (arr, rez={}) => { for (let n of arr) { rez[n.key]=n.val }; return rez }
            let extractObj = namE => toObj ( this[namE].filter(el => el.val != ''))
            return { words: sumObAB ( extractObj ('wordsBase') , extractObj ('wordsDop')),
                        phraze: sumObAB ( extractObj ('phrazeBase') , extractObj ('phrazeDop'))  }
        },
    setNewDict () { Localization.dictionary = this.currentDict() },
    dlDict () {
        const downLoad = document.createElement('a');
        downLoad.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(this.currentDict(), null, '\t') );
        downLoad.setAttribute('download', 'ODA_dictionary.' + this.currentLocal + '.json');
        downLoad.click();
    },
    _nameDict(b) { return b ? 'phraze': 'words' },
    _dataset( local ) {
        const sPW = Localization.phraze, dP = Localization.dictionary.phraze,
                sW = Localization.words, dW = Localization.dictionary.words, sP = subObAB(sPW,sW);
                
        let toData = (ob, rez=[]) => { for (let k in ob) { rez.push( {'key':k, 'val':ob[k]} ) }; return rez }

        this.wordsDop = toData ( subObAB(dW,sW) )
        this.wordsBase = toData ( sumObAB( supObAB(dW,sW), sW) )

        this.phrazeDop = toData ( subObAB(dP,sP) )
        this.phrazeBase = toData ( sumObAB( supObAB(dP,sP), sP) )

        //const sss = ODA.localization.path  + '/ODA_dictionary.' + 'ru-RU' + '.json'
        //console.log(sss)
        
        //const wordsDop = subObAB(dW,sW), phrazeDop = subObAB(dP,sP), words = supObAB(sW,dW), phraze = supObAB(sP,dP)

        // console.log(dW)
        // console.log(sW)
        
        // console.log(toData( subObAB(dW,sW) ))
        // console.log( sumObAB( supObAB(dW,sW), sW) )

        
        //this.headerNames = [this._nameDict(tDict),'translate']
        //console.log(tDict)
        // this.columns = [{label:this._nameDict(tDict), name:'key', template: 'oda-localization-cel',fix:'left'}
        //                 , {label:'translate', name:'val', template: 'oda-localization-cel'}]
        // let dict = ODA.localization.dictionary[this._nameDict(tDict)], 
        //     curr = tDict ? subObAB(ODA.localization.phraze, ODA.localization.words) : ODA.localization.words,
        //     dataOb = eyeAll ? sumObAB(dict,curr) : sumObAB( supObAB(dict,curr),curr)

        //console.log( data )
        // var dataArr = []
        // for (let k in dataOb) { dataArr.push( {'key':k, 'val':dataOb[k]} ) }
        // //console.log( dataArr )
        // this.content = dataArr
    },

})

ODA({ is: 'oda-localization-cel', extends: 'oda-table-cell-base',
    template: /*html*/ `<oda-basic-input ::value :read-only ></oda-basic-input>`,
    props: {
        value() { return this.item?.[this.column?.name] },
        readOnly() { return (this.column?.name == 'key')}
    }
})

ODA({ is: 'oda-localization-grid', imports: '@oda/basic-input', template: /*html*/ `
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
    props:{
        content: [],
        headerNames: [],
        
    },

})

function sumObAB (a,b) { return {...b, ...a} }
function subObAB (a,b) { let rez = {...a}
    for (let key in b) { if (key in a) delete rez[key] }
    return rez }
function supObAB (a,b) { let rez = {}
    for (let key in a) { if (key in b) rez[key]=a[key] }
    return rez }