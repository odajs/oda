import {Tensor} from './tor.js';
import {EO} from "./einops.js";
import {Linear} from './module.js';
const MAX_WORD_LENGTH = 32;
const WORD_DEEP = 48;
const BINS = Array(WORD_DEEP).fill(0).map((v, i)=>(2. ** -i));
export class Tokenizer{
    constructor(params = {dim: 8, head_count: 1}) {
        for (let key in params){
            this[key] = params[key];
        }
        this.token_proj = Array(this.head_count).fill().map(_=>new Linear(this.dim, 8, true));
        this.ends = {
            id: 0, w: '<end>', emb: Array(this.head_count).fill().map(_=>Tensor.zeros(this.dim).data),
            W: Array(this.head_count).fill().map(_=>Tensor.random(this.dim, 'context').data),
            B: Array(this.head_count).fill().map(_=>Tensor.random(1, 'context').data)
        }
        this.vocabulary['<end>'] = this.ends;

    }
    vocabulary = Object.create(null);
    textEncoder = new TextEncoder();
    textDecoder = new TextDecoder();

    tokenize(text){
        text = text.toLowerCase();
        let word = '';
        let tokens = [];
        let phrases = [tokens];
        const addToken = (word)=>{
            const token = this.vocabulary[word] ??= (()=>{
                const res = Object.create(null);
                res.w = word;
                res.id = Object.keys(this.vocabulary).length;
                res.emb = Array(this.head_count).fill().map(_=>Tensor.random(this.dim, 'embedding').data);
                res.cnt = Array(this.head_count).fill().map(_=>Tensor.random(this.dim, 'context').data);
                res.W = Array(this.head_count).fill().map(_=>Tensor.random(this.dim, 'context').data);
                res.B = Array(this.head_count).fill().map(_=>Tensor.random(1, 'context').data);
                return res;
            })()
            tokens.push(token);
        }
        for (let ch of text){
            switch (ch){
                case '\r':
                case '\n':
                case '\t':
                case ' ':{
                    if (word)
                        addToken(word + ' ');
                    word = ''
                } break;
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
                        addToken(word + ' ');
                    addToken(ch + ' ');
                    word = ''
                } break;
                case '!':
                case '?':
                case '.':{
                    if (word)
                        addToken(word + ' ');
                    addToken(ch + ' ');
                    tokens = [];
                    phrases.push(tokens);
                    word = ''
                } break;
                default:{
                    if (word.length === MAX_WORD_LENGTH){
                        addToken(word + '>');
                        word = '<';
                    }
                    word += ch;
                }
            }
        }
        word = word.trim();
        if (word)
            addToken(word + ' ');
        return phrases;
    }
    train(token, phrase){
        if (!phrase.length) return;
        let cnt = phrase.map(t=>t.cnt);
        let token_t = Tensor.param(token.emb);
        let cnt_t = Tensor.param(cnt);
        const fwd = EO.einsum('rd, hrd -> hr', token_t, cnt_t);
        let res = fwd.sigmoid();
        const error = res.MSE(BINS);
        error.back();
        return error;
    }
    findToken(vector, target){
        const array = Object.values(this.vocabulary);
        const matrix = Tensor.param(array.map(t=>t.W[0]));
        const bias = Tensor.param(array.map(t=>t.B[0]));
        bias.reshape([array.length])
        let logit = EO.einsum('x, yx -> y', vector, matrix);
        logit = logit.add(bias);
        const res = logit.softmax();
        const max = Math.max(...res.data);
        const idx = res.data.findIndex(v => {
            return +v === max;
        });
        const w = array.find(i=>i.id === idx).w;
        target = array.map(i =>(i === target)?1:0);
        const err = res.MSE(target);
        err.back();
        return w;
    }
    encode(word){
        return this.vocabulary[word]?.v || (()=>{
            const buf = this.textEncoder.encode(word);
            const emb = BINS.reduce((r, b, i) => {
                let v = (buf[i] || 0);
                v = v.toString(2);
                v = v.padStart(8, '0');
                v.split('').map((n, j) => r[j] += (+n * b));
                return r;
            }, Array(8).fill(2 ** -WORD_DEEP));
            return emb;
        })()
    }
    decode(vector, idx){
        vector = this.token_proj[idx](vector);
        vector = vector.data.map(i=>+i);//.toReversed();
        let result = BINS.map(p=>{
            let l = vector.reduce((r, t, i)=>{
                if (t >= p){
                    r += 2 ** i;
                    vector[i] = t - p;
                }
                return r;
            }, 0.0);
            return l;
        }).filter(i=>i);
        result = new Int8Array(result)
        result = this.textDecoder.decode(result);
        return result;
    }
}