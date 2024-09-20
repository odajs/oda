ODA({is: 'oda-loss-chart', template: /*html*/ `
    <h3 ~if='label.length>0'>{{label}}</h3>
    <svg width='100%' :height xmlns='http://www.w3.org/2000/svg' :view-box="'0 0 ' + width + ' ' + height" preserveAspectRatio="none">
        <rect x="0" y="0" :width :height :fill='background'/>
        <path ~for='pointsL' :d='pathD($for.item)' fill="none" :stroke :stroke-width="strokeWidth"/>
    </svg>`,
    data: [],
    width:1000,
    $public: {
        label:'',
        height:300,
        maxPoint:100,
        stroke:"#070637",
        strokeWidth:2,
        background:'#f0f0f0',
        bezier:false,
    },


    get kvo() {return pointsL.length},

    get minMax() {
        let ollP = this.data.flat()
        return  [Math.min(...ollP),Math.max(...ollP)]
    },
    get padding() {return Math.min(this.width,this.height)/10},
    get wh() { return [this.width,this.height].map(x=>x-this.padding*2) },



    pathD(ps){
        let [w,h] = this.wh
        let dx = w/(ps.length-1)
        let [min,max] = this.minMax
        let points = ps.map((v,i)=>[i*dx+this.padding,h-(v-min)/(max-min)*h+this.padding])
        let rez = 'M ' + points[0].join(' ') + ' '
        if (this.bezier) rez+=  'Q ' + points[0].join(' ') + ', ' + points[1].join(' ') + ' '
        else  rez += 'L ' + points[1].join(' ') + ' '
        points.slice(2).forEach(e => rez += (this.bezier?'T ':'L ') + e.join(' ') + ' ' )
        return rez
    },

    get pointsL() {
        if (Array.isArray(this.data[0])) {
            let rez = []
            this.data.forEach(n=>{
                n.forEach((v,k)=> {
                    rez[k] ??= []
                    rez[k].push(v)
                })
            })
            return rez
        }
        else return [this.data]
    }

    // get pointsL() {
    //     let [lL,lP] = [this.data.length,this.maxPoint]
    //     if (lL<lP) return this.data
    //     let newP = Array(lP-1).fill(0).map((_,i)=>{
    //         let idx = Math.floor(i*(lL/(lP-1)))
    //         let dL = Math.floor(lL/(lP-1))+1
    //         return this.data.slice(idx,idx+dL).reduce((a,c)=>a+c)/dL
    //     })
    //     newP.push(this.data[lL-1])
    //     return newP
    // },
    // push(t) {
    //     this.data.push(t);
    // }

})