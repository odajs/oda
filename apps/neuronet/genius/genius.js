//HYPER PARAMETERS

const MODEL_DIM = 16;           // Размерность входного и выходного слоев
const MAX_DIM = 256;
const LAYER_COUNT = 1;          // Количество слоев
const HEAD_COUNT = 2;            // Количество селекторов (голов) в слое
const SIGNS = ',()[]{}:;';
const SPLITTERS = ' \n\t';
const TERMINATES = '.!?…';
const BINS = Array(32).fill(0).map((v, i)=>(2. ** -i));
class Model{
    dim = MODEL_DIM;
    constructor() {
        this.forward = this.forward.bind(this);
    }
    forward(x){
        return x;
    }
    back(g){
        return g;
    }
    get model(){
        return this['#model'] ??= this.owner || this;
    }
}
export class Genius extends Model{
    constructor() {
        super();
        this.forward.initPhrase = this.initPhrase.bind(this);
        this.encoder = new GeniusEncoder(this);
        this.decoder = new GeniusDecoder(this);
        return this.forward;
    }
    forward(x){
        x =  toGrad(x);
        x = this.encoder(x);
        x = this.decoder(x);
        return x;
    }
    initPhrase(){

    }
}
export class GeniusEncoder extends Model{
    constructor(owner) {
        super();
        this.owner = owner;
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = this.dim * i * HEAD_COUNT || this.dim;
            return new GeniusLayer(this, dim, dim * HEAD_COUNT);
        })
        return this.forward;
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}
export class GeniusDecoder extends Model{
    constructor(owner) {
        super();
        this.owner = owner;
        this.layers = Array(LAYER_COUNT).fill(0).map((_, i)=>{
            let dim = this.dim * i * HEAD_COUNT || this.dim;
            return new GeniusLayer(this, dim * HEAD_COUNT, dim);
        }).reverse();
        return this.forward;
    }
    forward(x){
        for(let layer of this.layers)
            x = layer(x);
        return x;
    }
}

export class GeniusLayer extends Model{
    constructor(owner, dim, out_dim) {
        super();
        this.dim = dim;
        this.owner = owner;
        this.heads = Array(HEAD_COUNT).fill().map(i=>new GeniusHead(this));
        this.W0 = nn.Linear(this, dim * HEAD_COUNT, out_dim); // Матрица сборки выходов голов
        return this.forward;
    }
    forward(x){
        console.log(this.dim)
        let head_res = new Grad(this.heads.map(h=>h(x)));
        x = head_res._concat();
        x = this.W0(x);
        return x;
    }
}
export class GeniusHead extends Model{
    constructor(owner) {
        super();
        this.owner = owner;
        this.in_proj = nn.Linear(this, this.dim, this.dim * 2 + this.delta_rank, true);
        this.dt_proj = nn.Linear(this, this.delta_rank, this.dim, true);
        this.A = toGrad(Array(this.dim).fill('').map(()=>Array(this.dim).fill('').map((_,i)=>Math.log(i+1))));
        this.H = toGrad(Array(this.dim).fill('').map(()=>Array(this.dim).fill(0)));
        this.D = toGrad(1);
        this.ssm = new GeniusSSM(this);
        return this.forward;
    }
    forward(x){
        let x_dbl = this.in_proj(x);
        let [delta, B, C] = x_dbl._slice([this.delta_rank, this.dim, this.dim]);
        delta = this.dt_proj(delta);
        delta = delta._softplus();
        x = this.selective_scan(x, delta, B, C);
        return x;
    }
    selective_scan(x, delta, B, C){
        let A = this.A._exp();
        A = A._mul(-1);
        let deltaA = delta._mul(A);
        deltaA = deltaA._exp();
        let deltaB = delta._mul(B);
        let deltaBx = x._mat_mul(deltaB)
        this.H = this.H._mul(deltaA);
        this.H = this.H._add(deltaBx);
        let y = this.H._mul(C);
        x = x._mul(this.D);
        y = y._add(x);
        return y;
    }
    get delta_rank(){
        return this.dim / MODEL_DIM;
    }
}
export class GeniusSSM extends Model{
    constructor(owner) {
        super();
        this.owner = owner;
        return this.forward;
    }
    forward(x){

        return x;
    }
}
export class GeniusLinear extends Model{
    constructor(owner, in_size, out_size, bias = false) {
        super();
        this.bias = bias;
        this.owner = owner;
        this.W = new Grad(Array(in_size).fill(0).map(i=>Array(out_size).fill(0).map(j=>Math.random()-.5)));
        return this.forward;
    }
    forward(x){
        x = x._mat_mul(this.W);
        return x;
    }
}
export class Tokenizer {
    constructor() {
        return this.tokenize.bind(this);
    }
    tokenize(text){
        let s = '';
        let words = [];
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
                words = [];
            }
            else if (SPLITTERS.includes(ch)){
                if (s)
                    words.push(s);
                s = '';
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
        if (s){
            words.push(s);
            list.push(words);
        }
        return list;
    }
}
export class WordEncoder {
    constructor(dim = MODEL_DIM) {
        this.dim = dim;
        return this.encode.bind(this);
    }
    encode(word){
        const emb = Array(this.dim).fill(0.0);
        for (let i = 0; i<word.length; i++){
            const del = 2 ** -i;
            let code = word.charCodeAt(i);
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
        vector.reverse()
        let result = [];
        for(let i = 0; i<BINS.length; i++){
            let p = BINS[i];
            let l = vector.reduce((r, t, i)=>{
                if (t >= p){
                    r += 2 ** i;
                    vector[i] = t - p;
                }
                return r;
            }, 0.0);
            if(!l) break;
            result.push(l);
        }
        result = String.fromCharCode(...result)
        return result;
    }
}

class Grad{
    _back = () => {};
    constructor(data, label, children= [], error) {
        this.data = data;
        this.label = label;
        this.children = children;
        this.error = error;
    }
    valueOf(){
        return this.data;
    }
    toString(){
        return JSON.stringify(this.data) + JSON.stringify({id: this.label, shape: this.shape})
    }
    get shape(){
        return this['#shape'] ??= (()=>{
            let d = this.data;
            let v = [];
            while(Array.isArray(d) && d.length){
                v.push(d.length);
                d = d[0];
            }
            return v;
        })()
    }
    _concat(){
        let result = this.data.flat();
        let out = new Grad(result, 'concat', [this]);
        return out;
    }
    _mat_mul(other){
        let result = MultiplyMatrix([this.data], other.data)[0]
        let out = new Grad(result, '_mat_mul', [this, other]);

        return out;
    }
    _mul(other){
        other = toGrad(other);
        const res = element_wise((x, y)=>{
            return element_wise((a, b)=>{
                return a * b
            }, y, x);
        }, this.data, other.data);

        let out = new Grad(res, '_mul', [this, other]);
        return out;
    }
    _add(other){
        other = toGrad(other);
        const res = element_wise((x, y)=>{
            return element_wise((a, b)=>{
                return a + b
            }, y, x);
        }, this.data, other.data);

        let out = new Grad(res, '_add', [this, other]);
        return out;
    }
    _t(){
        const res = transpose(this.data)
        let out = new Grad(res, '_t', [this]);
        return out;
    }
    _slice(parts = []){
        let start = 0;
        const result = []
        for (let size of parts){
            let end = start + size;
            result.push(new Grad(this.data.slice(start,  end), `slice: ${start}-${end}`, [this]))
            start = end;
        }
        return result;
    }
    _softplus(){
        const res = element_wise((x) => Math.log(1 + Math.exp(x)), this.data)
        let out = new Grad(res, '_softplus', [this]);
        return out;
    }
    _exp(){
        const res = element_wise((x) => Math.exp(x), this.data)
        let out = new Grad(res, '_exp', [this]);
        return out;
    }
    reverse(){
        this.data.reverse()
    }
}
function element_wise(fn, data, other){
    return data.map?.((v, i)=>element_wise(fn, v, other?.[i] || other)) || fn(data, other);
}
function toGrad(data){
    if(data instanceof Grad)
        return data;
    return new Grad(data);
}
const nn = {
    Linear(...args){
        return new GeniusLinear(...args)
    }
}

function MultiplyMatrix(A,B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;
    const C = [];
    if (colsA !== rowsB) throw new Error('Size mismatch');
    for (let i = 0; i < rowsA; i++)
        C[i] = [];
    for (var k = 0; k < colsB; k++) {
        for (let i = 0; i < rowsA; i++) {
            let t = 0;
            for (let j = 0; j < rowsB; j++)
                t += A[i][j]*B[j][k];
            C[i][k] = t;
        }
    }
    return C;
}
function transpose(m, axis = 0) {
    return m[0]?.map?.((x,i) =>(m.map(y => y[i]))) || m.map(y => [y]);
}