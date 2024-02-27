const ERROR = {
    SIZE_MISMATCH: (p1 = 0, p2 = 0) => {
        throw new Error(`Несогласованность размеров:\r\n p1=${p1}, p2=${p2}`)
    },
    DIM_MISMATCH: (p1 = 0, p2 = 0) => {
        throw new Error(`Неподходящая размерность:\r\n ожидается ${p1}, подано ${p2}`)
    },
    DIM_OUT_FO_RANGE: (need = [], got = 0) => {
        throw new Error(`IndexError: Dimension out of range (expected to be in range of ${need}, but got ${got})`)
    },
}
export class num{
    static range(...args){
        let [start, end, step] = args;
        switch (args.length){
            case 0:
                throw 'need arguments'
            case 1:{
                end = start;
                start = 0;
            } break;
        }
        const result = []
        for (let i = start; i <= end; i += step || 1){
            result.push(i);
        }
        return result;
    }
}

export class Tensor extends ROCKS({
    $public:{
        data:{
            $freeze: true,
        },
        get label(){
            switch (this.dim){
                case 0:
                    return 'scalar';
                case 1:
                    return 'vector';
                case 2:
                    return 'matrix';
                default:
                    return 'tensor';

            }
        },
        get icon(){
            switch (this.label){
                case 'scalar':
                    return 'bootstrap:1-123';
                case 'vector':
                    return 'carbon:matrix';
                case 'matrix':
                    return 'iconoir:rubik-cube';
                case 'tensor':
                    return 'games:cubeforce';
                case 'dot':
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
            return Math.round(Math.random() * 10)/10;//1.0;
        }
        this.grad = clone(this.data);
        topo.reverse().forEach(node => {
            node._back()
        })
    },
    get dim(){
        return this.shape.length;
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
    get size(){
        return this.shape.reduce((r, v)=>r * v, 1);
    },

    transpose(){
        let out;
        try{
            if (this.dim < 2)
                ERROR.DIM_MISMATCH('>1', this.dim)
            out = new Tensor(zipTranspose(this.data), 'transpose', [this], 'lineawesome:th-list-solid');
            out._back = () => {
                this.grad = zipTransposeBack(this.grad, out.grad);
            }
        }
        catch (e){
            out ??= new Tensor(0, 'transpose', [this], 'lineawesome:th-list-solid');
            out.error = e.message;
        }
        return out;
    },
    concat(other){
        other = checkTensor(other);
        let result = zipConcat(this.data, other.data);
        let out = new Tensor(result, 'concat', [this, other], 'lineawesome:th-list-solid');
        out._back = () => {
            this.grad = zipConcatBack(this.grad, out.grad);
            other.grad = zipConcatBack(other.grad, out.grad);
        }
        return out;

    },
    max(axis){
        if (axis > this.dim)
            DIM_OUT_FO_RANGE([this.dim - 4, this.dim], axis)
        let result = this.data;
        let out = new Tensor(result, 'max', [this], 'icons:add-circle-outline');
        return out;
    },
    sum(){
        function fn(data){
            if (Array.isArray(data[0]))
                return data.map(d=>fn(d));
            return data?.reduce?.((r,v)=>r+v) || data;
        }
        let result = fn(this.data);
        let out = new Tensor(result, 'sum', [this], 'icons:add-circle-outline');
        return out;
    },
    multiply(other){ //умножение
        let out;
        try{
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
                        ERROR.SIZE_MISMATCH(this.data.length, other.data.length);
                    result = this.data.map((v,i)=>v * other.data[i]);
                } break;
                case '12':{ // вектор на матрицу
                    if (this.data.length !== other.data.length)
                        ERROR.SIZE_MISMATCH(this.data.length, other.data.length);
                    result = other.data[0].map((_, i)=>this.data.reduce((r, v, j)=>r + v * other.data[j][i]));
                } break;
                case '22':{
                    if (this.data[0].length !== other.data.length)
                        ERROR.SIZE_MISMATCH(this.data.length, other.data.length);
                    result = MultiplyMatrix(this.data, other.data);
                } break;

            }
            out = new Tensor(result, 'multiply', [this, other], 'icons:add-circle-outline:45');
            out._back = () => {
                try{
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
                            this.grad = this.grad.map((v, i)=>v + other.data[i] * out.grad[i]);
                            other.grad = other.grad.map((v, i)=>v + this.data[i] * out.grad[i]);
                        } break;
                        case '12':{ // вектор на матрицу todo Доделать
                            this.grad = this.grad.map((v, i)=>v + other.data[i] * out.grad[i]);
                            other.grad = other.grad.map((v, i)=>v + this.data[i] * out.grad[i]);
                        } break;
                        case '22':{

                            // this.grad = multiplyMT(out.grad, other.data);

                            const data = transposeMatrix(this.data)
                            other.grad = MultiplyMatrix(data, out.grad)
                            this.grad = multiplyMT(out.grad, other.data);

                            // other.grad = MultiplyMatrix(this.data, out.grad);
                        } break;
                    }
                }
                catch (e){
                    this.error = 'Back:\r\n' + e.message;
                }

            }

        }
        catch (e){
            out ??= new Tensor(0, 'multiply', [this], 'lineawesome:th-list-solid');
            out.error = e.message;
        }
        //
        return out;
    },
    add(other){
        let out;
        try{
            other = checkTensor(other);
            let result;
            if(!this.dim){
                if(other.dim){
                    let data = other.data
                    for(let i = 0; i<other.dim; i++){
                        data = data.flat();
                    }
                    result = data.reduce((r,v)=>r+v) + this.data;
                }
                else
                    result = other.data + this.data;

            }
            else if(!other.dim){
                function fn(self, other){
                    return self?.map?.(v => fn(v, other)) || (()=>{
                        return self + other;
                    })()
                }
                result = fn(this.data, other.data);
            }
            else if(this.shape.toString() !== other.shape.toString()){
                ERROR.DIM_MISMATCH(this.shape, other.shape);
            }
            else {
                function fn(self, other){
                    return self?.map?.((d,i) => fn(d, other[i])) || (()=>{
                        return self + other;
                    })()
                }
                result = fn(this.data, other.data);
            }
            // let result = zipAdd(this.data, other.data);
            out = new Tensor(result, 'add', [this, other], 'icons:add-circle-outline');
            out._back = () => {
                function grad(out){
                    if(!this.dim){
                        if(!out.dim)
                            this.grad += out.grad;
                        else{
                            let grad = out.grad;
                            for(let i = 0; i<out.dim; i++){
                                grad = grad.flat();
                            }
                            this.grad += grad.reduce((r,v)=>r+v);
                        }
                    }
                    else{
                        function fn(grad, out){
                            return grad?.map?.((d,i) => fn(d, out[i])) || (()=>{
                                return grad + out;
                            })()
                        }
                        this.grad = fn(this.grad, out.grad);
                    }
                }
                grad.call(this, out);//zipAddBack(this.grad, out.grad);
                grad.call(other, out);//zipAddBack(other.grad, out.grad);
            }
        }
        catch (e){
            out ??= new Tensor(0, 'add', [this, other], 'icons:add-circle-outline');
            out.error = e.message;
        }
        return out;
    },
    discretize(B, C, step){
        const I = tensor(matrix.eye(this.shape[0]));
    },
    sigmoida(){
        function fn(data){
            return data?.map?.(d=>fn(d)) || 1/(1+ Math.exp(-data));
        }
        let result = fn(this.data);
        let out = new Tensor(result, 'sigmoid', [this], 'unicon:sigma');
        out._back = () => {
            function fn(self, data, grad){
                return self?.map?.((r, i) => fn(r, data[i], grad[i])) || (self + data * (1 - data) * grad);
            }
            this.grad = fn(this.grad, out.data, out.grad);
        }
        return out;
    },
    silu(){
        function fn(data){
            return data?.map?.(d=>fn(d)) || data * 1/(1+ Math.exp(-data));
        }
        let result = fn(this.data);
        let out = new Tensor(result, 'silu', [this], 'unicon:sigma');
        out._back = () => {
            function fn(self, data, grad){
                return self?.map?.((r, i) => fn(r, data[i], grad[i])) || (self + data * (1 - data) * 1/(1+ Math.exp(-data)) * grad);
            }
            this.grad = fn(this.grad, out.data, out.grad);
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
            ERROR.DIM_MISMATCH(this.dim, '>0');
        let result = this.data.flat();
        let out = new Tensor(result, 'flat', [this], 'games:flat-platform');
        out._back = ()=>{
            this.grad
        }
        return out;
    },
    softmax(){
        if(!this.dim)
            ERROR.DIM_MISMATCH(this.dim, '>0');
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
        if (this.use_back){
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
    valueOf(){
        return this.data;
    }
    toString(){
        return JSON.stringify(this.data) + JSON.stringify({id: this.label, shape: this.shape})
    }
}

// const num = {
//     arange:(start, size, step)=>{
//
//     }
// }