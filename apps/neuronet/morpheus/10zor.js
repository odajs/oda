export class Tenzor extends ROCKS({
    $public:{
        data:{
            $freeze: true
        }
    },
    $freeze:{
        get grad(){
            function clone(d){
                if(Array.isArray(d))
                    return d.map(i=>clone(i));
                return 0;
            }
            return clone(this.data);
        }
    },
    get shape(){
        let d = this.data;
        let s = '';
        while(Array.isArray(d) && d.length){
            s += (s?' X ':'') + d.length;
            d = d[0];
        }
        return s;
    }

}){
    constructor(data, children=[], label='tenzor', op='') {
        super();
        this.data = data;
        this.label = label;
        this.op = op;
    }
}
export function tensor(data){
    return new Tenzor(data)
}
const a = tenzor([])