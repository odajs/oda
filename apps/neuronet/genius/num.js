Number.prototype._mul = function (other){
    let out = num(this * other);
    this.g = 0;
    other.g = 0;
    out.back = (g)=>{
        this.g += other * g;
        other.g += this * g;
        this.back(this.g);
        other.back(other.g);
    }
    return out;
}

Number.prototype._add = function (other){
    let out = num(this + other);
    out.back = (g)=>{
        // this.g += 1 * g;
        // other.g += 1 * g;
        this.back(g);
        other.back(g);
    }
    return out;
}
Number.prototype._exp = function (){
    const out = num(Math.exp(this));
    out.back = (g = 1) => {
        this.g += Math.E * this ** (Math.E - 1) * g;
        this.back(this.g);
    }
    return out;
}
Number.prototype._pow = function (e){
    const out = num(this ** e);
    out.back = (g = 1) => {
        this.g += this * e ** (this - 1) * g;
        this.back(this.g);
    }
    return out;
}

Number.prototype._div = function (e){
    const out = num(this / e);
    out.back = (g = 1) => {
        this.g += this * e / у ** 2 * g;
        this.back(this.g);
    }
    return out;
}

class TNum extends Number{
    g = 0;
    constructor(v) {
        super(v);
    }
    back(g){

    }
}
export function num(val){
    return val instanceof TNum?val:new TNum(val);
}