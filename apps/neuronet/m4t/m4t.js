let settings = {
    authToken:'8OmcicHiphZar50quinAvShic',
    protocol:'wss',
    url:'sdapi.odant.org',
    port:'8765',

    get ws_url() {return this.protocol + '://' + this.url + ':' + this.port + '/' + this.authToken},
    get url_path() {return (x)=>{return 'https://' + this.url + '/' + x.slice(5) }} // ! fixme
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
                <oda-button-v allow-toggle='true' toggle-group='tgg' @tap='currentVoice=$$for.item'></oda-button-v>
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
    <div slot='top' style='overflow-y:auto;'>
        <oda-m4t-test-rez ~for='results' :el='$for.item'></oda-m4t-test-rez>
    </div>

    `,
    ws:{
        $freeze: true,
        get(){
            let ws = new WebSocket(settings.ws_url);
            ws.onopen = () => {
                console.log('подключился к wss');
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
                this.ws = undefined;
                this.ws;
            }
            return ws
        }

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
    ready(){
        this.ws;
    },

    iconSize:32,
    get languageNames() {codeTabConst.map(x => x.language)},
    wait:false,
    textInput:{
        $def:'Привет мир, здравствуй солнце!',
        $save:true,
    },

    results:[],
    currentVoice:{},
    $public: {
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
    },

    codeLang(lang) { return codeTabConst.find(el => el.language===lang).code },

    async _go() {
        // this.results = []
        this.wait = true
        await new Promise(resolve=>{
            this.ws
            this.async(()=>{
                resolve();
            }, 100)
        })


        let mess2ws = {outText:[], outVoice:[], inputLang: this.codeLang(this.inputLang)}

        mess2ws[(this.outputType==='text')?'outText':'outVoice' ] = [ this.codeLang(this.outputLang) ]
        mess2ws.inputType = this.inputType


        if (this.inputType==='text') mess2ws.textInput = this.textInput
        if (this.inputType==='voice') {            
            if (this.currentVoice.path) {
                mess2ws.voicePath = this.currentVoice.path
                mess2ws.voiceExt = this.currentVoice.ext
            }
            else {
                console.log('No Voice select!')
                this.wait = false
                return
            }
        }
        console.log(mess2ws)
        this.ws.send(JSON.stringify(mess2ws));
    },

    get icon(){ return (this.wait)?'odant:spin':'av:play-arrow'},
    inputFiles:{
        $type: Object,
        async get() { 
            let response = await fetch('data/input/dir.json')
            return await response.json();
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
        <div class='text' ~if='el.tt==="text"'>{{el.text}}</div>
        <audio ~if='el.tt==="voice"' controls :src="fixPath">
            <a :href="fixPath"> Download audio </a>
        </audio>
    </div>
    `,
    el:{},
    get fixPath() {return settings.url_path(this.el.path)},
    get language() { return codeTabConst.find(el => el.code===this.el.lang).language  },
    get icon() {return (this.el.tt==='text')? 'iconoir:message-text': 'iconoir:mic'},
    get cls() { return (this.el.tt==='text')? 'success-invert': 'info-invert' } 
})

