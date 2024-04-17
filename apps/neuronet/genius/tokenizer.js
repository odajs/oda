import {Tensor} from './tor.js';
import {EO} from "./einops.js";
import {Linear} from './module.js';
const MAX_WORD_LENGTH = 32;
const WORD_DEEP = 48;
const BINS = Array(WORD_DEEP).fill(0).map((v, i)=>(2. ** -i));
export class Tokenizer{
    constructor(params = {dim: 8, head_count: 10}) {
        for (let key in params){
            this[key] = params[key];
        }
        this.token_proj = new Linear(this.dim, 8, true);
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
                res.v = this.encode(word)
                res.emb = Array(this.head_count).fill().map(i=>Array(this.dim).fill().map(_ => (Math.random()-.5)/10))
                res.cnt = Array(this.head_count).fill().map(i=>Array(this.dim).fill().map(_ => (Math.random()-.5)/10))
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
        const cnt = phrase.map(t=>t.cnt);
        const fwd = EO.einsum('rd, hrd -> hr', Tensor.param(token.emb), Tensor.param(cnt));
        const res = fwd.sigmoid();
        const error = res.MSE(BINS);
        res.back()
        return error;
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
    decode(vector){
        vector = this.token_proj(vector);
        vector = vector.data.toReversed();
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