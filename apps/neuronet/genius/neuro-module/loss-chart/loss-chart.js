ODA({is: 'oda-loss-chart', template: /*html*/ `
    <h3 ~if='label.length>0'>{{label}}</h3>
    <svg class='box' :width :height xmlns='http://www.w3.org/2000/svg' :viewBox="'0 0 ' + width + ' ' + height">
        <rect x="0" y="0" :width :height :fill='background'/>
        <path :d='pathD' fill="none" :stroke :stroke-width="strokeWidth"/>
    </svg>`,
    $public: {
        label:'',
        width:1000,
        height:300,
        maxPoint:100,
        stroke:"#070637",
        strokeWidth:2,
        background:'#a9caff',
        bezier:false,
    },
    get pathD(){
        if (this.pointsL.length<2) return ''
        let padding = Math.min(this.width,this.height)/10
        let [w,h] = [this.width,this.height].map(x=>x-padding*2)
        let dx = w/(this.pointsL.length-1)
        let [min,max] = [Math.min(...this.pointsL),Math.max(...this.pointsL)]
        let points = this.pointsL.map((v,i)=>[i*dx+padding,h-(v-min)/(max-min)*h+padding])
        let rez = 'M ' + points[0].join(' ') + ' '
        if (this.bezier) rez+=  'Q ' + points[0].join(' ') + ', ' + points[1].join(' ') + ' '
        else  rez += 'L ' + points[1].join(' ') + ' '
        points.slice(2).forEach(e => rez += (this.bezier?'T ':'L ') + e.join(' ') + ' ' )
        return rez
    },
    get pointsL() {
        let [lL,lP] = [this.data.length,this.maxPoint]
        if (lL<lP) return this.data
        let newP = Array(lP-1).fill(0).map((_,i)=>{
            let idx = Math.floor(i*(lL/(lP-1)))
            let dL = Math.floor(lL/(lP-1))+1
            return this.data.slice(idx,idx+dL).reduce((a,c)=>a+c)/dL
        })
        newP.push(this.data[lL-1])
        return newP
    },
    data:[],
    push(t) {this.data.push(t)}

})