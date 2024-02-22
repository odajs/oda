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
        for (let i = 0; i<word.length; i++){
            let code = word.charCodeAt(i);
            code = code.toString(2);
            code = code.padStart(this.dim, "0");
            code = code.split('').map(i=>+i);
            console.log(code)
        }
    }
}
const SIGNS = ',()[]{}-:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';