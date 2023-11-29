ODA({is: 'oda-stable-diffusion', imports: '@oda/app-layout, @tools/property-grid, @tools/router', extends: 'oda-app-layout',
    template:/*html*/`
        <oda-stable-diffusion-settings bar-opened slot="left-panel" class='vertical'></oda-stable-diffusion-settings>
        <oda-stable-diffusion-history slot="right-panel" ></oda-stable-diffusion-history >
        <oda-property-grid :inspected-object="ppp" slot="right-panel"></oda-property-grid>  
        <oda-stable-diffusion-preview  slot="main"></oda-stable-diffusion-preview>
        <oda-stable-diffusion-log :last  slot="footer"></oda-stable-diffusion-log>
    `,
    attached() {
        this.id = this._newID(19)
        this.param = {...defParam.t2i}
        this.wss = new WebSocket('wss://sdapi.odant.org/wss');
        this.wss.onopen = () => { 
            // console.log('подключился к wss'); 
            this.wss.send(JSON.stringify({action: 'GETHISTORY' }));
        };
        // обработчик сообщений от сервера
        this.wss.onmessage = (message) => {
            let mess = JSON.parse(message.data)
            // console.log(mess)
            if (mess.vox =='LOG') { 
                this.logSD.push(mess)
                this.last = mess
            }
            if (mess.command) {
                console.log(mess)
                if (mess.command=='history') this.history=mess.data.reverse()
                if (mess.command=='end') {this.isGenerate=false; this.wait=false;}
                // console.log(this.history)

            }
        };
        ODA.router.create(hash => this.hash = hash)
        this.hash = (window.location.hash) ? window.location.hash : '#'

    },

    get ppp(){
        return new odaStableDiffusion();
    },
    $public:{      
        hash:{},
        $pdp: true,
        wss:{},        
        id:'',
        param:{},
        isGenerate:true,
        logSD: [],
        _newID(n=19, pref='t2i') { // 19
            let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', rez = '';
            for (let i = 4; i < n; i++) { rez += alphabet[Math.floor(Math.random() * alphabet.length)] }
            return pref + '-' + rez 
        },
        history:[],
        last:{},
        wait: false,
    },


})

ODA({is: 'oda-stable-diffusion-settings',
    template: /*html*/ `
        <div class="horizontal">
            <label style="font-size: x-large" class="flex">Input text:</label>
            <oda-button class="no-flex"  icon="icons:close" @tap="param.prompt = ''"></oda-button>
        </div>
        <textarea style="font-size: x-large; padding: 8px" class="flex" rows="15" ::value="param.prompt" :readonly='!isGenerate'></textarea>
        <oda-button :icon :icon-size="iconSize * 2" style="font-size: x-large;" success-invert :disabled="wait"  label='GO!' @tap='_go()'></oda-button>
    `,
    get icon(){ return (this.wait)?'odant:spin':'av:play-arrow'},
    
    attached() {
    },
    _toGeneration() {
        this.id = this._newID(19)
        this.isGenerate=true
    },
    _go() {
        this.wait = true;
        this.wss.send(JSON.stringify({action: 'TXT2IMG', 'id':this.id, 'param': this.param }));
    },
    async _test() {
        let logg = await (await fetch('test.log.json')).json()
        console.log(logg.length)
        for (let i=0; i< logg.length; i++) {
            console.log(logg[i])
            this.last = logg[i]
        }
        
    }
})
ODA({is: 'oda-stable-diffusion-history',
    template: /*html*/ `
        <style>
            :host {
                grid-column-start: 3; 
                padding:5px;
                overflow: auto;
            }
            div {
                margin-bottom:0.5em; 
                cursor: pointer;
            }
            em {
                display:block; 
                font-size:80%; 
                color:#333;
            }
            a {
                font-size:90%; 
                color:#0075ff;
            }
            .act {
                padding-left:1em;
            }
        </style>
        <div :class='($for.item.id==id)?"act":""' ~for='history' @tap='_selectViev($for.item)'>
        <em>{{$for.item.date}} (<b>{{$for.item.paths.length}}</b>)</em><a>{{$for.item.id}}</a></div>
    `,
    curView:'',
    _selectViev(item) {
        this.isGenerate = false
        this.id=item.id
        // console.log()
        this.param = {...this.param, ...item} //{...defParam.t2i, ...param}
        console.log(this.param)
    }
})
ODA({is: 'oda-stable-diffusion-preview',
    template: /*html*/ `
        <style>
            :host {
                padding:5px; 
            }
            #mini {}
            .ni {
                cursor: pointer; 
                float: left; 
                margin:5px; padding:1px; 
                border: 1px solid #ddd; 
                padding:2px; 
                width:{{w()/8}}px; height:{{h()/8}}px; 
            }
            .ni.active {
                border-color:#0075ff
            } 
            #baseimg {
                margin: 10px auto; 
                border: 1px solid #ddd; 
                width:{{w()}}px; height:{{h()}}px; 
                clear:both; 
            }
            img {
                width:100%; 
                height:100%;
            }

        </style>
        <div id='mini'>
            <div  ~for='preVievList' :class='"ni "+(($for.index==cprev)?"active":"")' @tap='cprev=$for.index'>
                    <img :src='$for.item'/></div>
        </div>
        <div id='baseimg'><img ~if='cprev<preVievList().length' :src='preVievList()[cprev]'></div>  
    `,
    h() {return this.param.h},
    w() {return this.param.w},
    cprev:0,
    preVievList() {
        if (this.isGenerate) return [...Array(this.param.niter*this.param.nsamples)].map(el=>'noimg.svg')
        else return this.history.find(el=> el.id==this.id).paths.map(p=> 'https://sdapi.odant.org'+p)
    }
})

ODA({is: 'oda-stable-diffusion-log', 
    template: /*html*/ `
        <style>
            :host {
                @apply  --info;
                padding:10px;
                border-top: 2px solid;
                font-size:90%;
                height:5em;
                @apply  --no-flex;
                overflow:scroll;
                font-family: monospace;
            }
            em {
                overflow: visible;
            }
            .log {
                width:100%
            }
            .log input {
                width:100%; 
                border:0; 
                background:transparent; 
                color:inherit; 
                font-family: monospace;
            }
            .log em {
                color:#666;
                margin-right:.5em;
            }

        </style>
        <div ~for='textLog' class='log' ><em class='time'>{{$for.item.time}}</em> <input type="text" readonly :value='$for.item.text'> </div>
        <div ~if='timerRun'  class='log timer'><em class='time'>{{_padStart(timerVal)}}</em> </div>
    `,
    last: {
        set (o) {
            if (o.command=='start') { this.timerRun=true; this._nextStep() }
            if (o.command=='end') {  this.timerRun=false }
            if (o.text) { this.textLog.push({'text':o.text, 'time':this._padStart(this.timerVal) })  }
            if (o.ddim) {
                if (o.proc==0) {
                    this.textLog.push({'text':o.ddim , 'time':'XXXXs' })
                    this.ddim =  this.textLog.length -1
                } else {
                    this.textLog[this.ddim]={'text':o.ddim , 'time':'XXXXs' }
                }
                // console.log(o)
            }
            if (o.sampling) {
                console.log(o)
                if (o.proc==0) {
                    this.textLog.push({'text':o.sampling , 'time':'XXXXs' })
                    this.sampling =  this.textLog.length -1
                } else {
                    this.textLog[this.sampling]={'text':o.sampling , 'time':'XXXXs' }
                }
                
            }
        }
    },
    textLog:[],
    timerRun:false,
    timerVal:0,
    sampling:-1, 
    ddim:-1, 
    _nextStep() { setTimeout( ()=>{ if (this.timerRun) {this.timerVal++; this._nextStep() } },1000 ) },
    _padStart(i) {return (''+i).padStart(4, '0')+'s' }
})

const defParam = {
    t2i: {
        ckpt:'sd-v1-4.ckpt',
        niter:2, nsamples:2, steps:100,
        h:512, w:512, scale:7.5, seed:777,

        prompt: 'dark and terrifying horror house living room interior overview design, demon with red eyes is standing in the corner Moebius, Greg Rutkowski, Zabrocki, Karlkka, Jayison Devadas, Phuoc Quan, trending on Artstation, 8K, ultra wide angle, pincushion lens effect.'
    }
}

ODA({is: 'oda-sd-options', template: /*html*/ ` <a ~is="'oda-sd-options-'+ item.value.type" ::item></a>` })
ODA({is: 'oda-sd-options-range', template: /*html*/ `
    <input type="range" :min="item.value.min" :max="item.value.max" :step="item.value.step" ::value="item.value.value">` })
ODA({is: 'oda-sd-options-flag', imports: '@oda/checkbox', template: /*html*/`
    <oda-checkbox class="flex" ::value="item.value.value" style="justify-content: center;" ></oda-checkbox> `,  })
ODA({is: 'oda-sd-options-str', template: /*html*/`
    <input class="flex content" type="text" style="border: none; outline: none; min-width: 0;width: 100%;" ::value="item.value.value" > `,  })
ODA({is: 'oda-sd-options-int', template: /*html*/` 
    <input class="flex content" type="number" style="border: none; outline: none; min-width: 0;width: 100%;" ::value="item.value.value">  `,  })
ODA({is: 'oda-sd-options-select', template: /*html*/`
    <select style="border: none; width: 100%; background: transparent;" ::value="item.value.value" >
        <option ~for='item.value.list' :value='$for.item'>{{$for.item}}</option>
    </select>
` })

class odaStableDiffusion extends ROCKS({

    getOpt(st) { let rez={}
        let dopOpt = [], slyOpt = []
        if (st==='txt2img') { 
            dopOpt = ['skipGrid','skipSave','steps','plms','dpmSolver','laion','fixedCode','ddimEta',
                      'nIter','height','width','channels','dFactor','nSamples','scale','ckpt','seed','precision']
            slyOpt = ['prompt','id','sdType','translete']
        }
        if (st==='img2img') {
            dopOpt = ['skipGrid','skipSave','steps','plms','fixedCode','ddimEta','nIter', 
                        'channels','dFactor','nSamples','scale','ckpt','seed','precision','strength']
            slyOpt = ['prompt','id','initImg','sdType','translete']
        }
        rez.dopOptStr = dopOpt.map( el=> (this[el].type ==='flag')?this[el].sdName: this[el].sdName + ' ' + this[el].value ).join(' ')
        rez.dopOpt = dopOpt.reduce((s,el)=>{s[el]=this[el].value;return s},{} )
        rez.slyOpt = slyOpt.reduce((s,el)=>{s[el]=this[el].value;return s},{} )
        return rez         
    },
    setOpt(obj) { Object.keys(obj).map(k=> this[k].value=obj[k]) },

    sdType:{ $def: {value:'txt2img',
        list:['txt2img', 'img2img', 'inpaint', 'knn2img']}
    },
    $public:{
        translete:{ $def:{
            type:'flag',
            value: true,            
        }, $editor:'oda-sd-options'}, 
        id:{ $def:{ //?? подумать
            type:'str',
            value: '111111',
            sdName:"--outdir" //
        }, $editor:'oda-sd-options'},
        skipGrid:{ $def:{
            type:'flag',
            value: true,
            sdName:"--skip_grid" // "do not save a grid, only individual samples. Helpful when evaluating lots of samples"
        }, $editor:'oda-sd-options'},
        skipSave: { $def:{
            type:'flag',
            value: false,
            sdName:"--skip_save" // "do not save individual samples. For speed measurements."
        }, $editor:'oda-sd-options'},
        steps: { $def:{
            type:"range", min:10, max:150, step:1,
            value: 50,
            sdName:"--ddim_steps" // "number of ddim sampling steps"
        }, $editor:'oda-sd-options'},
        plms: { $def:{
            type:'flag',
            value: false,
            sdName:"--plms" // "use plms sampling"
        }, $editor:'oda-sd-options'},
        dpmSolver:{ $def:{
            type:'flag',
            value: false,
            sdName: "--dpm_solver" //"use dpm_solver sampling"
        }, $editor:'oda-sd-options'},
        laion:{ $def:{
            type:'flag',
            value: false,
            sdName:"--laion400m" // "uses the LAION400M model"
        }, $editor:'oda-sd-options'},
        fixedCode:{  $def:{
            type:'flag',
            value: false,
            sdName:"--fixed_code" // "if enabled, uses the same starting code across samples "
        }, $editor:'oda-sd-options'},
        ddimEta: { $def:{
            type:"range", min:0.0, max:1, step:0.05,
            value:0.0,
            sdName:"--ddim_eta" // "ddim eta (eta=0.0 corresponds to deterministic sampling"
        }, $editor:'oda-sd-options'},
        nIter:{ $def:{
            type:"range", min:1, max:10, step:1,
            value:2,
            sdName:"--n_iter" // "sample this often"
        }, $editor:'oda-sd-options'},
        height:{ $def:{
            type:"range", min:64, max:1024, step:32,
            value:512,
            sdName:"--H" // "image height, in pixel space"
        }, $editor:'oda-sd-options'},
        width:{ $def:{
            type:"range", min:64, max:1024, step:32,
            value:512,
            sdName:"--W" // "image width, in pixel space"
        }, $editor:'oda-sd-options'},
        channels:{ $def:{
            type:"range", min:1, max:4, step:1,
            value:4,
            sdName:"--C" // "latent channels"
        }, $editor:'oda-sd-options'},
        dFactor:{ $def:{
            type:"range", min:1, max:10, step:1,
            value:8,
            sdName:"--f" // "downsampling factor"
        }, $editor:'oda-sd-options'},
        nSamples:{ $def:{
            type:"range", min:1, max:10, step:1,
            value:2,
            sdName:"--n_samples" // "how many samples to produce for each given prompt. A.k.a. batch size"
        }, $editor:'oda-sd-options'},
        //"--n_rows"
        scale:{ $def:{
            type:"range", min:1, max:15, step:0.25,
            value:7.5,
            sdName:"--scale" // "unconditional guidance scale: eps = eps(x, empty) + scale * (eps(x, cond) - eps(x, empty))"
        }, $editor:'oda-sd-options'},
        // "--from-file"
        // "--config"
        ckpt:{ $def:{
            type:"select", list:['sd-v1-4.ckpt', 'sd-v1-5.ckpt'],
            value:'sd-v1-4.ckpt',
            sdName:"--ckpt" // "checkpoint of model"
        }, $editor:'oda-sd-options'},
        seed:{ $def:{
            type:'int',
            value:777,
            sdName:"--seed" // "the seed (for reproducible sampling)"
        }, $editor:'oda-sd-options'},
        precision:{ $def:{
            type:"select", list:["full",  "autocast"],
            value:"autocast",
            sdName: "--precision" // "evaluate at this precision"
        }, $editor:'oda-sd-options'},
      
        strength:{ $def:{
            type:"range", min:0.0, max:1, step:0.05,
            value:0.75,
            sdName:"--strength" // "strength for noising/unnoising. 1.0 corresponds to full destruction of information in init image"
        }, $editor:'oda-sd-options'},
    },
    initImg:{ $def:{
        type:"img",
        value:"",
        sdName:"--init-img" // "path to the input image"
    }, $editor:'oda-sd-options'},
    prompt:{ $def:{ //?? подумать
        type:'str',
        value: '',
        sdName:"--prompt" // "the prompt to render"
    }, $editor:'oda-sd-options'},

    defaultVal:{ "skipGrid":true,"skipSave":false,"plms":false,"dpmSolver":false,"laion":false,"fixedCode":false,"scale":7.5,
                  "ddimEta":0,"nIter":2,"height":512,"width":512,"channels":4,"dFactor":8,"nSamples":2,"translete":true,"seed":7,
                  "ckpt":"sd-v1-4.ckpt","precision":"autocast","prompt":"","id":"111111","sdType":"txt2img","steps":50 },
    _newID(n=19) { // 19
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', rez = '';
        for (let i = 4; i < n; i++) { rez += alphabet[Math.floor(Math.random() * alphabet.length)] }
        return this.sdType.value + '-' + rez 
    },

}){}

