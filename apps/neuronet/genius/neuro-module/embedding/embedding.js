import {tensor} from "../../torus/torus.js";
import {Linear, NeuroModule} from "../neuro-module.js";
export class Embedding  extends NeuroModule{
    _size = undefined;
    constructor(dim = 1024, char_step = 0, win_size = 8, negative_size = 3) {
        super(arguments);
    }
    get BINS(){
        return this._BINS ??= Array(this.win_size).fill().map((v, i)=>(2. ** -(i+1) + .5));
    }
    __init__(){
        this.vocabulary = {"[end]":{
                id: 0,
                w: "[end]",
                emb: tensor.param(tensor.zeros(this.dim))._label('emb: [end]'),
                cnt: tensor.param(tensor.random(this.dim, -.1,.1))._label('cnt: [end]')
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
        x = x.maxIndex();
        return x;
    }
    print(x){
        x = this.restore(x);
        x = Array.from(x.data).map(i=>this.tokens[i]?.w || '?').join('');
        return x;
    }
    plus(...tokens){
        let token = this._plus(...tokens);
        return this.near(token);
    }
    _plus(...tokens){
        tokens = tokens.map(t=>{
            if(typeof(t) === 'string')
                return this._plus(...this._tokenize(t));
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
        //     t1 = this._tokenize(t1);
        t1 = this._plus(t1);

        // if(typeof(t2) === 'string')
        //     t2 = this._tokenize(t2);
        t2 = this._plus(t2);

        return tensor.cosSimilar(t1, t2);
    }
    near(token){
        if(typeof(token) === 'string')
            token = this._plus(...this._tokenize(token));
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
    train(text){
        let tokens = this._tokenize(text);
        tokens.push({})
        let w = this.win_size;
        let size = w * (this.negative_size + 1);
        let windows = tokens.map((token, i)=>{
            i++;
            const slice = tokens.slice(i, i + w);
            if(!slice.length)
                return;
            slice.pop();
            let window = [...slice];
            while (window.length < size){
                const idx = Math.floor(Math.random() * this.size)
                const t = this.tokens[idx];
                if (t && !slice.includes(t)){
                    window.push(t);
                }
            }
            return tensor.stack(window.map(i=>i.cnt));
        })
        tokens.pop();
        windows.pop();
        let tokens_emb = tensor.stack(tokens.map(i=>i.emb));
        let windows_cnt = tensor.stack(windows);

        if (tokens_emb.data.indexOf(0)>-1){
            console.log('УПС - tokens_emb')
        }

        if (windows_cnt.data.indexOf(0)>-1){
            console.log('УПС - windows_cnt')
        }


        let res = tensor.einsum(`ld,lod->lo`, [tokens_emb, windows_cnt]);
        res = res.sigm();
        let target = tensor.from(this.BINS.slice(0, res.shape[0]));
        res = res.MSE(target);
        tokens.forEach((v,i)=>{
            v.error = res.data[i]
        })
        res.back();
        this['#tokens_error'] = undefined;
        this.losses.push([this.tokens_error]);
        return tokens;
    }
    get tokens(){
        return (this._tokens ??= Object.values(this.vocabulary));
    }
    _tokenize(text){
        text = text.toLowerCase();
        let word = '';
        let tokens = [];
        for (let ch of text){
            const type = inRule(ch);
            if (type){
                if (word){
                    tokens.push(this._addToken(word));
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
            tokens.push(this._addToken(word));
        tokens = tokens.flat();
        return tokens;
    }
    _text2emb(text){
        let t = this._tokenize(text);
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
                res.t = type || 'w';
                res.id = Object.keys(this.vocabulary).length;
                res.emb = tensor.param(tensor.random(this.dim, -.1, .1))._label('emb: ' + w);
                res.cnt = tensor.param(tensor.random(this.dim, -.1, .1))._label('cnt: ' + w);
                this._tokens = undefined
                this._size = (this._size || 1)+1;
                return res;
            })()
        }
        if (!type && this.char_step){
            const parts = [];
            for (let i = 0; i < word.length; i += char_step){
                parts.push(word.substr(i, char_step))
            }
            if (parts.length > 1 && parts.last.length < this.char_step){
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
    end: ['.', '!', '?'],
    divider: [',', ';', ":"],
    symbol: ['/','-','(',')','[',']','{','}'],
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

ODA({is: 'oda-embedding',
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
                    <span no-flex>{{$for.item.id}}: {{$for.key}}</span>
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