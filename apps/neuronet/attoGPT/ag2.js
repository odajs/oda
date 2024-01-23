class Value {
    _prev = []
    _backward = () => {}
    grad = 0
    data = 0
    constructor(data=0) {
        this.data = data
    }
    backward() {
        let topology = []
        let visited = new Set()
        let buildTopology = (v) => {
            if (!visited.has(v)) {
                visited.add(v)
                v._prev.forEach(ch => buildTopology(ch))
                topology.push(v)
            }
        }
        buildTopology(this)
        this.grad=1
        topology.reverse().forEach(v => v._backward() )
    }
    typeConversion(v){
        if (v instanceof Value) return v
        if (typeof v == 'number') return new Value(v)
        console.log(v)
        console.error('Ошибка типов!')
    }
    mul(x) {
        let [first,second] = [this, this.typeConversion(x)]
        let rez = new Value( first.data*second.data )
        rez._prev = [first,second]
        rez._backward = () => {
            first.grad += rez.grad * second.data
            second.grad += rez.grad * first.data
        }
        return rez
    }
    sum() {
        let args = [this, ...arguments].map(arg => this.typeConversion(arg))
        let rez = new Value( args.reduce((akk,cur) => akk + cur.data, 0 ) )
        rez._prev = args
        rez._backward = () => { rez._prev.forEach(ch=> ch.grad += 1.0 * rez.grad) }
        return rez
    }
    sub(other) {
        other = this.typeConversion(other)
        let rez = new Value( this.data - other.data)
        rez._prev = [this, other]
        rez._backward = () => {
            this.grad += 1.0 * rez.grad
            other.grad += -1.0 * rez.grad
        }
        return rez
    }
    tanh() {
        let rez = new Value( (Math.exp(2*this.data) - 1)/(Math.exp(2*this.data) + 1) )
        rez._prev = [this]
        rez._backward = () => { this.grad += (1 - rez.data**2) * rez.grad }
        return rez
    }
}

class Neuron extends Function{
    constructor(nIn) {
        super()
        this.w = Array(nIn).fill(0).map(() => new Value(2*(Math.random()-0.5)))
        this.b = new Value (2*(Math.random()-0.5))
        return new Proxy(this, {
            apply(target, _, args) { return target.__call__(...args) }
        })
    }
    __call__(x) {
        let act = this.b.sum(...this.w.map((wi,i)=> wi.mul(x[i])))
        return act.tanh()
    }
    get parameters() { return this.w.concat([this.b]) }
}

class Layer extends Function {
    constructor(nIn,nOut) {
        super()
        this.neurons = Array(nOut).fill(0).map(()=> new Neuron(nIn)) 
        return new Proxy(this, {
            apply(target, _, args) { return target.__call__(...args) }
        })
    }
    __call__(x) { return this.neurons.map( n => n(x) ) }
    get parameters() { return this.neurons.map(n=> n.parameters).flat()  }
}

class MLP extends Function {
    constructor(nIn,nOuts) {
        super()
        let sz = [nIn].concat(nOuts)
        this.layers = []
        for (let i=0;i<nOuts.length;i++) this.layers[i] = new Layer(sz[i],sz[i+1])
        return new Proxy(this, {
            apply(target, _, args) { return target.__call__(...args) }
        })
    }
    __call__(x) { return this.layers.reduce((inPut,layer) => layer(inPut),x ) }
    get parameters() { return this.layers.map(l=> l.parameters).flat() }

}

let net = new MLP(3, [4, 4, 1])
let xs = [ [2.0, 3.0, -1.0], [3.0, -1.0, 0.5], [0.5, 1.0, 1.0], [1.0, 1.0, -1.0] ]
let ys = [1.0, -1.0, -1.0, 1.0] // desired targets

let [nStep, kStep] = [30,-0.1] // kStep -- шаг, отрицательное больше -1

for (let k=0; k<nStep; k++) {
  
    // forward pass
    let yPred = xs.map(x => net(x)) // [n(x) for x in xs]
    let sqrS = yPred.map( (yP,i) => {
        let sub = yP[0].sub(ys[i])
        return sub.mul(sub)
    }) 
    let loss = (new Value(0)).sum(...sqrS)

    // backward pass
    net.parameters.forEach( p => p.grad = 0 )
    loss.backward()
  
    // update
    net.parameters.forEach( p => p.data +=  kStep * p.grad)

    // console.log(k)
    console.log(`step: ${k}, loss: ${loss.data}`)
    console.log(yPred.map(y=>y[0].data.toFixed(2)))
}


// ? simple2 
// // inputs x1,x2
// let x1 = new Value(2)
// let x2 = new Value(0)
// // weights w1,w2
// let w1 = (new Value(0)).sub(3)
// // let w2 = new Value(1)
// // bias of the neuron
// let b = new Value(6.88)
// // x1*w1 + x2*w2 + b
// let x1w1 = x1.mul(w1)
// let x2w2 = x2.mul(1) 
// let x1w1x2w2 = x1w1.sum(x2w2) // необязательно
// let n = b.sum(x1w1,x2w2)
// let o = n.tanh()

// o.backward()
// console.log(o)
// ? end simple2 

