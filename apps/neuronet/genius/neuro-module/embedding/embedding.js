import {tensor} from "../../torus/torus.js";
import {Linear, NeuroModule} from "../neuro-module.js";
export class Embedding  extends NeuroModule{
    negativeSize = 3;
    constructor(dim = 1024, char_step = 0, win_size = 8) {
        super(arguments);
    }
    __init__(){
        this.BINS = Array(this.win_size).fill().map((v, i)=>(2. ** -(i+1) + .5));
        this.vocabulary = {"<end>":{
                id: 0,
                w: "<end>",
                emb: tensor.param(tensor.zeros(this.dim)),
                cnt: tensor.param(tensor.rand(this.dim).minus_(.5))
            }}
        this.logits = new Linear(this.dim, this.dim, true);
    }
    static cosSimilar(A, B) {
        if (A && B) {
            A = A.emb || A
            A = tensor.from(A).data;
            B = B.emb || B
            B = tensor.from(B).data;
            let scalar = 0;
            let avgA = 0;
            let avgB = 0;
            let a, b
            for (let i = 0; i < A.length; i++){
                a = A[i];
                b = B[i];
                scalar += a * b;
                avgA += a * a;
                avgB += b * b;
            }
            if(scalar){
                avgA = Math.sqrt(avgA);
                avgB = Math.sqrt(avgB);
                scalar /= avgA * avgB;
                return Math.abs(scalar);
            }
        }
        return 0;
    }
    forward(x){
        const result = this.logits(x);

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
    near(token){
        if(typeof(token) === 'string')
            token = this._plus(...this._tokenize(t));
        token = tensor.from(token.emb || token);
        const res = this.tokens.map(t=>{
            const v = Embedding.cosSimilar(t, token);
            return {w:t.w, v};
        }).sort((a,b)=>{
            return (a.v>b.v)?-1:1
        })
        return res;
    }
    get size(){
        return this['#size'] ??= this.tokens.length;
    }
    get error(){
        return this['#error'] ??= (()=>{
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
    train(text){
        let tokens = this._tokenize(text);
        tokens.push(this.vocabulary['<end>']);
        let j;
        for (let i = 0; i<tokens.length; i++){
            let token = tokens[i];
            j = i + 1;
            let window = tokens.slice(j, j + this.win_size);
            this.trainStep(token, window);
        }
        this.losses.push(this.error);
        return tokens;
    }
    trainStep(token, phrase){
        if (!phrase.length)
            return 1;
        let target = this.BINS.slice(0, phrase.length);
        let size = this.win_size * (this.negativeSize + 1);
        let stop = size * 2;
        while (stop-- && phrase.length < size && this.size > size){
            const idx = Math.ceil(Math.random() * this.size)
            const t = this.tokens[idx];
            if (t && !phrase.includes(t)){
                target.push(0);
                phrase.push(t);
            }
        }
        const emb = token.emb;
        phrase = tensor.stack(phrase.map(i=>i.cnt));
        let res = tensor.einsum(`x,yx->y`, [emb, phrase]);
        res = res.sigm();
        res = res.MSE(target);
        token.error = res.data[0];
        res.back();
        this['#error'] = undefined;
    }
    get tokens(){
        return this._tokens ??= Object.values(this.vocabulary);
    }
    _tokenize(text){
        if(this.char_step)
            return this._tokenizeByChars(text);
        return this._tokenizeByWord(text);
    }
    _tokenizeByWord(text){
        text = text.toLowerCase();
        let word = '';
        let tokens = [];
        for (let ch of text){
            switch (ch){
                case '\r':
                case '\n':
                case '\t':
                case ' ':{
                    if (word)
                        tokens.push(this._addToken(word + ' '));
                    word = ''
                } break;
                case '/':
                case '-':
                case '(':
                case ')':
                case '[':
                case ']':
                case '{':
                case '}':
                case ':':
                case ';':
                case ',':{
                    if (word)
                        tokens.push(this._addToken(word + ' '));
                    tokens.push(this._addToken(ch + ' '));
                    word = ''
                } break;
                case '!':
                case '?':
                case '.':{
                    if (word)
                        tokens.push(this._addToken(word + ' '));
                    tokens.push(this._addToken(ch + ' '));
                    word = ''
                } break;
                default:{
                    word += ch;
                }
            }
        }
        word = word.trim();
        if (word)
            tokens.push(this._addToken(word + ' '));
        return tokens;
    }
    _tokenizeByChars(text){
        text = text.toLowerCase();
        let tokens = [];
        for (let i = 0; i<text.length; i += this.char_step){
            const word = text.substr(i, this.char_step)
            let token = this._addToken(word);
            if(!token) continue;
            tokens.push(token)

        }
        return tokens;
    }
    _addToken(word){
        if (!word.trim().length)
            return;
        return this.vocabulary[word] ??= (()=>{
            const res = Object.create(null);
            res.w = word;
            res.id = Object.keys(this.vocabulary).length;
            res.emb = tensor.param(tensor.rand(this.dim).minus_(.5))._label('emb: '+word);
            res.cnt = tensor.param(tensor.rand(this.dim).minus_(.5))._label('cnt: '+word);
            if(this.tokens.length >= this.logits.d_out){
                this.logits.updateOutSize(this.logits.d_out + this.dim);
            }
            this._tokens = undefined
            this['#size'] = undefined;
            return res;
        })()
    }
}
ODA({is: 'oda-embedding',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --dark;
                overflow: hidden;
                max-height: 300px;
            }
            span{
                padding: 4px;
                width: 150px;
                font-size: small;

            }
        </style>
        <div flex style="overflow-y: auto;">
            <div stadow ~for="tokenizer?.vocabulary" vertical>
                <div class="horizontal">
                    <span no-flex>{{$for.item.id}}: {{$for.key}}</span>
                    <div class="flex" ~style="getBackGradient($for.item.emb.data)"></div>
                    <span style="text-align: right;" no-flex>{{(+$for.item.error).toLocaleString('ru-RU', {style: 'percent',  minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                </div>
            </div>
        </div>
        <div class="horizontal">
            <span>tokens: {{this.tokenizer?.size || 0}}</span>
            <span>error:  {{tokenizer?.error.toLocaleString('ru-RU', {style: 'percent',  minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
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