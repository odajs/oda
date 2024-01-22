let settings = {
    authToken:'8OmcicHiphZar50quinAvShic',
    url:'sdapi.odant.org',
    port:'8765',
    inputType:['wav', 'mp3', 'ogg'],

    get ws_url() {return 'wss://' + this.url + ':' + this.port + '/' + this.authToken},
    get input_url() {return 'https://' + this.url + '/input/' },
    get url_path() {return (x)=>{return 'https://' + this.url + '/output/' + x }} 
}

const codeTabConst = [
    {code:'arb',        language:'Modern Standard Arabic',  script: 'Arab'},
    {code:'ben',        language:'Bengali',                 script: 'Beng'},
    {code:'cat',        language:'Catalan',                 script: 'Latn'},
    {code:'ces',        language:'Czech',                   script: 'Latn'},
    {code:'cmn',        language:'Mandarin Chinese',        script: 'Hans'},
    // {code:'cmn_Hant',   language:'Mandarin Chinese',        script: 'Hant'},
    {code:'cym',        language:'Welsh',                   script: 'Latn'},
    {code:'dan',        language:'Danish',                  script: 'Latn'},
    {code:'deu',        language:'German',                  script: 'Latn'},
    {code:'eng',        language:'English',                 script: 'Latn'},
    {code:'est',        language:'Estonian',                script: 'Latn'},
    {code:'fin',        language:'Finnish',                 script: 'Latn'},
    {code:'fra',        language:'French',                  script: 'Latn'},
    {code:'hin',        language:'Hindi',                   script: 'Deva'},
    {code:'ind',        language:'Indonesian',              script: 'Latn'},
    {code:'ita',        language:'Italian',                 script: 'Latn'},
    {code:'jpn',        language:'Japanese',                script: 'Jpan'},
    {code:'kor',        language:'Korean',                  script: 'Kore'},
    {code:'mlt',        language:'Maltese',                 script: 'Latn'},
    {code:'nld',        language:'Dutch',                   script: 'Latn'},
    {code:'pes',        language:'Western Persian',         script: 'Arab'},
    {code:'pol',        language:'Polish',                  script: 'Latn'},
    {code:'por',        language:'Portuguese',              script: 'Latn'},
    {code:'ron',        language:'Romanian',                script: 'Latn'},
    {code:'rus',        language:'Russian',                 script: 'Cyrl'},
    {code:'slk',        language:'Slovak',                  script: 'Latn'},
    {code:'spa',        language:'Spanish',                 script: 'Latn'},
    {code:'swe',        language:'Swedish',                 script: 'Latn'},
    {code:'swh',        language:'Swahili',                 script: 'Latn'},
    {code:'tel',        language:'Telugu',                  script: 'Telu'},
    {code:'tgl',        language:'Tagalog',                 script: 'Latn'},
    {code:'tha',        language:'Thai',                    script: 'Thai'},
    {code:'tur',        language:'Turkish',                 script: 'Latn'},
    {code:'ukr',        language:'Ukrainian',               script: 'Cyrl'},
    {code:'urd',        language:'Urdu',                    script: 'Arab'},
    {code:'uzn',        language:'Northern Uzbek',          script: 'Latn'},
    {code:'vie',        language:'Vietnamese',              script: 'Latn'} 
]       


ODA({ is: 'oda-m4t-test',  template: /*HTML*/ `
    <div class='header' slot="top_" style='text-align:center' ><h3>ODANT M4T</h3></div>
    <div vertical icon="iconoir:message-text" title="TextInput"  label="TextInput" slot="left-panel" style='padding:10px;' bar-opened>
        <textarea class="flex" style='margin:5px 0; width:100%' rows="10" placeholder='input text' ::value='textInput' ></textarea>
    </div>
    <div  icon="iconoir:mic" title="VoiceInput"  label="VoiceInput" slot="left-panel" style='overflow-y:auto;' >
        <fieldset ~for='Object.keys(inputFiles)' style='padding:6px 5px 2px 2px'>
            <legend>{{$for.item}}</legend>
            <div class='flex' horizontal ~for='inputFiles[$for.item]'>
                <oda-button-v @tap='currentVoice=$$for.item' :toggled='currentVoice.path===$$for.item.path'></oda-button-v>
                <audio style='width:245px; height:30px; margin-left:5px' controls :src="$$for.item.path"></audio>
            </div>
        </fieldset> 
    </div>
    <div ~if='false' icon="iconoir:orthogonal-view" title="OutPutTab"  label="OutPutTab" slot="right-panel"  bar-opened style='overflow-y:auto;'>
        <div vertical>
            <div flex horizontal><div flex><b>language</b></div><div style='margin:0 5px'><b>text</b></div><div><b>voice</b></div></div>
            <oda-tr-opt ~for='Object.keys(codeTab)' :language='codeTab[$for.item].language' ::t='codeTab[$for.item].t' ::v='codeTab[$for.item].v'></oda-tr-opt>
        </div>
    </div>
    <oda-button :icon :icon-size="iconSize*1.3" style="font-size:large;" success-invert :disabled="wait" label='GO!' @tap='_go()' slot='footer'></oda-button>
    <div class="flex" style='overflow-y:auto;'>
        <oda-m4t-test-rez ~for='results' :el='$for.item'></oda-m4t-test-rez>
    </div>

    `,
    // ws:{
    //     $freeze: true,
    get ws() {
        return new Promise(resolve=>{

            let ws = new WebSocket(settings.ws_url);
            ws.onopen = () => {
                console.log('подключился к wss');
                resolve (ws)
            };
            // обработчик сообщений от сервера
            ws.onmessage = (message) => {
                let mess = {}
                try {
                    mess = JSON.parse(message.data)
                } catch (e) {
                    mess.err = message.data
                }
                console.log(mess)

                if (mess.type === 'rez') {
                    console.log(mess)
                    this.results.push(mess)
                }
                if (mess.result === "done") {
                    this.wait = false
                }

            };
            ws.onerror = (err) => {
                console.log(err)
            }
            ws.onclose = (e) => {
                console.log(e)
                // this.ws = undefined;
                // this.ws;
            }

        })
    },

    // ws:{},
    // attached() {
    //     this.ws = new WebSocket(settings.ws_url);
    //     this.ws.onopen = () => { 
    //         console.log('подключился к wss');
    //     };
    //     // обработчик сообщений от сервера
    //     this.ws.onmessage = (message) => {
    //         let mess = {}
    //         try { mess = JSON.parse(message.data) } catch (e) { mess.err=message.data}
    //         console.log(mess)

    //         if (mess.type === 'rez') { 
    //             this.results.push(mess)
    //         }
    //         if (mess.result === "done") {
    //             this.wait = false
    //         } 

    //     };
    //     this.ws.onerror = (err) => {
    //         console.log(err)
    //     }


    //  },
    // ready(){
    //     this.ws;
    // },

    iconSize:32,
    get languageNames() {codeTabConst.map(x => x.language)},
    wait:false,
    textInput:{
        $def:'Привет мир, здравствуй солнце!',
        $save:true,
    },

    results:[],
    
    $public: {
        currentVoice:{
            $type:Object,
            $save:true,
        },
        inputLang: {
            $def:'Russian',
            $type:String,
            $save:true,
            get $list() { return codeTabConst.map(x => x.language) }
        },
        inputType: {
            $def:'text',
            $save:true,
            $list: ['text','voice']
        },
        outputLang: {
            $def:'English',
            $save:true,
            get $list() { return codeTabConst.map(x => x.language) }
        },
        outputType: {
            $def:'text',
            $save:true,
            $list: ['text','voice']
        },
        mess2ws: {
            $readOnly: true,
            get() {
                let rez = {
                    inType:this.inputType, 
                    outType:this.outputType, 
                    inLang:this.codeLang(this.inputLang), 
                    outLang:this.codeLang(this.outputLang)
                }
                if (this.inputType==='text') rez.text = this.textInput
                if (this.inputType==='voice') {
                    rez.ext = this.currentVoice.ext
                    rez.file = this.currentVoice.name
                }
                return JSON.stringify(rez)
            }
        }
    },

    codeLang(lang) { return codeTabConst.find(el => el.language===lang).code },

    async _go() {
        // this.results = []
        // this.wait = true
        // await new Promise(resolve=>{
        //     this.ws
        //     this.async(()=>{
        //         resolve();
        //     }, 100)
        // })

        let ws = await this.ws;


        // let mess2ws = {outText:[], outVoice:[], inputLang: this.codeLang(this.inputLang)}

        // mess2ws[(this.outputType==='text')?'outText':'outVoice' ] = [ this.codeLang(this.outputLang) ]
        // mess2ws.inputType = this.inputType


        // if (this.inputType==='text') mess2ws.textInput = this.textInput
        // if (this.inputType==='voice') {            
        //     if (this.currentVoice.path) {
        //         mess2ws.voicePath = this.currentVoice.path
        //         mess2ws.voiceExt = this.currentVoice.ext
        //     }
        //     else {
        //         console.log('No Voice select!')
        //         this.wait = false
        //         return
        //     }
        // }
        console.log(this.mess2ws)
        ws.send(this.mess2ws);
    },

    // async _go() {
    //     let headers = new Headers
    //     headers.set('Content-Type', 'application/json');
    //     headers.set('Authorization', `Basic ${btoa('m4t:8OmcicHiphZar50quinAvShic')}`);


    //     fetch('https://sdapi.odant.org/upload/readme4.txt', {
    //         method: 'POST',
    //         mode: 'no-cors',
    //         credentials: "include",
    //         body: JSON.stringify({
    //             id: 1,
    //             product: 'apple',
    //             category: 'fruit',
    //         }),
    //         headers
    //         //: {
    //         //     'Accept': 'application/json',
    //         //     'Content-Type': 'application/json',
    //         //     'Authorization': `Basic ${btoa('m4t:8OmcicHiphZar50quinAvShic')}`,
    //         // },
    //     })
    //         .then((res) => res.json())
    //         .then((data) => console.log(data))
    //         .catch((err) => console.error(err));

    // },

    get icon(){ return (this.wait)?'odant:spin':'av:play-arrow'},
    inputFiles:{
        $type: Object,
        async get() {
            // let url = settings.input_url

            let dir = await fetch(settings.input_url)
            dir = (await dir.text()).match(/(?<=href=")(.*?\....)(?=")/g)
            let rez = []
            dir.forEach(el => {
                let ext = el.slice(-3)
                if (settings.inputType.includes(ext)) {
                    rez[ext] ??= []
                    rez[ext].push( {path:settings.input_url + el, name:el, ext} )   
                }             
            });
            // console.log(rez)
            return rez
        }
    },

})

ODA({ is: 'oda-button-v', extends: 'oda-button', template: /*HTML*/ `
<style>
    :host {border-radius:50%;}
    :host([toggled]) {filter: none; background-color:transparent !important; outline:none;}
</style>  
`,
get icon() {  return (this.toggled)?"bootstrap:check-circle":"bootstrap:circle" }
})

ODA({ is: 'oda-m4t-test-rez', template: /*HTML*/ `
    <style>
        .border {margin:10px;}
        oda-button {opacity:1 !important}
        .text {padding:10px; white-space: normal;}
        audio {width: 100%; height:30px; padding: 5px 0;}
    </style>
    <div class='border'>
        <oda-button ~class='cls' :label='language' :icon disabled></oda-button>
        <div class='text' ~if='el.outType==="text"'>{{el.text}}</div>
        <audio ~if='el.outType==="voice"' controls :src="fixPath">
            <a :href="fixPath"> Download audio </a>
        </audio>
    </div>
    `,
    el:{},
    get fixPath() {return settings.url_path(this.el.file)},
    get language() { return codeTabConst.find(el => el.code===this.el.outLang).language  },
    get icon() {return (this.el.outType==='text')? 'iconoir:message-text': 'iconoir:mic'},
    get cls() { return (this.el.outType==='text')? 'success-invert': 'info-invert' } 
})

