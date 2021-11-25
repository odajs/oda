import '../../oda.js';
ODA({is: 'oda-root', template:`
    <div ~style="style">
        <div>
            <oda-triangle :s="size" :seconds></oda-triangle>
        </div>
    </div>`,
    props: {
        containerStyle: {
            type: Object,
            default: { position: 'absolute', transformOrigin: '0 0', left: '50%', top: '85%', width: '10px', height: '10px', background: '#eee' }
        },
        transform: {
            get() {
                return `scaleX(${this.scaleX / 4}) scaleY(0.35) translateZ(0.1px)`
            }
        },
        time: {
            get() {
                return (this.elapsed / 500) % 10
            }
        },
        scaleX: {
            get() {
                return 1 + (this.time > 5 ? 10 - this.time : this.time) / 10
            }
        },
        style: {
            get() {
                return { ...this.containerStyle, transform: this.transform }
            }
        },
        elapsed: 0,
        seconds: 1,
        intervalId: 0,
        start: Date,
        size: 1000
    },
    ready() {
        this.start = new Date().getTime();
        this.intervalId = setInterval(() => this.tick(), 1000);
    },
    attached() {
        const update = () => {
            this.elapsed = new Date().getTime() - this.start;
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    },
    tick() {
        this.seconds = this.seconds % 10 + 1;
    }
});

ODA({is: 'oda-dot', template:`
    <div ~style="style" @mouseover="hover=true" @mouseout="hover=false">{{hoverableText}}</div>`,
    props: {
        dotStyle: {
            type: Object,
            default: { position: "absolute", background: "#61dafb", font: "normal 16px sans-serif", textAlign: "center", cursor: "pointer" }
        },
        sizeCoefficient: 1.3,
        size: 25,
        x: 0,
        y: 0,
        seconds: '1',
        hover: false,
        hoverableText: {
            get() {
                return this.hover ? `*${this.seconds}*` : this.seconds;
            }
        },
        style: {
            get() {
                const s = this.size * this.sizeCoefficient;
                return {
                    ...this.dotStyle,
                    width: s + "px",
                    height: s + "px",
                    left: this.x + "px",
                    top: this.y + "px",
                    borderRadius: '50%',
                    lineHeight: s + "px",
                    background: this.hover ? "#ff0" : this.dotStyle.background
                };
            }
        }
    }
});

ODA({is: 'oda-triangle', template:`
    <oda-dot ~for="d in dots" :seconds :x="d.x" :y="d.y" :size="d.size"></oda-dot>`,
    props: {
        targetSize: 25,
        seconds: 0,
        x: 0,
        y: 0,
        s: {
            default:1000,
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
        dots: []
    },
    ready() {
        this.triangle({
            x: this.x,
            y: this.y - (this.s / 2),
            s: this.s,
            seconds: this.seconds
        });
    },
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