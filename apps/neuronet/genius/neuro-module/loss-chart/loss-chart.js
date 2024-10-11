ODA({
    is: 'oda-loss-chart', template: /*html*/ `
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
            <path class="lines" ~for='line_count' :d='lines[$for.index]' fill="none" :stroke='lineColor($for.index)' />
            <path ~for='granLine' :d='$for.item' fill="none" stroke='#fff' stroke-width="0.8"/>
            <text :x="padding+3" :y="padding-2" class='small' >max: {{minMax[1]}}</text>
            <text :x="padding+3" :y="height-padding+13" class='small' >min: {{minMax[0]}}</text>
        </svg>
    </div>
    <ul class='legend' >
        <li ~for='lines.length' ~style='"color:"+lineColor($for.index)+";"'> {{legendText($for.index)}} </li>
    </ul>
    `,

    data: [],
    width: 600,
    height: 400,
    $public: {
        label: '',
        strokeWidth: 2,
        bezier: 0,
        legend: [],
        nHorizontal: 5,
    },

    _resize(e) {
        let svgBox = this.$('.svgbox');
        this.width = svgBox.offsetWidth
        this.height = svgBox.offsetHeight
    },

    get line_count(){
        return this.data?.reduce((r,v)=>{
            const size = v?.length || 1
            return r<size?size:r
        },0)
    },
    get lines(){
        let lines = new Array(this.line_count).fill(0).map(_=>new Object)
        this.data?.forEach((s,x)=> {
            s = s.length?s:[s]
            s.forEach((v,n_l)=> {
                if (Number.isFinite(v)) lines[n_l][x]=v
            })
        })
        return lines.filter(o => Object.keys(o).length>1).map(o=> {
            let points = Object.entries(o).map(p => this.trP(p))
            return points.map((p,i,ps)=>{
                if (i==0) return `M ${p[0]} ${p[1]}`
                else if (this.bezier>0) {
                    let p_ = ps[i-1], d = (p[0] - p_[0])*(-2/(this.bezier/10+1) +2);
                    return `C ${p_[0]+d} ${p_[1]}, ${p[0]-d} ${p[1]}, ${p[0]} ${p[1]}`
                }
                else return `L ${p[0]} ${p[1]}`
            }).join(' ')
        } )
    },

    get granLine() {
        let [p, h, w] = [this.padding, this.height, this.width]
        return [[0, p, w, p], [0, h - p, w, h - p], [p, 0, p, h], [w - p, 0, w - p, h]].map(([x1, y1, x2, y2]) => `M ${x1} ${y1} L ${x2} ${y2}`)
    },
    // pathGrid(k, b) {
    //     return `M ${0} ${k * this.wh[1] + this.padding} L ${this.width} ${k * this.wh[1] + this.padding}`
    // },

    // lineLevels(n, a, b) {
    //     let c = Math.abs(a - b) / n // абсолютный шаг
    //     let l = 10 ** Math.floor(Math.log10(c)) // степень округления
    //     let [f, g] = [Math.trunc(a / l) * l, Math.round(c / l) * l] // круглое начало и круглый шаг
    //     let rez = new Array(2 * n).fill(0).map((_, i) => f + i * g).filter(d => (d >= a) && (d <= b)) // результат
    //     return rez
    // },

    get minMax() {
        let ollP = this.data.flat().filter(Number.isFinite)
        return [Math.min(...ollP), Math.max(...ollP)]
    },
    get padding() { return Math.min(this.width, this.height) / 15 },
    get wh() { return [this.width, this.height].map(x => x - this.padding * 2) },

    lineColor(i) {
        let c = Math.floor(360 / this.line_count * i) + 100
        return `hsl(${c}, 100%, 80%)`
    },
    legendText(i) {
        return this.legend[i] || `line № ${i}`
    },
    trP([x, y]) {
        let [[w, h],[min, max], p] = [this.wh, this.minMax, this.padding]
        let dx = w / (this.data.length-1)
        return [x * dx + p, h - (y - min) / (max - min) * h + p]
    },


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