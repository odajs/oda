export class Convertor {
    constructor(dim = 32) {
        this.dim = dim
        this.buffer = new ArrayBuffer(8*dim) // 8byte = 64bit 
        this.view = new DataView(this.buffer)
        for (let i=0;i<dim;i++) this.setFloat(i,1) // Начальная инициализация, дабы установить знак и экспоненту 
    }
    getBit(i) {
        let bitmap = this.view.getBigUint64(i*8).toString(2).padStart(64, '0')
        return {s:bitmap.slice(0,1), exp:bitmap.slice(1,12), fraction:bitmap.slice(12)}
    }
    setBit(i,o) {
        let bit = Object.values({...this.getBit(i), ...o}).join('')
        this.view.setBigUint64(i*8, BigInt(parseInt(bit,2)) ) }
    print(i) {
        console.log(`${this.view.getFloat64(i*8)} => ${this.getBit(i).s} ${this.getBit(i).exp} ${this.getBit(i).fraction}`)
    }
    setFloat(i,float) {this.view.setFloat64(i*8, float)}
    getVector() {
        return [...Array(this.dim)].map( (_,i)=> this.view.getFloat64(i*8) )
    }
    encode(word) {
        let map = (word).split('').map(i => i.charCodeAt(0).toString(2).padStart(this.dim, '0'))
        let mapT = map.reduce((akk,s) => akk.map((c,i)=> c+s[i] ), [...Array(this.dim)].fill(''))
        let fractions = mapT.map(s => s + '0'.repeat(32 - s.length) + '1' + '0'.repeat(19) )
        fractions.map((fr,i)=> this.setBit(i,{fraction:fr}) )
        return this.getVector()
    }
    decode(vector) {
        vector.forEach((float,i) => this.setFloat(i,float) )
        let bm = vector.map((_,i) => this.getBit(i).fraction.slice(0,32))
        let bmT = bm.reduce((akk,s) => akk.map((c,i)=> c+s[i] ), [...Array(this.dim)].fill(''))
        let word = bmT.map(i => (parseInt(i,2)===0)?'':String.fromCharCode(parseInt(i,2))).join('')
        return word
    }
}
let t = {a:'0'.repeat(52),b:'1'.repeat(42)+'0'.repeat(10)}
let tFr = '1110000000000000000000000000000100000000000000000000'

let conv = new Convertor(32)

// conv.setFraction(5,tFr)
// conv.print(5)
let xxx = conv.encode('zip')
let yyy = conv.decode(xxx)

conv.setFloat(5,1.5)
conv.print(5)
conv.setBit(5,{exp:'01111111111'})

