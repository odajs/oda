ODA({is: 'oda-root',
    template:`
        <style>
            :host{
                position: absolute;
                transform-origin: 0 0;
                left: 50%;
                top: 85%;
                width: 10px;
                height: 10px;
                transform: scaleX({{scaleX / 4}}) scaleY(0.35) translateZ(0.1px);
            }

        </style>
        <oda-triangle :ss="size"></oda-triangle>`
    ,
    get time(){
        return (this.elapsed / 500) % 10
    },
    get scaleX(){
        return 1 + (this.time > 5 ? 10 - this.time : this.time) / 10
    },
    elapsed: 0,

    intervalId: 0,
    start: 0,
    size: 1000,
    ready() {
        this.start = new Date().getTime();
        this.intervalId = setInterval(() => this.tick(), this.fun?50:1000);
    },
    attached() {
        setInterval(()=>{
            this.elapsed = new Date().getTime() - this.start;
        })
    },
    tick() {
        this.seconds = this.seconds % 10 + 1;
    },
    $public:{
        $pdp: true,
        seconds: 1,
        fun: {
            $pdp: true,
            $def: false,
            set(n){
                clearInterval(this.intervalId);
                this.intervalId = setInterval(() => this.tick(), this.fun?50:1000);
            }
        }
    }
});


ODA({is: 'oda-triangle',
    template:`
        <oda-dot ~for="dots" :item="$for.item" :n="$for.index"></oda-dot>`
    ,
    $pdp:{
        sizeCoefficient: 1.1,
        size: 20,
        get s(){
            return this.size * this.sizeCoefficient;
        }
    },
    targetSize: 25,
    x: 0,
    y: 0,
    ss: {
        // $def: 1000,
        set(n){
            this.dots = [];
            this.triangle({
                x: this.x,
                y: this.y - (n / 2),
                s: n,
                seconds: this.seconds
            });
        }
    },
    dots: {
        // $freeze: true,
        $def: []
    },
    // ready() {
    //     this.triangle({
    //         x: this.x,
    //         y: this.y - (this.s / 2),
    //         s: this.s,
    //         seconds: this.seconds
    //     });
    // },
    triangle(props) {
        let s = props.s;
        if (s <= this.targetSize) {
            let dot = { x: props.x - (this.targetSize / 2), y: props.y - (this.targetSize / 2), size: this.targetSize, seconds: props.seconds, };
            this.dots.push(dot);
            return;
        }

        s = s / 2;

        this.triangle({ x: props.x, y: props.y - (s / 2), s: s, seconds: props.seconds });
        this.triangle({ x: props.x - s, y: props.y + (s / 2), s: s, seconds: props.seconds });
        this.triangle({ x: props.x + s, y: props.y + (s / 2), s: s, seconds: props.seconds });
    }
});
ODA({is: 'oda-dot',
    template:`
        <style>
            :host{
                position: absolute;
                /*background-color: #61dafb;*/
                font: normal 16px sans-serif;
                text-align: center;
                cursor: pointer;
                border-radius: 50%;
            }
            :host(:hover){
                background-color: #ff0;
            }
        </style>
        <style>
            :host{
                width: {{s}}px;
                height: {{s}}px;
                left: {{item.x}}px;
                top: {{item.y}}px;
                background-color: {{fun?RandomColor:'#61dafb'}};
                color: {{fun?'white':'black'}};
                padding: 20%;
            }
        </style>
        <div @mouseover="hover=true" @mouseout="hover=false">{{hoverableText}}</div>
    `
    ,
    item: {},
    hover: false,
    get hoverableText(){
        return this.hover ? `*${this.seconds}*` : this.seconds;
    },

    get RandomColor() {
        this.hoverableText;
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
