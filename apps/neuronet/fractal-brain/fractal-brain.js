export class FractalNetItem extends ROCKS({
    get i(){
        return this.data[1]
    },
    get o(){
        return this.data[0]
    },
    get layer(){
        if (this.isStart)
            return 0;
        return this.owner.layer + 1;
    },
    get neurons() {
        const neurons = this.children.map(s=>{
            return s.neurons;
        }).flat();
        neurons.unshift(this);
        return neurons;
    },
    get brain(){
        return this.owner?.brain || this;
    },
    get children(){
        return this.item.filter((i, idx)=>idx).map(s=>{
            return new this.constructor.childCtor(s, this);
        })
    },
    get inValue(){
        return this.i[0];
    },
    set inValue(n){
        if (this._lock_in) return;
        this._lock_in = true;
        this.i[0] = n;
        if (this.isStart){
            if (n)
                activateOut.call(this.alter);
        }
        this.asyncIn ??= ()=>{
            if (!this.isStart)
                activateIn.call(this.owner);
            this.inValue = 0;
            this._lock_in = false;
        }
        this.brain.throttle(this.side + this.layer + '-i', this.asyncIn, this.brain.delay)
    },
    get outValue(){
        return this.o[0];
    },
    set outValue(n){
        if (this._lock_out) return;
        this._lock_out = true;
        this.o[0] = n;
        if (this.isEdge){
            if (n)
                this.inValue = n / 2.7;
        }
        this.asyncOut ??= ()=>{
            for (let i of this.children){
                activateOut.call(i);
            }
            this.outValue = 0;
            this._lock_out = false;
        }
        this.brain.throttle(this.side + this.layer + '-o', this.asyncOut, this.brain.delay)
    }
}){
    static childCtor = FractalNetItem;
    constructor(item, owner) {
        super();
        this.item = item;
        this.owner = owner;
    }
    item = undefined
    get data(){
        if (!this._data)
            this._data =  this.item?.[0];
        return this._data;
    }
}
export class FractalBrainNeuron extends FractalNetItem.ROCKS({
    get isEdge(){
        return !this.children.length;
    },
    get isStart(){
        return this.owner instanceof FractalBrainZone;
    },
    get even(){
        return this.zone.even;
    },
    get zone(){
        return this.owner.zone;
    },

    get alter(){
        const idx = this.zone.children.indexOf(this)
        return this.zone.alter.children[idx];
    }
}){
    static childCtor = FractalBrainNeuron;
    spikes0 = [];
    spikes1 = [];
    get inputs1(){
        if (!this._i1)
            this._i1 =  (!this.isEdge && this.brain.layers[this.even][this.layer + 1] )|| [];
        return this._i1;
    }
    get inputs0(){
        if (!this._i0){
            if (this.isStart){
                this._i0 = this.brain.layers[!this.even][0];
            }
            else{
                this._i0 = this.brain.layers[this.even][this.layer - 1];
            }
        }
        return  this._i0;
    }
}
export class FractalBrainZone extends FractalNetItem.ROCKS({
    get neurons() {
        const neurons = this.children.map(s=>{
            return s.neurons;
        }).flat();
        return neurons;
    },
    get edge(){
        return this.neurons.filter(s=>{
            return s.isEdge;
        });
    },
    get even(){
        return this.owner.children.indexOf(this) === 0;
    },
    get alter(){
        return this.owner.zones.find(i => i !== this)
    },
    get zone(){
        return this;
    }
}){
    static childCtor = FractalBrainNeuron;
    get layers(){
        if (!this._layers){
            this._layers = [];
            let idx = 0;
            let items;
            do{
                items = this.neurons.filter(n=>n.layer === idx);
                if (!items.length)
                    break;
                this._layers.push(items);
                idx++;
            }
            while(true)
        }
        return this._layers;
    }
}
export class FractalBrainSegment extends FractalNetItem.ROCKS({
    get edge(){
        return this.zones.map(s=>{
            return s.edge;
        }).flat();
    },
    get zones(){
        return this.children;
    }
}){
    static childCtor = FractalBrainZone;
}
export class FractalBrain extends FractalNetItem.ROCKS({
    get edge(){
        return this.segments.map(s=>{
            return s.edge;
        }).flat();
    },
    get segments(){
        return this.children;
    },
    neuroPlastic: 100,
    get layers(){
        const layers = {true:[], false:[]};
        for(let s of this.segments){
            for (let z of s.zones){
                for (let i = 0; i<z.layers.length; i++){
                    layers[z.even][i] ??= [];
                    layers[z.even][i].push(...z.layers[i])
                }
            }
        }
        return layers;
    }
}){
    static childCtor = FractalBrainSegment;
    delay = 0;
}
export function buildBrain(scheme = [3]){
    const model = [[[0],[0]]];
    for (let d of scheme){
        const section = [[[0],[0]], [[[0],[0]]], [[[0],[0]]]];
        model.push(section);
        for (let i = 1; i < section.length; i++){
            buildZone.call(section[i], d);
        }
    }
    return model;
}
function buildZone(deep){
    const arr = new Array(1).fill(0).map(i=>{
        return [[[0],[0]]];
    }).map(i=>{
        return buildLayer.call(i, deep)
    })
    this.push(...arr)
    return this;
}
function buildLayer(deep){
    if (deep){
        const arr = new Array(2).fill(0).map(i=>{
            return [[[0],[0]]];
        }).map(i=>{
            return buildLayer.call(i, deep - 1)
        })
        this.push(...arr)
    }
    return this;
}
function activateIn(){
    this.inValue = activateNeuron.call(this, this.inputs1, 1);
}
function activateOut(){
    this.outValue = activateNeuron.call(this, this.inputs0, 0, this.isStart?1:0);
}
function activateNeuron(inputs, target, source = target) {
    let res = 0;
    const preActive = [];
    const preNotActive = [];
    const data = this.data[target]
    for (let i = 1; i <= inputs.length; i++){
        const neuron = inputs[i - 1];
        const preVal = neuron.data[source][0];
        if (preVal){
            if (preVal === 1)
                preActive.push(i);
            res += (data[i] ??= genWeight()) / 1 * preVal;
        }

    }
    if (res){
        res = 1/(1 + Math.exp(-res));
        const spikes = this['spikes' + target];
        if (res > .5){
            res = 1;
            for (let i of preActive){
                let s = (spikes[i] || 0) + 1;
                if (s > this.brain.neuroPlastic){
                    data[i] += 1;
                    s = 0;
                }
                spikes[i]  = s;
            }

        }
        else{
            for (let i of preActive){
                let s = (spikes[i] || 0) - 1;
                if (s < -this.brain.neuroPlastic){
                    data[i] -= 1;
                    s = 0;
                }
                spikes[i]  = s;
            }
        }
    }
    return res;
}
function genWeight(){
    let w = 0;
    while(!w){
        w = Math.round(Math.random() * 10) - 5;
    }
    return w;
}