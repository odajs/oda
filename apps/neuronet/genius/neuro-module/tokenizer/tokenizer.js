import {tensor} from "../../torus/torus.js";
import {nn} from "../neuro-module.js";
export class Tokenizer  extends nn.NeuroModule{
    _size = undefined;
    constructor(dim = 1024, char_step = 0, win_size = 8, negative_size = 3) {
        super(arguments);
    }
    get targetSize(){
        return this._targetSize ??= this.win_size * (this.negative_size + 1);
    }
    onProgress(p){

    }
    get BINS(){
        return this._BINS ??= (()=>{
            const _bins =  Array(this.win_size).fill().map((v, i)=>(2. ** - (i + 1) + .5));
            while (_bins.length<this.targetSize)
                _bins.push(0)
            return tensor.from(_bins)
        })();
    }
    __init__(){
        this.vocabulary = {"[end]":{
                id: 0,
                w: "[end]",
                emb: tensor.param(tensor.zeros(this.dim))._label('emb: [end]'),
                cnt: tensor.param(tensor.empty(this.dim))._label('cnt: [end]')
            }}
    }
    forward(x){
        if(typeof x === 'string')
            x = this._text2emb(x);
        x = tensor.from(x);
        return x;
    }
    restore(x){
        x = this.forward(x);
        x = x.array.map(token=>{
            return this.near(token)[0];
        })
        // x = x.maxIndex();
        return x;
    }
    print(x){
        x = this.restore(x);
        x = x.map(i=>i.w).join('');
        return x;
    }
    plus(...tokens){
        let token = this._plus(...tokens);
        return this.near(token);
    }
    _plus(...tokens){
        tokens = tokens.map(t=>{
            if(typeof(t) === 'string')
                return this._plus(...this.tokenize(t));
            return tensor.from(t.emb || t);
        });
        tokens = tokens.reduce((res, v)=>{
            v = v.data;
            return res.map((x,i) => x + v[i])
        }, new Float32Array(this.dim))
        return tensor.from(tokens);
    }
    sample(t1, t2){
        // if(typeof(t1) === 'string')
        //     t1 = this.tokenize(t1);
        t1 = this._plus(t1);

        // if(typeof(t2) === 'string')
        //     t2 = this.tokenize(t2);
        t2 = this._plus(t2);

        return tensor.cosSimilar(t1, t2);
    }
    near(token){
        if(typeof(token) === 'string')
            token = this._plus(...this.tokenize(token));
        token = tensor.from(token.emb || token);
        const res = this.tokens.map(t=>{
            if (t !== token){
                const v = tensor.cosSimilar(t, token);
                return {w:t.w, v};
            }
        }).filter(i=>i).sort((a,b)=>{
            return (a.v>b.v)?-1:1
        })
        return res;
    }
    get size(){
        return (this._size ??= this.tokens.length);
    }
    get tokens_error(){
        return this['#tokens_error'] ??= (()=>{
            const tokens = this.tokens.filter(i=>(i.error>0 && i.error<1))
            const size = tokens.length;
            if (!size)
                return 1;
            let error = tokens.reduce((r, t) =>{
                return r + t.error;
            }, 0)
            error /= size;
            return  error;
        })()
    }
    get error(){
        return this.tokens.filter((_,i)=>i).map(i=>i.error).avg();
    }
    async train(text){
        try{
            let win_size = this.win_size;
            let size = this.targetSize;
            const splits = text.split('\r\n').filter(Boolean).map(text =>{
                return text.split('\n').filter(Boolean).map(text =>{
                    return text.split('\r').filter(Boolean).flat();
                }).flat();
            }).flat();
            this.fire('progress', 0)
            const length = splits.length;
            let tokens = [];
            for (let s = 0; s<length; s++){
                const tt = this.tokenize(splits[s]);
                tokens.push(...tt);
                tt.clear();
                if(s === length - 1 || tokens.length > 10000){
                    let train_step = new Promise(async resolve =>{
                        let windows = tokens.map((token, i)=>{
                            i++;
                            const slice = tokens.slice(i, i + win_size);
                            if(!slice.length)
                                slice.push(this.vocabulary['[end]']);
                            let window = [...slice];
                            while(window.length < win_size){
                                window.unshift(window[0])
                            }
                            while (window.length < size){
                                const idx = Math.floor(Math.random() * this.size)
                                const t = this.tokens[idx];
                                if (t && t !== token && !slice.includes(t)){
                                    window.push(t);
                                }
                            }
                            return tensor.stack(window.map(i=>i.cnt));
                        })
                        let tokens_emb = tensor.stack(tokens.map(i=>i.emb));
                        let windows_cnt = tensor.stack(windows);

                        let res = tensor.einsum(`ld,lod->lo`, [tokens_emb, windows_cnt]);
                        res = res.sigm();
                        res = res.MSE(this.BINS);
                        tokens.forEach((v,i)=>{
                            v.error = res.data[i]
                        })
                        res.back();
                        this['#tokens_error'] = undefined;
                        this.losses.push([this.tokens_error]);
                        tokens.clear();
                        windows.clear();
                        this.fire('progress', Math.round(s / length * 100))
                        requestAnimationFrame(()=>{
                            resolve()
                        })
                    })
                    await train_step;
                }

            }
        }
        finally {
            this.fire('progress', 0);
        }

    }
    get tokens(){
        return (this._tokens ??= Object.values(this.vocabulary));
    }
    split_and_tokenize(text, splitter='\n'){
        return text.split(splitter).filter(Boolean).map(t=>this.tokenize(t));
    }
    tokenize(text){
        text = text.toLowerCase();
        let word = '';
        let tokens = [];
        for (let ch of text){
            const type = inRule(ch);
            if (type){
                if (word){
                    tokens.push(this._addToken(' ' + word));
                    word = ''
                }
                const t = this._addToken(ch, type);
                if (t)
                    tokens.push(t);
            }
            else{
                word += ch;
            }
        }
        word = word.trim();
        if (word)
            tokens.push(this._addToken(' ' + word));
        tokens = tokens.flat();
        return tokens;
    }
    _text2emb(text){
        let t = this.tokenize(text);
        t = t.map(i=>i.emb);
        t = tensor.from(t);
        return t;
    }
    _addToken(word, type){
        if (!word.trim().length)
            return;
        const get_word = (w)=>{
            return this.vocabulary[w] ??= (()=>{
                const res = Object.create(null);
                res.w = w;
                if (type)
                    res.t = type;
                // res.id = Object.keys(this.vocabulary).length;
                res.emb = tensor.param(tensor.empty(this.dim))._label('emb: ' + w);
                res.cnt = tensor.param(tensor.empty(this.dim))._label('cnt: ' + w);
                this._tokens = undefined
                this._size = (this._size || 1) + 1;
                return res;
            })()
        }
        if (!type && this.char_step){
            const parts = [word.substr(0, char_step + 1)];
            for (let i = char_step + 1; i < word.length; i += char_step){
                parts.push(word.substr(i, char_step))
            }
            if (parts.length > 1 && char_step > 1 && parts.last.length === 1){
                word = parts.pop()
                parts[parts.length - 1] += word;
            }
            return parts.map((w)=>{
                return get_word(w);
            })
        }
        return get_word(word);
    }
}
const rules = {
    space: ['\r', '\n', '\t', ' '],
    end: ['.', '!', '?', '…'],
    divider: [',', ';', ":"],
    quote: ['(',')','[',']','{','}', '«', '»', '\'', '"','<','>'],
    symbol: ['/','-', '—', '=', '*', '&', '^', '%', '$', '#', '№', '@', '~', '+', '_', '\\', '|'],
    more: []
}
function inRule(char){
    for (let r in rules){
        const rule = rules[r];
        if (rule.includes(char))
            return r;
    }
    return false;
}

ODA({is: 'oda-tokenizer',
    template: `
        <style>
            :host{
                @apply --vertical;
                /*@apply --dark;*/
                overflow: hidden;
                height: 300px;
            }
            span{
                padding: 4px;
                width: 150px;
                font-size: small;

            }
        </style>
        <div class="bold horizontal header">
            <span>token</span>
            <span flex>vector</span>
            <span>error</span>
        </div>
        <div flex style="overflow-y: auto;">
            <div stadow ~for="tokenizer?.vocabulary" vertical>
                <div class="horizontal">
                    <span no-flex>{{$for.key}}</span>
                    <div class="flex" ~style="getBackGradient($for.item.emb.data)"></div>
                    <span style="text-align: right;" no-flex>{{(+$for.item.error).toLocaleString('ru-RU', {style: 'percent',  minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                </div>
            </div>
        </div>
        <div class="horizontal header bold">
            <span>tokens: {{this.tokenizer?.size || 0}}</span>
            <span flex></span>
            <span  style="text-align: right;">{{tokenizer?.error.toLocaleString('ru-RU', {style: 'percent',  minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
        </div>


    `,
    tokenizer: null,
    get error(){
        return this.tokenizer?.error;
    },
    get size(){
        return this.tokenizer?.size;
    },
    getBackGradient(vector){
        return {background: `linear-gradient(to right, ${this.getColors(vector)})`}
    },
    getColors(items){
        const getColor = (val)=>{
            return Math.round(300 * val);
        }
        const length = items.length
        return  Array.from(items || []).map((val, idx, items)=>{
            return `hsl(${getColor(val)}, 100%, 50%) ${((idx+1)/length) * 100}%, hsl(${getColor(items[idx+1] || 0)}, 100%, 50%)  ${((idx+1)/length) * 100}%`;
        }).join(', ');
    },
})