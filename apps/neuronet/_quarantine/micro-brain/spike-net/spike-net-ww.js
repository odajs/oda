onmessage = function(e){
    switch(e.data?.type){
        case 'load':{
            allLayers = {};
            allSynapses = [];
            if (typeof e.data.net === 'string')
                e.data.net = JSON.parse(e.data.net);
            NET = new SpikeNet(e.data.net);
        } break;
        case 'step':{
            NET.step(e.data.steps || 1);
        } break;
        case 'start':{
            NET.start();
            intervalID = setInterval(()=>{
                postMessage({type: 'save', data: NET.data});
            }, 1000)
        } break;
        case 'stop':{
            NET?.stop();
            clearInterval(intervalID)
            postMessage({type: 'save', data: NET.data});
        } break;
        case 'signal':{
            NET.signal(e.data.id, e.data.val);
            NET.step(1);
        } break;
        case 'params':{
            for (let p in e.data){

            }
        } break;
    }
}
let intervalID;
let NET;
let allLayers = {};
let allSynapses = [];
export default class SpikeNet{
    constructor(data){
        this.data = data;
        this.layers = this.data.items.map(layer => {
            return new Layer(layer);
        })
    }
    step(t){
        // const time = this.time === undefined?1.0:(Date.now() - this.time)
        // this.time = Date.now();
        // const count = t || time/step;
        // for (let i = 0; i<count; i++){
            for (let layer of this.layers){
                layer.step();
            }
            for (let synapse of allSynapses){
                synapse.step();
            }
            postMessage({type: 'step'});
        // }
    }
    stop(){
        this.play = false;
    }
    start(){
        this.play = true;
        this.run();
    }
    run(){ // Начало работы
        if (!this.play) return;
        this.step();
        setTimeout(()=>{
            this.run();
        })
    }
    signal(id, val){
        this.neuroMap[id].signal(val);
    }
}
class Layer{
    layers = []
    neurons = []
    constructor(data) {
        this.id = data.name;
        allLayers[this.id] = this;
        this.layers = data.items?.map(layer=>{
            return new Layer(layer)
        }) || [];
        for (let link of (data.links || [])) {
            const layer = link.id;
            link.data.forEach((targets, i) => {
                const n = this.neurons[i] ??= new Neuron(this, i);
                n._targets[layer] = targets;
                for (let id in targets) {
                    n.synapses.push(new Synapse(n, layer, id));
                }
            })
        }
    }
    step(){
        for (let n of this.neurons){
            n.step();
        }
        for (let layer of this.layers){
            layer.step();
        }
    }
}

class Neuron {
    ISyn = 0.0 // синаптический ток (pA)
    Vms = -60 // Мембранный потенциал
    Ums = 0 // Вспомогательная переменная
    sign = 1 // Знак спайка: 1 - Активация; -1 - торможение
    IEx = 0
    // get IEx(){ // Приложенный ток (pA)
    //     return Math.random() * IExMax;
    // }
    synapses = []
    _targets = {}
    constructor(layer, id){
        this.layer = layer;
        this.id = id;
    }
    get Vm(){
        return (k * (this.Vms - Vr)*(this.Vms - Vt) - this.Ums + this.IEx + this.ISyn)/Cm;
    }
    get Um(){
        return a * (b * (this.Vms - Vr) - this.Ums);
    }
    signal(val){
        this.IEx = val;
    }
    step(){
        this.active = false;
        const Ums = this.Ums;
        const Vms = this.Vms;
        const Umiz = this.Um;
        const Vmiz = this.Vm;
        this.Ums = Ums + Umiz;
        this.Vms = Vms + Vmiz;
        this.ISyn = 0.0;
        if(Vms > VPeak){
            this.Ums = Ums + d;
            this.Vms = c;
            this.active = true;
            postMessage({type: 'spike', layer: this.layer.id, neuron: this.id});
        }
    }
}
class Synapse{
    value = 1.0;
    xPre = 1.0;
    xTar = 0.0;
    constructor(neuron, layer, id){
        allSynapses.push(this);
        this.neuron = neuron;
        this.layer = layer;
        this.id = id;
    }
    get target(){
        return this['#t'] ??= allLayers[this.layer].neurons[this.id] ??= new Neuron(this, this.id);
    }
    get weight(){
        return this['#w'] ??= this.neuron._targets[this.layer][this.id] * 100;
    }
    set weight(n){
        return this['#w'] = this.neuron._targets[this.layer][this.id] = n / 100;
    }
    step(){
        this.xTar = this.xPre;
        if (this.neuron.active){
            this.value = 1.0;
            this.xPre += 1.0;
        }
        else{
            this.value *= expire_coeff;
            this.xPre = this.xPre/Math.E;
        }
        let w = this.weight;
        if (this.target.active) {
            const delta = Nu * (this.xPre - this.xTar) * Math.pow((maxWeight - w), Mu);
            if (delta){
                w += delta;
                if (w>maxWeight)
                    w = this.weight = maxWeight;
                else if (w<minWeight)
                    w = this.weight = minWeight;
                else
                    this.weight = w;
            }
        }
        this.target.ISyn += this.value * w;
    }
}

const minWeight = 0.0; // минимальный вес (pA)
const maxWeight = 100.0; // максимальный  вес (pA)
const IExMax = 40.0; // максимальный приложенный к нейрону ток (pA)
const expireTime = 4.0; // Время спадания постсинаптического тока (ms)
const step = .5; // Временной шаг интегрирования (ms)
const expire_coeff = Math.exp(-step/expireTime);
const a = 0.02; // ??? параметр
const b = 0.5; // ??? параметр
const c = -40.0; // значение мембранного потенциала до которого он сбрасывается после спайка (mV)
const d = 100.0; // ??? параметр
const k = 0.5; // ??? параметр
const Vr = -60.0; // ??? параметр
const Vt = -45.0; // ??? параметр
const VPeak = 35.0;  // максимальное значение мембранного потенциала (mV), при котором происходит сброс до значения с
const Cm = 50.0;  // электрическая ёмкость нейрона (pF)
const v0 = -60.0; // начальное значение для мембранного потенциала
let Mu = 2;  //задает зависимость изменения веса синапса от предыдущего веса
let Nu = 0.02 //коэффициент, задающий скорость  изменения  веса  синапса (скорость обучения)