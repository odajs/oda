export class Genius {
    constructor() {

    }
}
export class Tokenizer {
    constructor() {
        return this.tokenize.bind(this);
    }
    tokenize(text){
        let s = '';
        let words = []
        const list = [];
        for (let ch of text){
            if (ch === '.' && s.length === 1){
                s += ch;
                words.push(s);
                s = ''
            }
            else if (TERMINATES.includes(ch)){
                if (s)
                    words.push(s);
                s = '';
                words.push(ch.toString());
                list.push(words);
                words = []
            }
            else if (SPLITTERS.includes(ch)){
                if (s)
                    words.push(s);
                s = ''
            }
            else if (SIGNS.includes(ch)){
                if (s)
                    words.push(s);
                s = '';
                words.push(ch.toString());
            }
            else{
                s += ch;
            }
        }
        return list;
    }
}
export class WordEncoder {
    constructor(dim = 16) {
        this.dim = dim;
        return this.encode.bind(this);
    }
    encode(word){
        const emb = Array(this.dim).fill(0.0);
        for (let i = 0; i<word.length; i++){
            const del = 2 ** -i;
            let code = word.charCodeAt(i);
            console.log(code)
            code = code.toString(2);
            code = code.padStart(this.dim, "0");
            code.split('').forEach((v, i)=>{
                emb[i]+=((+v) * del)
            });
        }
        return emb;
    }
}
export class WordDecoder {
    constructor() {
        return this.decode.bind(this);
    }
    decode(vector){
        let result = [];
        for(let i = 0; i<BINS.length; i++){
            let p = BINS[i];
            let l = vector.reverse().reduce((r, t, i)=>{
                if (t >= p)
                    r += 2 ** i;
                vector[i] = t - p;
                return r;
            }, 0.0);
            if(!l) break;
            result.push(l);
        }
        result = String.fromCharCode(...result)
        return result
    }
}
let BINS = Array(32).fill(0).map((v, i)=>(2. ** -i));
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';