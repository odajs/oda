export default class Tensor extends ROCKS({
    $public:{
        data:{
            $freeze: true,
        },
        label: '',
    },
    grad:{
        $freeze: true,
        get(){
            function clone(d){
                if(Array.isArray(d))
                    return d.map(i=>clone(i));
                return 0;
            }
            return clone(this.data);
        }
    },
    back(){
        let topo = [];
        let visited = new Set();
        let build_topo = (v) => {
            if (!visited.has(v)) {
                visited.add(v)
                v.children.forEach(ch => build_topo(ch))
                topo.push(v)
            }
        }
        build_topo(this);
        function clone(d){
            if(Array.isArray(d))
                return d.map(i=>clone(i));
            return 1.0;
        }
        this.grad = clone(this.data);
        topo.reverse().forEach(node => {
            node._back()
        })
    },
    get dim(){
        let d = this.data;
        let v = 0;
        while(Array.isArray(d) && d.length){
            v++;
            d = d[0];
        }
        return v;
    },
    get shape(){
        let d = this.data;
        let v = '';
        while(Array.isArray(d) && d.length){
            v += (v?'x':'') + d.length;
            d = d[0];
        }
        return v;
    },
    multiply(other, type='dot'){ //умножение
        let result;
        let mode = '' + this.dim + other.dim;
        switch (mode){
            case '00':{ // число на число
                result = this.data * other.data;
            } break;
            case '01':{ // число на вектор
                result = other.data.reduce((r, v)=>r + v) * this.data;
            } break;
            case '10':{ // вектор на число
                result = this.data.map(v=>v * other.data);
            } break;
            case '11':{ // вектор на вектор поэлементно
                if (this.data.length !== other.data.length)
                    throw new Error(SIZE_MISMATCH);
                result = this.data.map((v,i)=>v * other.data[i]);
            } break;
            case '12':{ // вектор на матрицу
                if (this.data.length !== other.data.length)
                    throw new Error(SIZE_MISMATCH);
                result = other.data[0].map((_, i)=>this.data.reduce((r, v, j)=>r + v * other.data[j][i]));
            } break;

        }
        let out = new Tensor(result, '*', [this, other]);
        out._back = () => {
            switch (mode){
                case '00':{
                    this.grad += other.data * out.grad;
                    other.grad += this.data * out.grad;
                } break;
                case '01':{
                    this.grad += other.data.reduce((r, v)=>r + v) * out.grad;
                    other.grad = other.grad.map(v=>v + this.data * out.grad);
                } break;
                case '10':{
                    this.grad = this.grad.map((v, i)=>v + other.data * out.grad[i]);
                    other.grad += this.data.reduce((r, v, i)=>r + v * out.grad[i]);
                } break;
                case '11':{ // вектор на вектор поэлементно
                    this.grad = this.grad.map((v, i)=>v + other.data * out.grad[i]);
                    other.grad = other.grad.map((v, i)=>v + this.data * out.grad[i]);
                } break;
                case '12':{ // вектор на матрицу
                    result = other.data[0].map((_, i)=>this.data.reduce((r, v, j)=>r + v * other.data[j][i]));
                } break;
            }
        }
        return out;
    },
    add(other){
        let result;
        let mode = '' + this.dim + other.dim;
        switch (mode){
            case '00':{
                result = this.data + other.data;
            } break;
            case '01':{
                result = this.data + other.data.reduce((r, v)=>r + v);
            } break;
            case '10':{
                result = this.data.map(v=>v + other.data);
            } break;
            default:{
                if(this.shape === other.shape){
                    function add(self, other){
                        if(Array.isArray(self))
                            return self.map((s, i )=>add(s, other[i]));
                        return self + other;
                    }
                    result = add(this.data, other.data);
                }
                else throw new Error(SIZE_MISMATCH);
            } break;
        }
        let out = new Tensor(result, '+', [this, other]);
        out._back = () => {
            switch (mode){
                case '00':{
                    this.grad += out.grad;
                    other.grad += out.grad;
                } break;
                case '01':{
                    this.grad += out.grad;
                    other.grad = other.grad.map(v=>v + out.grad);
                } break;
                case '10':{
                    this.grad = this.grad.map((v, i)=>v + out.grad[i]);
                    other.grad += this.data.reduce((r, v, i)=>r + v + out.grad[i]);
                } break;
                default:{
                    function grad(self, o = out.grad){
                        if(Array.isArray(self))
                            return self.map((v, i )=>grad(v, o[i]));
                        return self + o;
                    }
                    this.grad = grad(this.grad);
                    other.grad = grad(other.grad);
                } break;
            }
        }
        return out;
    },
    tanh(){
        function fn(data){
            return data?.map?.(d => fn(d)) || (()=>{
                let expr = Math.exp(2 * data);
                return (expr - 1)/(expr + 1);
            })()
        }
        let result = fn((this.dim)?this.data:[this.data]);
        let out = new Tensor(result, 'tanh', [this]);
        out._back = () => {
            function fn(grad, data){
                return (grad?.map?.((g, i) => fn(g, data[i])) || ((1 - data ** 2) * grad));
            }
            this.grad = fn(this.grad, this.data);
        }
        return out;
    }
}){
    _back = () => {};
    constructor(data, label='tenzor', children= [], op) {
        super();
        this.data = data;
        this.label = label;
        this.op = op;
        this.children = children;
    }
}

const SIZE_MISMATCH = 'Несогласованность размеров';