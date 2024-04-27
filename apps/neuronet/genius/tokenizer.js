import '../../../rocks.js';
import {Tensor} from './tor.js';
import {EO} from "./einops.js";
import {Linear} from './module.js';
const MAX_WORD_LENGTH = 32;
const MAX_EMB_ERROR = .1;
const WORD_DEEP = 48;
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = new Float32Array(WORD_DEEP).map((v, i)=>(2. ** -i));
export class Tokenizer extends ROCKS({
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
                res.emb = Array(this.head_count).fill().map(_=>Array(this.d).fill().map(i=>(Math.random()-.5)/10));
                res.cnt = Array(this.head_count).fill().map(_=>Array(this.d).fill().map(i=>(Math.random()-.5)/10));
                res.W = Array(this.head_count).fill().map(_=>Array(this.d).fill().map(i=>(Math.random()-.5)/10));
                res.B = Array(this.head_count).fill().map(_=>Array(1).fill().map(i=>(Math.random()-.5)/10));
                res.error = 1;
                this.tokens = undefined;
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
    },
    get maxError(){
        return MAX_EMB_ERROR;
    },
    get size(){
        return this.tokens.length;
    },
    get error(){
        const tokens = this.tokens.filter(i=>(i.error>0 && i.error<1))
        const size = tokens.length;
        if (!size)
            return 1;
        return tokens.reduce((r, t) =>{
            return r + t.error;
        }, 0) / size;
    },
    train(token, phrase){
        if (!phrase.length)
            return 1;
        let cnt = phrase.map(t=>t.cnt);
        let token_t = Tensor.param(token.emb);
        let cnt_t = Tensor.param(cnt);
        const fwd = EO.einsum('rd, hrd -> hr', token_t, cnt_t);
        let res = fwd.sigmoid();
        const error = res.MSE(BINS);
        error.back();
        token.error = +error.data;
        this.error = undefined;
        return this.error;
    },
    get tokens(){
        return Object.values(this.vocabulary);
    },
    get outMatrix(){
        const w = Tensor.param(this.tokens.map(t=>t.W.flat()));
        w.label += ' LOGIT'
        return w;
    },
    findToken(tokens, target){
        const matrix = this.outMatrix;
        let logit = EO.einsum('x, yx -> y', tokens, matrix);
        // logit = logit.add(bias);
        logit = logit.softmax();
        const max = Math.max(...logit.data);
        const idx = logit.data.findIndex(v => {
            return +v === max;
        });
        const w = this.tokens.find(i=>i.id === idx).w;
        let error;
        if (target){
            target = this.tokens.map(i =>(i === target)?1:0);
            error = logit.MSE(target);
            error.back();
        }
        return {w, logit, error};
    },
}){
    constructor(params = {d: 8, head_count: 1}) {
        super()
        for (let key in params){
            this[key] = params[key];
        }
        // this.token_proj = Array(this.head_count).fill().map(_=>new Linear({d_in: this.d, d_out: 8, bias: true}));
        this.ends = {
            id: 0, w: '<end>', emb: Array(this.head_count).fill().map(_=>Array(this.d).fill(0)),
            W: Array(this.head_count).fill().map(_=>Array(this.d).fill().map(i=>(Math.random()-.5)/10)),
            B: Array(this.head_count).fill().map(_=>Array(1).fill().map(i=>(Math.random()-.5)/10)),
            error: 0
        }
        this.vocabulary['<end>'] = this.ends;

    }
    vocabulary = Object.create(null);
}