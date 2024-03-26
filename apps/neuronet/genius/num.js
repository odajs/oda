export class TNum extends Number{
    g = 0;
    backs = []
    constructor(v, l) {
        super(v);
        if (l)
            this.l = l;
    }
    setVal(v){
        this.valueOf = valueOf;
        this._ = v;
    }
    back(){
        // this.g += g
        for (let back of this.backs)
            back();
        this.backs = []
    }
}
export function num(val, label, back){
    val = ((val instanceof TNum) ? val : new TNum(val, label));
    // if (back)
    //     val.backs.push(back);
    return val;
}
function valueOf(){
    return this._;
}

Number.prototype.toTNumString = function () {
    const v = +this;
    return (v).toExponential(2).padStart(10, ' ') +' ';
}


// math functions

Number.prototype._mul = function (other){
    const out = num(this * other, '_mul');
    out.backs.push(() => {
        this.back(this.g += other * out.g);
        other.back?.(other.g += this * out.g);
    })
    return out;
}
Number.prototype._add = function (other){
    const out = num(this + other, '_add');
    out.backs.push(() => {
        this.back(this.g += out.g);
        other.back?.(other.g += out.g);
    })
    return out;
}

Number.prototype._add_ = function (other){
    this.setVal(this + other);
    this.backs.push(()=>{
        other.back(other.g += this.g);
    })
    this.l='_add_';
    return this;
}
Number.prototype._exp = function (){
    const out = num(Math.exp(this), '_exp')
    this.backs.push(()=>{
        this.back(this.g += Math.E ** this * out.g);
    })
    return out;
}
Number.prototype._pow = function (other){
    const out = num(this ** other, '_pow')
    this.backs.push(()=>{
        this.back(this.g += other * this ** (other - 1) * out.g);
        other.back?.(other.g += this ** other * Math.log(this) * out.g);
    })
    return out;
}
Number.prototype._div = function (other){
    const out = num(this / other, '_div')
    this.backs.push(()=>{
        this.back(this.g += 1 / other * out.g);
        other.back?.(other.g += -(this / other ** 2) * out.g);
    })
    return out;
}

Number.prototype._sqrt = function (){
    const res = Math.sqrt(this)
    const out = num(res, '_sqrt')
    this.backs.push(()=>{
        this.back(this.g += (1 / (2 * res)) * out.g);
    })
    return out;
}
Number.prototype._rsqrt = function (){
    return num(1)._div(this._sqrt());
}
Number.prototype._log = function (){
    const out = num(Math.log(this), '_log')
    this.backs.push(()=>{
        this.back(this.g += (1 / this) * out.g);
    })
    return out;
}
Number.prototype._log10 = function () {
    const out =  num(Math.log10(this), '_log10')
    this.backs.push(()=>{
        this.back(this.g += (1 / (this * Math.log(10)) * out.g));
    })
    return out;
}

// activation functions

Number.prototype.softplus = function () {
    const out =  num(Math.log(1 + Math.exp(this)),'softplus')
    this.backs.push(()=>{
        this.back(this.g += (1 / (1 + Math.exp (-this))) * out.g);
    })
    return out;
}
Number.prototype.sigmoid = function () {
    const out =  num(1 / (1 + Math.exp(-this)), 'sigmoid')
    this.backs.push(()=>{
        this.back(this.g += this * (1 - this) * out.g);
    })
    return out;
}
Number.prototype.silu = function () {
    const out =  num(this * 1 / (1 + Math.exp(-this)), 'silu')
    this.backs.push(()=>{
        this.back(this.g += this * (1 - this) * out.g);
    })
    return out;
}
Number.prototype.relu = function (leak = 0) {
    const out =  num(this > 0 ? this : leak, 'relu')
    this.backs.push(()=>{
        this.back(this.g += (this > 0 ? 1 : leak) * out.g);
    })
    return out;
}

Number.prototype.elu = function (alpha = 1){
    const elu = this > 0 ? this : (alpha * (Math.exp(this) - 1));
    const out =  num(elu, 'elu')
    this.backs.push(()=>{
        this.back(this.g += (this > 0 ? 1 : elu + alpha) * out.g);
    })
    return out;
}

