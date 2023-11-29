export default class MicroBrain extends ROCKS({
    set play(n){
        if (n)
            this.command({type: 'play'});
        else
            this.command({type: 'stop'});
    },
    command(...args){
        this.worker.postMessage(...args);
    },
    get json(){
        return JSON.stringify(this.data, null, 4);
    },
    data: null
}){
    constructor(data ={}) {
        super();
        this.data = data;
    }
    init(){
        this.worker = new Worker('./spike-net/spike-net-ww.js', {type: 'module'});
        this.worker.onmessage = (e)=>{
            switch (e.data?.type){
                case 'spike':{
                    this.spike(e.data.id);
                } break;
                case 'step':{
                    this.steps++;
                } break;
                case 'map':{
                    this.map = e.data.map;
                } break;
                case 'save':{
                    this.save(e.data.data);
                } break;
            }
        }
        this.worker.onmessageerror = (e) =>{
            console.error(e);
        }
        this.worker.postMessage({type: 'load', layers: this.model})
    }
}