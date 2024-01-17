
export class Value extends ROCKS({
    get digraph() {
        let toIcon= (l)=> (l == '+') ? 'icons:add-circle-outline' 
                        : (l == '*') ? 'icons:highlight-off'
                        : (l == 'tanh') ? 'carbon:letter-tt'
                        : (l == '') ? '' 
                        : 'icons:error'

        let rez = {data:[], xMax:0, yMax:0, m:{}, n: new Map() }
        let addBl = (el, y) => {
            if (rez.n.get(el)==undefined) {
                rez.m[y]??=0
                rez.m[y]++
                rez.n.set(el,rez.data.length)
                let obj = {
                    is: "oda-button", x:rez.m[y], y, 
                    props: { label: el.labStr },
                    pins: {
                        top: [{}],
                        bottom: [{
                            bind: el.children.map( (v,i) => { return { block: v, top: 0 } }),
                            props: { icon: toIcon(el.op) }
                        }]
                    }
                }
                rez.xMax = Math.max(rez.xMax,obj.x)
                rez.yMax = Math.max(rez.yMax,obj.y)
                rez.data.push(obj)
            
                el.children.forEach((c, i) => addBl(c, obj.y+1))
            }
        }
        addBl(this,0)
        let [dX, dY] = [110, 130]
        rez.data.forEach(bl=> {
            bl.x = ( (2*bl.x-1) / rez.m[bl.y] ) * rez.yMax * dX
            bl.y = (bl.y+0.1) * dY            
            bl.pins.bottom[0].bind.forEach(b => b.block =  rez.n.get(b.block))
        } )

        return rez.data
    },
    get labStr() {
        return this.label + ' | data: ' + this.data.toFixed(2) + ' | grad: ' + this.grad.toFixed(2) 
    }
})
{
    children=[]
    op=''
    label=''
    constructor(data, children=[], op='', label='') {
        super();
        this.data = data
        this.grad = 0
        this.backward = () => {}
        this.children = children
        this.op=op
        this.label=label
    }
    add(other) {
        let out = new Value((this.data + other.data), [this,other], '+')
        out.backward = () => {
            this.grad += 1.0 * out.grad
            other.grad += 1.0 * out.grad
        }
        return out
    }
    mul(other) {
        let out = new Value((this.data * other.data), [this,other], '*')
        out.backward = () => {
            this.grad += other.data * out.grad
            other.grad += this.data * out.grad
        }
        return out
    }
    tanh() {
        let t = (Math.exp(2*this.data) - 1)/(Math.exp(2*this.data) + 1)
        let out = new Value(t, [this], 'tanh')
        out.backward = () => {
            // console.log(this.grad,(1 - t**2) * out.grad)
            this.grad += (1 - t**2) * out.grad
            // console.log(this.grad)
        }
        return out
    }
    backwardGo() {
        let topo = []
        let viseted = new Set()
        let build_topo = (v) => {
            if (!viseted.has(v)) {
                viseted.add(v)
                v.children.forEach(ch => build_topo(ch))
                topo.push(v)
            }
            // else console.log('!!!!!!')
        }
        build_topo(this)

        this.grad = 1.0
        topo.reverse().forEach(node => {
            node.backward()
        })
    }
}

export class Neuron {
    constructor(nIn) {
        // super();
        this.b = new Value (2*(Math.random()-0.5))
        this.w = []
        for (let i=0;i<nIn;i++) this.w[i] = new Value (2*(Math.random()-0.5))
    }
    use (xs) {
        if (this.w.length != xs.length) console.error(`Не та размерность. Входов нейрона: ${this.w.length}. Подаем ${xs.length}.` )
        else {
            let act = this.w.map( (w,i) => (w).mul(xs[i])  )
            return act.reduce((akk,cur) => (akk).add(cur), this.b ).tanh()
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
    parameters() { return this.neurons.map(n => n.parameters(xs))}
}

export class MLP {
    constructor(nIn,nOuts) {
        let sz = [nIn].concat(nOuts)
        this.layers = []
        for (let i=0;i<nOuts.length;i++) this.layers[i] = new Layer(sz[i],sz[i+1])
    }
    use(xs) {
        return this.layers.reduce((akk,cur)=>cur.use(akk),xs)
    }
}


export const simple1 = ( () => {
    let a = new Value ( 5); a.label = 'a'
    let b = new Value (-3); b.label = 'b'
    let c = new Value (10); c.label = 'c'
    let e = (a).mul(b); e.label = 'e'
    let d = (e).add(c); d.label = 'd'
    let f = new Value (-2); f.label='f'
    let L = (d).mul(f); L.label = 'L'
    return L
})()

export const simple2 = ( () => {
    // inputs x1,x2
    let x1 = new Value(2); x1.label='x1'
    let x2 = new Value(0); x2.label='x2'
    // weights w1,w2
    let w1 = new Value(-3); w1.label='w1'
    let w2 = new Value(1); w2.label='w2'
    // bias of the neuron
    let b = new Value(6.88); b.label='b'
    // x1*w1 + x2*w2 + b
    let x1w1 = (x1).mul(w1); x1w1.label = 'x1*w1'
    let x2w2 = (x2).mul(w2); x2w2.label = 'x2*w2'
    let x1w1x2w2 = (x1w1).add(x2w2); x1w1x2w2.label = 'x1*w1 + x2*w2'
    let n = (x1w1x2w2).add(b); n.label = 'n'
    let o = n.tanh(); o.label = 'o'
    return o
})()

export const simple3 = ( () => {
    let a = new Value(-2); a.label='a'
    let b = new Value( 3); b.label='b'
    let d = (a).mul(b); d.label = 'd'
    let e = (a).add(b); e.label = 'e'
    let f = (d).mul(e); f.label = 'f'
    return f
})()

export const simple4 = ( () => {
    let n = new Neuron(6)
    let input = [1,2,3,4,3,3].map(i=> new Value(i))
    return n.use(input)
})()

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

