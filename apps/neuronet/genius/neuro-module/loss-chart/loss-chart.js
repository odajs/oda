ODA({is: 'oda-loss-chart', template: /*html*/ `
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            @apply --dark;
        }
        h3 {padding-left:40px;}
        .small {font-size:7px; font-family: monospace;}
    </style>
    <h3  ~if='label.length>0'>{{label}}</h3>
    <svg xmlns='http://www.w3.org/2000/svg' :view-box="'0 0 ' + width + ' ' + height" preserveAspectRatio="none">
        <rect x="0" y="0" :width :height fill='var(--dark-background)'/>
        <path ~for='pointsL' ~if='kvo>1' :d='pathD($for.item)' fill="none" :stroke='lineColor($for.index)' stroke-width="2"/>
        <path id='qqq' ~for='granLine' ~if='kvo>1' :d='$for.item' fill="none" stroke='#fff' stroke-width="0.2"/>
        <text :x="padding-17" :y="padding-1" class='small' >max: {{minMax[1]}}</text>
        <text :x="padding-17" :y="height-padding+7" class='small' >min: {{minMax[0]}}</text>
    </svg>
    <ul class='legend' >
        <li ~for='pointsL' ~style='"color:"+lineColor($for.index)+";"'> {{legendText($for.index)}} </li>
    </li>
    `,

    data: [],
    width:600,
    height:400,
    $public: {
        label:'',
        strokeWidth:{
            $def:2,
            set(v) {
                this.$$('svg path').forEach(el => el.setAttribute('stroke-width',v) )
            }
        },
        bezier:false,
        legend:[],
    },
    get granLine() {
        let [p, h, w] = [this.padding, this.height, this.width]
        return [[0,p,w,p], [0,h-p,w,h-p], [p,0,p,h], [w-p,0,w-p,h] ].map(([x1,y1,x2,y2])=>`M ${x1} ${y1} L ${x2} ${y2}`)
    },

    get kvo() {return this.pointsL.length},

    get minMax() {
        let ollP = this.data.flat()
        return  [Math.min(...ollP),Math.max(...ollP)]
    },
    get padding() {return Math.min(this.width,this.height)/15},
    get wh() { return [this.width,this.height].map(x=>x-this.padding*2) },

    lineColor(i) {
        let c = Math.floor(360/this.kvo*i)+100
        return `hsl(${c}, 100%, 80%)`
    },
    legendText(i) {
        return this.legend[i] || `line № ${i}`
    },

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