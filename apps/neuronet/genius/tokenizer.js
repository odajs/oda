import {Parameter, Tensor, EO} from './tor.js';
import {Linear} from './module.js';
const EMBEDDING_SIZE = 32;
const NEGATIVE_SIZE = 5;
const MAX_WORD_LENGTH = 32;
const WORD_DEEP = 48;
const BINS = Array(WORD_DEEP).fill(0).map((v, i)=>(2. ** -i));
export class Tokenizer{
    vocabulary = Object.create(null);
    textEncoder = new TextEncoder();
    textDecoder = new TextDecoder();
    token_proj = new Linear(EMBEDDING_SIZE, 8, true);
    tokenize(text){
        text = text.toLowerCase();
        let word = '';
        let tokens = [];
        let phrases = [tokens];
        let prev;
        const addToken = (word)=>{
            const token = this.vocabulary[word] ??= {
                next: [],
                v: this.encode(word),
                e: Array(EMBEDDING_SIZE).fill().map(_ => Math.random()-.5),
                c: Array(EMBEDDING_SIZE).fill().map(_ => Math.random()-.5)
            }
            if (prev){
                this.vocabulary[prev].next.add(word);
            }
            // this.token_proj(token.e).mse(token.v).back(.01);
            tokens.push(token);
            prev = word
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
                    tokens.push(ch + ' ');
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