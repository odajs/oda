ODA({is: 'oda-loss-chart', template: /*html*/ `
    <style>
        :host {
            @apply --vertical;
        }
        h3 {
            padding-left:40px;
        }
        .small {
            font-size:14px; font-family: monospace;
        }
        .x {
            font-size:10px; fill:#000;
        }
        .lines{
            stroke-width: {{strokeWidth}};
        }
        .svgbox {
            overflow:hidden;
            height:350px;
        }
    </style>
    <h3  ~if='label.length>0'>{{label}}</h3>
    <div class='svgbox' flex @resize="_resize">
        <svg   xmlns='http://www.w3.org/2000/svg' :view-box="'0 0 ' + width + ' ' + height" preserveAspectRatio="none">
            <rect x="0" y="0" :width :height fill='var(--dark-background)'/>
 <!--
            <g ~for='lineLevels(nHorizontal,minMax[0],minMax[1])' class='gridX'>
                <path :d='pathGrid($for.item,0)' fill="none" stroke='#000' stroke-width="0.4"/>
               <text :x="0" :y="$for.item*wh[1]+padding" class='small x' >{{$for.item}}</text>
            </g> -->
            <path class="lines" ~for='pointsL' ~if='$for.item.length>1' :d='pathD($for.item)' fill="none" :stroke='lineColor($for.index)' />
            <path ~for='granLine' ~if='kvo>1' :d='$for.item' fill="none" stroke='#fff' stroke-width="0.8"/>
            <text :x="padding+3" :y="padding-2" class='small' >max: {{minMax[1]}}</text>
            <text :x="padding+3" :y="height-padding+13" class='small' >min: {{minMax[0]}}</text>
        </svg>
    </div>
    <ul class='legend' >
        <li ~for='pointsL' ~style='"color:"+lineColor($for.index)+";"'> {{legendText($for.index)}} </li>
    </ul>
    `,
    _resize(e){
        // console.log(e)
        let svgBox = this.$('.svgbox');
        let [width,height] =  [svgBox.offsetWidth,svgBox.offsetHeight]
        this.width = width
        this.height = height

    },
    sss:[1],
    data: [],
    width:600,
    height:400,
    $public: {
        label:'',
        strokeWidth:2,
        bezier:false,
        legend:[],
        nHorizontal:5,
    },
    get granLine() {
        let [p, h, w] = [this.padding, this.height, this.width]
        return [[0,p,w,p], [0,h-p,w,h-p], [p,0,p,h], [w-p,0,w-p,h] ].map(([x1,y1,x2,y2])=>`M ${x1} ${y1} L ${x2} ${y2}`)
    },
    pathGrid(k,b) {
       return `M ${0} ${k*this.wh[1]+this.padding} L ${this.width} ${k*this.wh[1]+this.padding}`
    },

    lineLevels(n,a,b){
        let c = Math.abs(a-b)/n // абсолютный шаг
        let l = 10**Math.floor(Math.log10(c)) // степень округления
        let [f,g] = [Math.trunc(a/l)*l, Math.round(c/l)*l] // круглое начало и круглый шаг
        let rez = new Array(2*n).fill(0).map((_,i)=> f+i*g).filter(d=> (d>=a)&&(d<=b)) // результат
        return rez
    },

    get kvo() {return this.pointsL[0].length},

    get minMax() {
        let ollP = this.data.flat().filter(a=>(a==(1+a-1))&&(a!=a+1) )
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
        let pss = []
        ps.forEach(a=>{
            if (a == Infinity) pss.push(max+0.15*(max-min))
            else if ((a==NaN)|| (a==null)) pss.push(min-0.15*(max-min))
            else if ((a==(1+a-1))&&(a!=a+1)) pss.push(a)
            else pss.push( (max + min)/2 )
        })
        let points = pss.map((v,i)=>[i*dx+this.padding,h-(v-min)/(max-min)*h+this.padding])
        let rez = 'M ' + points[0].join(' ') + ' '
        if (this.bezier) rez+=  'Q ' + points[0].join(' ') + ', ' + points[1].join(' ') + ' '
        else  rez += 'L ' + points[1]?.join(' ')  + ' '
        points.slice(2).forEach(e => rez += (this.bezier?'T ':'L ') + e.join(' ') + ' ' )
        return rez
    },

    get pointsL() {
        if (Array.isArray(this.data[0])) {
            this.data.forEach(n=>{
                console.log(n)
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