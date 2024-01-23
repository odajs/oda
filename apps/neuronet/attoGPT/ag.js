export class NetValue extends ROCKS({
    topology:[],
    backward() { 
        this.outputs.forEach(out => out.grad = 1.0)
        this.topology.reverse().forEach(node => node._backward() )
    },
    forward() { this.topology.forEach(node => {
        node.grad = 0
        node._forward()
    } )  },
    step() { this.forward() ; this.backward()  },
    toIcon(l) { return (l == 'sum') ? 'icons:add-circle-outline' 
                     : (l == 'mul') ? 'icons:highlight-off'
                     : (l == 'tanh') ? 'carbon:letter-tt'
                     : (l == '') ? '' 
                     : 'icons:error'
    },
    get digraph() {
        let rez = {data:[], xMax:0, yMax:0, m:{}, n: new Map() }
        let addBl = (el, y) => {
            if (rez.n.get(el)==undefined) {
                rez.m[y]??=0
                rez.m[y]++
                rez.n.set(el,rez.data.length)
                let bind = el.children.map( (v,i) => { return { block: v, top: 0 } })
                let obj = {
                    is: "oda-ag-value", x:rez.m[y], y, 
                    props: { el },
                    pins: {
                        top: [{}],
                        bottom: (bind.length)? [{ bind, props: { icon: this.toIcon(el.op) } }]:[]
                    }
                }
                rez.xMax = Math.max(rez.xMax,obj.x)
                rez.yMax = Math.max(rez.yMax,obj.y)
                rez.data.push(obj)
            
                el.children.forEach((c, i) => addBl(c, obj.y+1))
            }
        }
        this.outputs.forEach( out => addBl(out,0))
        let [dX, dY] = [100, 150]
        rez.data.forEach(bl=> {
            bl.x = ( (2*bl.x-1) / rez.m[bl.y] ) * rez.xMax * dX
            if (bl.props.el.t==='input') bl.y++
            bl.y = (bl.y+0.1) * dY
            if (bl.pins.bottom.length)          
                bl.pins.bottom[0].bind.forEach(b => b.block =  rez.n.get(b.block))
        } )
        rez.data[0].pins.top=[]
        return rez.data
    },
    use (xs) {
        if (this.inputs.length != xs.length) console.error(`Не та размерность. Входов: ${this.inputs.length}. Подаем ${xs.length}.` )
        else {
            this.inputs.forEach((inp,i)=> inp.data=xs[i] )
            // console.log( this.inputs)
            this.step()
            let rez = []
            this.outputs.forEach((out,i)=> rez[i]=out.data)
            return rez
        }
    }


}){
    constructor(outputs, inputs=[], parameters=[]) {
        super();
        this.outputs = outputs
        this.inputs = inputs
        this.parameters = parameters

        let paSet = new Set(parameters)
        let inSet = new Set(inputs)

        let visited = new Set()
        let buildTopology = (v) => {
            if (!visited.has(v)) {
                visited.add(v)
                v.children.forEach(ch => buildTopology(ch))
                if ((v.children.length==0)&&(!paSet.has(v))&&(!inSet.has(v)) ) this.inputs.add(v)
                this.topology.push(v)
            }
        }
        this.outputs.forEach( buildTopology )
        this.outputs.forEach(o => o.t = 'output')
        this.inputs.forEach(i => i.t = 'input')
        this.parameters.forEach(p => p.t = 'param')
    }
}

export class Value {
    children=[]
    op=''
    label=''
    _backward = () => {}
    _forward = () => {}
    grad = 0
    constructor(data=0, label='', t=undefined) {
        // super();
        this.data = data
        this.label=label
        this.t = t
    }
    sum(children) {
        this.children = children
        this.op = 'sum'
        this._forward = () => { this.data = children.reduce((akk,cur) => akk + cur.data, 0 ) }
        this._backward = () => { this.children.forEach(ch=> ch.grad += 1.0 * this.grad) }
        return this
    }
    mul(first,second) {
        this.children = [first,second]
        this.op = 'mul'
        this._forward = () => { this.data = first.data*second.data}
        this._backward = () => {
            first.grad += this.grad * second.data
            second.grad += this.grad * first.data
        }
        return this
    }
    tanh(val) {
        this.children = [val]
        this.op = 'tanh'
        this._forward = () => { this.data = (Math.exp(2*val.data) - 1)/(Math.exp(2*val.data) + 1) }
        this._backward = () => { val.grad += (1 - this.data**2) * this.grad }
        return this
    }
}

export class Neuron extends NetValue.ROCKS({}) {
    constructor(nIn, inputs=undefined) {
        inputs ??=  Array(nIn).fill(0).map((a,i)=>new Value(0,'in'+i))
        let [parameters, act]= [[],[]]
        let b = new Value (2*(Math.random()-0.5),'b',)
        for (let i=0;i<nIn;i++) {
            parameters[i] = new Value (2*(Math.random()-0.5),'w'+i)
            act[i] = (new Value()).mul(inputs[i], parameters[i])
        }
        let sum = (new Value ()).sum( act.concat([b]) )
        let outputs = [ (new Value ()).tanh(sum) ]
        parameters.push(b)
        super(outputs,inputs,parameters)
    }
}

export class Layer extends NetValue.ROCKS({}) {
    constructor(nIn,nOut, inputs=undefined) {
        inputs ??=  Array(nIn).fill(0).map((a,i)=>new Value(0,'in'+i))
        let [outputs, parameters]= [[],[]]
        for (let i=0;i<nOut;i++) {
            let neuron = new Neuron(nIn,inputs)
            outputs[i] = neuron.outputs
            parameters[i] = neuron.parameters
        }
        [outputs, inputs, parameters] = [outputs, inputs, parameters].map(aS => aS.flat() )
        super(outputs,inputs,parameters)
    }
}

export class MLP extends NetValue.ROCKS({}) {
    constructor(nIn,nOuts, inputs=undefined) {
        inputs ??=  Array(nIn).fill(0).map((a,i)=>new Value(0,'in'+i))
        let sz = [nIn].concat(nOuts)
        let parameters = []
        // this.layers = []
        let curSlice = inputs
        for (let i=0;i<nOuts.length;i++) {
            let layer = new Layer(sz[i],sz[i+1],curSlice)
            parameters[i] = layer.parameters
            curSlice = layer.outputs
        }
        super(curSlice,inputs,parameters.flat())
        this.topology.forEach(v => v.t = undefined)
        this.inputs.forEach(v => v.t = 'input')
        this.parameters.forEach(v => v.t = 'param')
        this.outputs.forEach(v => v.t = 'output')
    }
}

export const simple1 = ( () => {
    let a = new Value ( 5,'a')
    let b = new Value (-3,'b')
    let c = new Value (10,'c')
    let e = (new Value(0,'e')).mul(a,b)
    let d = (new Value(0,'d')).sum([e,c]) 
    let f = new Value (-2,'f')
    let L = (new Value(0,'L')).mul(d,f)

    let nv = new NetValue([L])
    nv.step()
    return nv
})()

export const simple2 = ( () => {
    // inputs x1,x2
    let x1 = new Value(2,'x1')
    let x2 = new Value(0,'x2')
    // weights w1,w2
    let w1 = new Value(-3,'w1')
    let w2 = new Value(1,'w2')
    // bias of the neuron
    let b = new Value(6.88,'b')
    // x1*w1 + x2*w2 + b
    let x1w1 = (new Value(0,'x1*w1')).mul(x1,w1)
    let x2w2 = (new Value(0,'x2*w2')).mul(x2,w2) 
    let x1w1x2w2 = (new Value(0,'x1*w1 + x2*w2')).sum([x1w1,x2w2])
    let n = (new Value(0,'n')).sum([x1w1x2w2,b])
    let o = (new Value(0,'o')).tanh(n)

    let nv = new NetValue([o],[],[w1,w2,b])
    nv.step()
    return nv
})()

export const simple3 = ( () => {
    let a = new Value(-2,'a')
    let b = new Value( 3,'b')
    let d = (new Value(0,'d')).mul(a,b)
    let e = (new Value(0,'e')).sum([a,b])
    let f = (new Value(0,'f')).mul(d,e)
    let x = new Value(35, 'x');
    let nv = new NetValue([f, x])
    nv.step()
    return nv
})()

export const simple4 = ( () => {
    let n = new Neuron(3)
    n.use([1,2,3])
    // console.log(n)
    return n
})()

export const simple5 = ( () => {
    let l = new Layer(2,2)
    l.use([-1,1])
    return l
})()

export const simple6 = ( () => {
    let n = new MLP(3, [2, 2])
    n.use([2.0, 3.0, -1.0])
    return n
})()

let n = new MLP(3, [4, 1])
let xs = [ [2.0, 3.0, -1.0], [3.0, -1.0, 0.5], [0.5, 1.0, 1.0], [1.0, 1.0, -1.0] ]
let ys = [1.0, -1.0, -1.0, 1.0] // desired targets


// let yPred = xs.map(x=> ) [n(x) for x in xs]

