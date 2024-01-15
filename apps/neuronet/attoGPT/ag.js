
export class Value extends ROCKS({
    get digraph() {
        
        // let rez = []

        let toIcon= (l)=> (l == '+') ? 'icons:add-circle-outline' 
                        : (l == '*') ? 'icons:highlight-off'
                        : (l == 'tanh') ? 'carbon:letter-tt'
                        : (l == '') ? '' 
                        : 'icons:error'

        let rez = {data:[], xMax:0, yMax:0, m:{}, n:{} }
        let addBl = (el, y) => {
            rez.m[y]??=0
            rez.m[y]++
            rez.n[el.label]=rez.data.length
            let obj = {
                is: "oda-button", el, x:rez.m[y], y, 
                props: { label: el.labStr },
                pins: {
                    top: [{}],
                    bottom: [{
                        bind: el.children.map( (v,i) => { return { block: v.label, top: 0 } }),
                        props: { icon: toIcon(el.op) }
                    }]
                }
            }
            rez.xMax = Math.max(rez.xMax,obj.x)
            rez.yMax = Math.max(rez.yMax,obj.y)
            rez.data.push(obj)
        
            el.children.forEach((c, i) => addBl(c, obj.y+1))
        }
        addBl(this,0)

        // let addBl = (el, xL, yL) => {
        //     console.log()
        //     rez.push( {
        //         is: "oda-button", block: el.label, x: xL * dX, y: yL * dY,
        //         props: { label: el.labStr },
        //         pins: {
        //             top: [{}],
        //             bottom: [{
        //                 bind: el.children.map( (v,i) => { return { block: v.label, top: 0 } }),
        //                 props: { icon: toIcon(el.op) }
        //             }]
        //         }
        //     })

        //     el.children.forEach((c, i) => addBl(c, xL - 1 + (2 * i), yL + 1))
        // }
        // addBl(this, 4, 0.1)

        //console.log(rez)
        // let mapCorr = rez.reduce((akk,cur,i)=>{ akk[cur.block]=i; return akk},{})

        let [dX, dY] = [120, 120]

        console.log(rez)

        rez.data.forEach(bl=> {
            bl.x = ( (2*bl.x-1) / rez.m[bl.y] ) * rez.yMax * dX
            bl.y = (bl.y+0.1) * dY            
            bl.pins.bottom[0].bind.forEach(b => b.block =  rez.n[b.block])
        } )
        
        console.log(rez)


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
        this.backward = () => undefined
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
            this.grad += (1 - t**2) * out.grad
        }
        return out
    }

}

// console.log('ss')
export const simple1 = ( () => {
    let a = new Value (5); a.label = 'a'
    let b = new Value (-3); b.label = 'b'
    let c = new Value (10); c.label = 'c'
    let e = (a).mul(b); e.label = 'e'
    let d = (e).add(c); d.label = 'd'
    let f = new Value(-2); f.label='f'
    let L = (d).mul(f); L.label = 'L'
    return L
})()
// console.log(L)

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

console.log(simple2)

let rez = {data:[], xMax:0, yMax:0, m:{}, n:{} }
let recur = (el, y) => {
    rez.m[y]??=0
    rez.m[y]++
    rez.n[el.label]=rez.data.length
    let obj = {id:el.label, x:rez.m[y], y:y+1, i:rez.data.length}
    rez.xMax = Math.max(rez.xMax,obj.x)
    rez.yMax = Math.max(rez.yMax,obj.y)
    rez.data.push(obj)

    el.children.forEach((c, i) => recur(c, obj.y))



}
recur(simple2,0)
console.log(rez)