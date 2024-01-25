import Zipper from '../attoGPT/zipper.js';


const SIZE_MISMATCH = 'Несогласованность размеров';
const DIM_MISMATCH = 'Неподходящая размерность';

export default class Tensor extends ROCKS({
    $public:{
        data:{
            $freeze: true,
        },
        get label(){
            switch (this.dim){
                case 0:
                    return 'Value';
                case 1:
                    return 'Vector';
                case 2:
                    return 'Matrix';
                case 3:
                    return 'Cube';
                default:
                    return 'Tensor';

            }
        },
        get icon(){
            switch (this.label){
                case 'Value':
                    return 'bootstrap:1-123';
                case 'Vector':
                    return 'carbon:matrix';
                case 'Matrix':
                    return 'iconoir:rubik-cube';
                case 'Cube':
                    return 'lineawesome:cube-solid';
                case 'Tensor':
                    return 'games:cubeforce';
                case 'Dot':
                    return 'image:adjust'
            }
        },
        error: '',
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
    shape:{
        $type: Array,
        get() {
            let d = this.data;
            let v = [];
            while(Array.isArray(d) && d.length){
                v.push(d.length);
                d = d[0];
            }
            return v;
        }
    },
    transpose(){
        let result = zipTranspose(this.data);
        let out = new Tensor(result, 'transpose', [this], 'lineawesome:th-list-solid');
        out._back = () => {
            this.grad = zipTransposeBack(this.grad, out.grad);
        }
        return out;
    },
    concat(other){
        other = checkTensor(other);
        let result = zipConcat(this.data, other.data);
        let out = new Tensor(result, 'concat', [this, other], 'lineawesome:th-list-solid');
        out._back = () => {
            const gdars = zipConcatBack(this.grad, other.grad, out.grad);
            this.grad = gdars[0];
            other.grad = gdars[1];
        }
        return out;

    },
    multiply(other, type='dot'){ //умножение
        other = checkTensor(other);
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
        let out = new Tensor(result, 'multiply', [this, other], 'icons:add-circle-outline:45');
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
        this.error = '';
        let out;
        try{
            other = checkTensor(other);
            let result = zipAdd(this.data, other.data);
            out = new Tensor(result, 'add', [this, other], 'icons:add-circle-outline');
            out._back = () => {
                const gdars = zipAddBack(this.grad, other.grad, out.grad);
                this.grad = gdars[0];
                other.grad = gdars[1];
            }
        }
        catch (e){
            out ??= new Tensor(0, 'add', [this, other], 'icons:add-circle-outline');
            out.error = e.message;
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
        let result = fn(this.data);
        let out = new Tensor(result, 'tanh', [this], 'eva:f-activity');
        out._back = () => {
            function fn(self, data, grad){
                return (self?.map?.((r, i) => fn(r, data[i], grad[i])) || (self + (1 - data ** 2) * grad));
            }
            this.grad = fn(this.grad, out.data, out.grad);
        }
        return out;
    },
    flat(){
        if(!this.dim)
            throw new Error(DIM_MISMATCH);
        let result = this.data.flat();
        let out = new Tensor(result, 'flat', [this], 'games:flat-platform');
        out._back = ()=>{
            this.grad
        }
        return out;
    },
    softmax(){
        if(!this.dim)
            throw new Error(DIM_MISMATCH);
        function fn(data){
            if(Array.isArray(data[0]))
                return data.map(d=>fn(d));
            const maxLogit = data.reduce((r, b) => Math.max(r, b), -Infinity);
            const scores = data.map((l) => Math.exp(l - maxLogit));
            const denom = scores.reduce((r, b) => r + b);
            return scores.map((s) => s / denom);
        }
        let result = fn(this.data);
        let out = new Tensor(result, 'softmax', [this], 'av:equalizer');
        out._back = ()=>{
            function fn(self, data, grad){
                if(Array.isArray(self[0]))
                    return self.map((s, i)=>fn(s, data[i], grad[i]));
                const size = data.length;
                return data.map((v, i)=>{
                    let sum = 0;
                    for (let j = 0; j < size; j++){
                        sum += ((i === j)?(v * (1 - v)):(-v * data[j])) * grad[j];
                    }
                    return self[i] + sum;
                })
            }
            this.grad = fn(this.grad, out.data, out.grad);
        }
        return out;
    },
    crossEntropy(){

    }
}){
    _back = () => {};
    constructor(data, label, children= [], icon, error) {
        super();
        this.data = data;
        this.label = label;
        this.icon = icon;
        this.children = children;
        this.error = error;
    }
}
function checkTensor(data){
    if (data instanceof Tensor)
        return data
    return new Tensor(data);
}

let zipConcat =  new Zipper((a,b)=>a.concat(b),[1,1]);
let zipConcatBack =  new Zipper((self, other, out)=> {
    let s = self.length;
    return [
        self.map((x,i)=>x+out[i]),
        other.map((x,i)=>x+out[s+i])
    ]
},[1,1,1]);

let zipAdd =  new Zipper((a, b)=>{
    if(a.length === 1){
        return a[0] + b.reduce((r,v)=>r+v);
    }
    else if(b.length === 1){
        return a.map((x, i)=>x + b[0]);
    }
    return a.map((x, i)=>x + b[i]);
},[1,1]);
let zipAddBack = new Zipper((self, other, out)=>{
    return [
        self.map((x,i)=>x+out[i]),
        other.map((x,i)=>x+out[i])
    ]
},[1,1,1])

let zipTranspose = new Zipper((m) => {
    return m[0].map((x,i) =>(m.map(y => y[i])));
},[2]);
let zipTransposeBack = new Zipper((grad, out_grad) => {
    return grad.map((x,i) =>(x.map((y,j) => y + out_grad[j][i])));
},[2, 2]);

// let gpuTranspose = new Zipper((m) => {
//     const gpumultiplyMM = gpu.createKernel(function (a, b){
//         let sum = 0;
//         for (let i = 0; i < 512; i++) {
//             sum += a[this.thread.y][i] * b[i][this.thread.x];
//         }
//         return sum;
//     }).setOutput([512, 512])
// },[2]);