let settings = {
    authToken:'8OmcicHiphZar50quinAvShic',
    protocol:'wss',
    url:'sdapi.odant.org',
    port:'8765',

    get ws_url() {return this.protocol + '://' + this.url + ':' + this.port + '/' + this.authToken},
    get url_path() {return (x)=>{return 'https://' + this.url + '/' + x.slice(5) }} // ! fixme
}


ODA({ is: 'oda-m4t-test', imports:'@oda/app-layout', extends: 'oda-app-layout', template: /*HTML*/ `
    <div class='header' slot="header" style='text-align:center' ><h3>ODANT M4T</h3></div>
    <div vertical icon="iconoir:message-text" title="TextInput"  label="TextInput" slot="left-panel" style='padding:10px;' bar-opened>
        Language
        <select style='margin:5px 0; width:100%' @change='console.log($event.target.options)'> 
            <option ~for='Object.keys(codeTab)' :selected='codeTab[$for.item].code===inputLang' @change='_go()' >
                {{codeTab[$for.item].language}}</option>
        </select> 
        <textarea style='margin:5px 0; width:100%' rows="10" placeholder='input text' ::value='textInput' ></textarea>
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
    <div  icon="iconoir:orthogonal-view" title="OutPutTab"  label="OutPutTab" slot="right-panel"  bar-opened style='overflow-y:auto;'><table><tbody>
        <tr><th>language</th><th>text</th><th>voice</th></tr>
        <tr ~for='Object.keys(codeTab)'>
            <td>{{codeTab[$for.item].language}}</td>
            <td><input type="checkbox" ::checked='codeTab[$for.item].t'/></td>
            <td><input type="checkbox" ::checked='codeTab[$for.item].v'/></td>
        </tr>
    </tbody></table></div>
    <oda-button :icon :icon-size="iconSize*1.3" style="font-size:large;" success-invert :disabled="wait" label='GO!' @tap='_go()' slot='footer'></oda-button>
    <div slot='main' style='overflow-y:auto;'>
        <oda-m4t-test-rez ~for='results' :el='$for.item'></oda-m4t-test-rez>
    </div>

    `,
    attached() { // value="codeTab[$for.item].code"
        // console.log(codeTab); 
        this.codeTab = codeTabConst.reduce( (akk,cur)=>{
            cur.t = false
            cur.v =false
            akk[cur.code] = cur
            return akk
        }, {} )
        this.codeTab.rus.v  = true
        // this.codeTab.rus.t  = true
        // this.codeTab.eng.t  = true
        this.codeTab.cmn.t  = true

        this.ws = new WebSocket(settings.ws_url);
        this.ws.onopen = () => { 
            console.log('подключился к wss'); 

        };
        // обработчик сообщений от сервера
        this.ws.onmessage = (message) => {
            let mess = {}
            try { mess = JSON.parse(message.data) } catch (e) { mess.err=message.data}
            console.log(mess)

            if (mess.type === 'rez') { 
                this.results.push(mess)
            }
            if (mess.result === "done") {
                this.wait = false
            } 

        };
        this.ws.onerror = (err) => {
            console.log(err)
        }

    },

    $pdp:{   
        wait:false,
        ws:{},
        codeTab:{},
        textInput:'Привет мир, здравствуй солнце!',
        inputLang:'rus',
        results:[],
        // results: [
        //     {type: 'rez', tt: 'text', lang: 'cmn', text: '请等候运营商的回答为改善服务质量您的谈话将被录取请收请收请收请收请收请收请收请收请收请收请收请收请收…收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收请收'},
        //     {type: "rez", tt: "text", lang: "rus", text: "Пожалуйста, ждите ответа оператора в целях улучшения качества обслуживания ваше разговор будет записан примите, пожалуйста, 22 сухого тимакова и квартира какая, пожалуйста, 141 не работает сухого тимакова"},
        //     {type: 'rez', tt: 'voice', lang: 'rus', path: 'data/output/rus.wav'}
        // ],
        // results:[{'type': 'rez', 'tt': 'text', 'lang': 'cmn', 'text': '好吧世界,招呼太阳!'},
        //         {'type': 'rez', 'tt': 'text', 'lang': 'eng', 'text': 'Hello, peace, greetings to the sun!'},
        //         {'type': 'rez', 'tt': 'text', 'lang': 'rus', 'text': 'Привет мир, здравствуй солнце!'},
        //         {type: 'rez', tt: 'voice', lang: 'cmn', path: 'data/output/cmn.wav'},
        //         {type: 'rez', tt: 'voice', lang: 'rus', path: 'data/output/rus.wav'}
            // ]
        
    },
    _go() {
        this.results = []
        let mess2ws = {outText:[], outVoice:[], inputLang:this.inputLang}

        for (let k in this.codeTab) {
            if (this.codeTab[k].t) mess2ws.outText.push(k)
            if (this.codeTab[k].v) mess2ws.outVoice.push(k)
        }

        if (this.left.focused.title === 'TextInput') {
            this.wait = true

            mess2ws.inputType = 'text'
            mess2ws.textInput = this.textInput

            this.ws.send(JSON.stringify(mess2ws));
        }

        if (this.left.focused.title === 'VoiceInput') {            
            if (this.currentVoice.path) {
                this.wait = true
                mess2ws.inputType = 'voice'
                mess2ws.voicePath = this.currentVoice.path
                mess2ws.voiceExt = this.currentVoice.ext
                // console.log(mess2ws)
                this.ws.send(JSON.stringify(mess2ws));
            }
            else console.log('No Voice select!')
        }
    },
    get icon(){ return (this.wait)?'odant:spin':'av:play-arrow'},
    inputFiles:{
        $type: Object,
        async get() { 
            let response = await fetch('data/input/dir.json')
            return await response.json();
        }
    },
    currentVoice:{},

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
    get language() { return this.codeTab[this.el.lang].language },
    get icon() {return (this.el.tt==='text')? 'iconoir:message-text': 'iconoir:mic'},
    get cls() { return (this.el.tt==='text')? 'success-invert': 'info-invert' } 
})

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
