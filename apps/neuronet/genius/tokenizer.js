import '../../../rocks.js';
import {tensor} from './torus.js';
const MAX_EMB_ERROR = .1;
const WINDOW_SIZE = 8;
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(WINDOW_SIZE).fill().map((v, i)=>(2. ** -i));
export class Tokenizer extends ROCKS({
    tokenizeByWord(text){
        text = text.toLowerCase();
        let word = '';
        let tokens = [];
        let phrases = [tokens];
        const addToken = (word)=>{
            const token = this.vocabulary[word] ??= (()=>{
                const res = Object.create(null);
                res.w = word;
                res.id = Object.keys(this.vocabulary).length;
                res.emb = tensor.rands(this.dim).data;
                res.cnt = Array.from(tensor.rands(this.dim).data);
                res.L = Array.from(tensor.rand(this.dim).data);
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
                    // if (word.length === MAX_WORD_LENGTH){
                    //     addToken(word + '>');
                    //     word = '<';
                    // }
                    word += ch;
                }
            }
        }
        word = word.trim();
        if (word)
            addToken(word + ' ');
        return phrases;
    },
    tokenizeByPair(text){
        text = text.toLowerCase();
        let word = '';
        let tokens = [];
        let phrases = [tokens];
        const addToken = (pair)=>{
            if (!pair.trim().length)
                return;
            const token = this.vocabulary[pair] ??= (()=>{
                const res = Object.create(null);
                res.w = pair;
                res.id = Object.keys(this.vocabulary).length;
                res.emb = tensor.rands(this.dim).data;
                res.cnt = Array.from(tensor.rands(this.dim).data);
                res.L = Array.from(tensor.rand(this.dim).data);
                res.error = 1;
                return res;
            })()
            tokens.push(token);
        }
        let before = ''
        for (let ch of text){
            if (before){
                let pair = before + ch;
                addToken(pair);
            }
            before = ch;
        }
        this.tokens = undefined;
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
        let error = tokens.reduce((r, t) =>{
            return r + t.error;
        }, 0)
        error /= size;
        return  error;
    },
    train(token, phrase){
        if (!phrase.length)
            return 1;
        phrase = phrase.slice(0, WINDOW_SIZE);
        let target = BINS.slice(0, phrase.length);
        while (phrase.length < WINDOW_SIZE && this.size > WINDOW_SIZE * 2){
            const idx = Math.ceil(Math.random() * this.size)
            const t = this.tokens[idx];
            if (t && !phrase.includes(t)){
                target.push(0);
                phrase.push(t);
            }
        }
        const emb = tensor.param(token.emb);
        const cnts = tensor.param(phrase.map(i=>{
            return i.cnt
        }).flat());
        cnts.reshape([phrase.length, this.dim]);
        let res = tensor.einsum(`d, id -> i`, [emb, cnts]);
        res = res.sigmoid();
        res = res.MSE(target);
        token.error = res.data;
        res.back();
        for (let i = 0; i<cnts.shape[0]; i++){
            phrase[i].cnt = Array.from(cnts.data.slice(this.dim * i, this.dim * i + this.dim));
        }
        this.error = undefined//res.data;
        // return this.error;
    },
    get tokens(){
        return Object.values(this.vocabulary);
    },
    get outMatrix(){
        const w = tensor.param(this.tokens.map(t=>t.L.flat()));
        w.label += ' LOGIT'
        return w;
    },
    findToken(tokens, target){
        const matrix = this.outMatrix;
        let logit = tensor.einsum('x, xy -> y', [tokens, matrix.T]);
        // logit = logit.add(bias);
        logit = logit.softmax();
        const max = Math.max(...logit.data);
        const idx = logit.data.findIndex(v => {
            return +v === max;
        });
        const w = this.tokens.find(i=>i.id === idx).w;
        let error;
        if (target){
            target = Array(this.tokens.length).fill(0);
            target[idx] = 1;
            error = logit.MSE(target);
            error.back();
        }
        return {w, logit, error};
    },
}){
    constructor(dim = 32) {
        super()
        this.dim = dim
        this.ends = {
            id: 0,
            w: '<end>',
            emb: new Int8Array(dim),
            L: Array.from(tensor.rand(this.dim).data),
            error: 0
        }
        this.vocabulary['<end>'] = this.ends;

    }
    vocabulary = Object.create(null);
}