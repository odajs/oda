
export class Value extends ROCKS({
    get digraph() {
        let toIcon= (l)=> (l == 'sum') ? 'icons:add-circle-outline' 
                        : (l == 'mul') ? 'icons:highlight-off'
                        : (l == 'tanh') ? 'carbon:letter-tt'
                        : (l == '') ? '' 
                        : 'icons:error'

        let rez = {data:[], xMax:0, yMax:0, m:{}, n: new Map() }
        let addBl = (el, y) => {
            if (rez.n.get(el)==undefined) {
                rez.m[y]??=0
                rez.m[y]++
                rez.n.set(el,rez.data.length)
                // let bottom = (el.children.length)?
                let bind = el.children.map( (v,i) => { return { block: v, top: 0 } })
                let obj = {
                    is: "oda-ag-value", x:rez.m[y], y, 
                    props: { el },
                    pins: {
                        top: [{}],
                        bottom: (bind.length)? [{ bind, props: { icon: toIcon(el.op) } }]:[]
                    }
                }
                rez.xMax = Math.max(rez.xMax,obj.x)
                rez.yMax = Math.max(rez.yMax,obj.y)
                rez.data.push(obj)
            
                el.children.forEach((c, i) => addBl(c, obj.y+1))
            }
        }
        addBl(this,0)
        let [dX, dY] = [100, 130]
        rez.data.forEach(bl=> {
            bl.x = ( (2*bl.x-1) / rez.m[bl.y] ) * rez.xMax * dX
            bl.y = (bl.y+0.1) * dY
            if (bl.pins.bottom.length)          
                bl.pins.bottom[0].bind.forEach(b => b.block =  rez.n.get(b.block))
        } )
        // rez.data[0].pins.top=[]
        console.log(rez)
        return rez.data
    },
    get labStr() {
        return this.label + ' | data: ' + this.data.toFixed(2) + ' | grad: ' + this.grad.toFixed(2) 
    },
    get topology() {
        let topology = []
        let visited = new Set()
        let buildTopology = (v) => {
            if (!visited.has(v)) {
                visited.add(v)
                v.children.forEach(ch => buildTopology(ch))
                topology.push(v)
            }
        }
        buildTopology(this)
        return topology
    }
})
{
    children=[]
    op=''
    label=''
    _backward = () => {}
    _forward = () => {}
    grad = 0
    constructor(data=0, label='', t=undefined) {
        super();
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
    backward() { 
        this.grad = 1.0
        this.topology.reverse().forEach(node => node._backward() )
    }
    forward() { this.topology.forEach(node => {
        node.grad = 0
        node._forward()
    } )  }
    step() { this.forward() ; this.backward()  }
}

export class Neuron {
    constructor(nIn) {
        // super();
        this.b = new Value (2*(Math.random()-0.5),'b','param')
        this.w = []
        for (let i=0;i<nIn;i++) this.w[i] = new Value (2*(Math.random()-0.5),'w'+i,'param')
    }
    use (xs) {
        if (this.w.length != xs.length) console.error(`Не та размерность. Входов нейрона: ${this.w.length}. Подаем ${xs.length}.` )
        else {
            let act = this.w.map( (w,i) => (new Value()).mul(w,xs[i]) )
            let sum = (new Value ()).sum( act.concat([this.b]) )
            return (new Value ()).tanh(sum)
        }
    }
    parameters() { return this.w.concat([this.b]) }
}

export class Layer {
    constructor(nIn,nOut) {
        this.neurons = []
        for (let i=0;i<nOut;i++) this.neurons[i] = new Neuron(nIn)
    }
    use (xs) { return this.neurons.map(n => n.use(xs)) }
    parameters() { return this.neurons.map(n => n.parameters()).flat() }
}

export class MLP {
    constructor(nIn,nOuts) {
        let sz = [nIn].concat(nOuts)
        this.layers = []
        for (let i=0;i<nOuts.length;i++) this.layers[i] = new Layer(sz[i],sz[i+1])
    }
    use(xs) { return this.layers.reduce((akk,cur)=>cur.use(akk),xs) }
    parameters() { return this.layers.map(n => n.parameters()).flat() }
}


export const simple1 = ( () => {
    let a = new Value ( 5,'a')
    let b = new Value (-3,'b')
    let c = new Value (10,'c')
    let e = (new Value(0,'e')).mul(a,b)
    let d = (new Value(0,'d')).sum([e,c]) 
    let f = new Value (-2,'f')
    let L = (new Value(0,'L')).mul(d,f)
    L.step()
    return L
})()

export const simple2 = ( () => {
    // inputs x1,x2
    let x1 = new Value(2,'x1')
    let x2 = new Value(0,'x2')
    // weights w1,w2
    let w1 = new Value(-3,'w1','param')
    let w2 = new Value(1,'w2','param')
    // bias of the neuron
    let b = new Value(6.88,'b','param')
    // x1*w1 + x2*w2 + b
    let x1w1 = (new Value(0,'x1*w1')).mul(x1,w1)
    let x2w2 = (new Value(0,'x2*w2')).mul(x2,w2) 
    let x1w1x2w2 = (new Value(0,'x1*w1 + x2*w2')).sum([x1w1,x2w2])
    let n = (new Value(0,'n')).sum([x1w1x2w2,b])
    let o = (new Value(0,'o')).tanh(n)
    o.step()
    return o
})()

export const simple3 = ( () => {
    let a = new Value(-2,'a')
    let b = new Value( 3,'b')
    let d = (new Value(0,'d')).mul(a,b)
    let e = (new Value(0,'e')).sum([a,b])
    let f = (new Value(0,'f')).mul(d,e)
    f.step()
    return f
})()

export const simple4 = ( () => {
    let n = new Neuron(3)
    let input = [1,2,3].map((x,i)=> new Value(x,'x'+i))
    let rez = n.use(input)
    rez.step()
    return rez
})()
/*
export const simple5 = ( () => {
    let l = new Layer(2,2)
    let input = [-1,1].map(i=> new Value(i))
    let rez = l.use(input)
    return (rez[0]).add(rez[1])
})()

export const simple6 = ( () => {
    let input = [2.0, 3.0, -1.0].map(i=> new Value(i))
    let n = new MLP(3, [4, 1])
    let rez = n.use(input)[0]
    return rez
})()

// let n = new Neuron(6)
// console.log(n.parameters())
// let l = new Layer(2,2)
// console.log(l.parameters())
// let m = new MLP(3, [4, 1])
// console.log(m.parameters())

let n = new MLP(3, [4, 1])
let xs = [ [2.0, 3.0, -1.0], [3.0, -1.0, 0.5], [0.5, 1.0, 1.0], [1.0, 1.0, -1.0] ]
let ys = [1.0, -1.0, -1.0, 1.0] // desired targets

// let yPred = xs.map(x=> ) [n(x) for x in xs]

*/