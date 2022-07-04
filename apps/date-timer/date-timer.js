ODA({ is: 'oda-date-timer',
    template: /*html*/`
        <style>
            :host { 
                flex: 1;
                margin: 4px 6px 4px 4px;
                padding: 4px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .row {
                color: blue;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 200px;
                font-size: 20px;
                padding: 1px;
            }
            .lbl {
                color: blue;
                font-size: 16px;
            }
            .box {
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                border: 1px solid darkgray;
                margin: 8px 2px;
                padding: 8px;
                justify-content: space-between;
                align-items: center;
                border-radius: 4px;
                text-align: center;
            }
        </style>
        <div class="vertical box">
            <div style="font-size: 20px; font-weight: 500; color: blue;">{{this.txt}}</div>
            <div style="font-size: 24px; font-weight: 700; color: blue;">{{this.date + ' ' + this.time}}</div>
            <div style="font-size: 20px; font-weight: 500; color: blue;">{{this.txt2}}</div>
        </div>
        <div class="vertical box">
            <oda-date-timer-circle type="day" size="100" font-size="24"></oda-date-timer-circle>
            <div>
                <oda-date-timer-circle type="hour"></oda-date-timer-circle>
                <oda-date-timer-circle type="min"></oda-date-timer-circle>
                <oda-date-timer-circle type="sec"></oda-date-timer-circle>
                <oda-date-timer-circle></oda-date-timer-circle>
            </div>
        </div>
        <div class="vertical box">
            <div class="row"><span class="lbl">секунд: </span>{{this.s}}</div>
            <div class="row"><span class="lbl">минут: </span>{{this.mn}}</div>
            <div class="row"><span class="lbl">часов: </span>{{this.h}}</div>
            <div class="row"><span class="lbl">дней: </span>{{this.d}}</div>
            <div class="row"><span class="lbl">недель: </span>{{this.w}}</div>
            <div class="row"><span class="lbl">месяцев: </span>{{this.m}}</div>
            <div class="row"><span class="lbl">лет: </span>{{this.y}}</div>
        </div>
    `,
    props: {
        txt: {
            default: '',
            save: true
        }, 
        txt2: {
            default: '',
            save: true
        }, 
        date: {
            default: '',
            save: true
        }, 
        time: {
            default: '',
            save: true
        }
    },
    s: 0, mn: 0, h: 0, d: 0, w: 0, m: 0, y: 0, end: 0, today: 0,
    toUpdate: false,
    attached() {
        // this.style.visibility = 'visible'
        this.init();
    },
    init() {
        const url = new URL(document.location.href);
        const date = url.searchParams.get('date');
        const time = url.searchParams.get('time');
        const txt = url.searchParams.get('txt');
        const txt2 = url.searchParams.get('txt2');
        
        this.date = date || this.date || `${(new Date()).getFullYear() + 1}-01-01`;
        this.time = time || this.time || '00:00:00';

        this.today = (new Date()).getTime();
        this.end = (new Date(this.date + 'T' + this.time)).getTime();
        let diff = this.end - this.today;

        this.txt = txt || this.txt || (diff >= 0 ? 'осталось до' : 'прошло с');
        this.txt2 = txt2 || this.txt2 || '';

        setInterval(() => {
            this.today = (new Date()).getTime();
            diff = Math.abs(this.end - this.today);
            this.d = (diff / 1000 / 60 / 60 / 24).toFixed(2);
            this.w = (diff / 1000 / 60 / 60 / 24 / 7).toFixed(2);
            this.m = (diff / 1000 / 60 / 60 / 24 / 30.5).toFixed(2);
            this.y = (diff / 1000 / 60 / 60 / 24 / 365.25).toFixed(2);
            this.toUpdate = !this.toUpdate;
        }, 16)
    },
    observers: [
        function _toUpdate(txt, txt2, date, time) {
            if (this.txt === 'осталось до' || this.txt === 'прошло с') this.txt = '';
            this.init();
        }
    ]
})

ODA({ is: 'oda-date-timer-circle',
    template: /*html*/`
        <canvas id="circle" :width="size" :height="height || size"></canvas>
    `,
    props: {
        type: 'ms',
        size: 80,
        height: 0,
        padding: 8,
        lineWidth: 2,
        lineColor: '#4285f4',
        fontSize: 18,
        fontColor: 'red',
        labelSize: 0,
        labelColor: '',
        label: '',
    },
    attached() {
        this.ctx = this.$('#circle').getContext('2d');
        this.start = 4.72;
        this.cw = this.ctx.canvas.width;
        this.ch = this.ctx.canvas.height;
        this.clock = {
            sec: (t, al, div) => {
                t = t / 1000 | 0; 
                al = t % 60;
                div = 60;
                this.s = t
                return { t, al, div };
            },
            min: (t, al, div) => {
                t = t / 1000 / 60 | 0;
                al = t % 60;
                div = 60;
                this.mn = t;
                return { t, al, div };
            },
            hour: (t, al, div) => {
                t = t / 1000 / 60 / 60 | 0;
                al = t % 24;
                div = 24;
                this.h = t;
                return { t, al, div };
            },
            day: (t, al, div) => {
                al = Math.floor(t / (1000 * 60 * 60 * 24));
                div = 365.25;
                return { t, al, div };
            }
        }
    },
    observers: [
        function _toUpdate(toUpdate, today) {
            if (!this.ctx) return;
            let t = Math.abs(this.end - this.today);
            let al = t % 1000;
            let div = 1000;
            if (this.clock[this.type]) {
                const act = this.clock[this.type](t, al, div);
                t = act.t; al = act.al; div = act.div;
            }
            const diff = ((al / div) * Math.PI * 2 * 10).toFixed(2);
            this.ctx.clearRect(0, 0, this.cw, this.ch);
            this.ctx.strokeStyle = this.lineColor;
            this.ctx.lineWidth = this.lineWidth;
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = this.fontColor;
            this.ctx.font = `bold ${this.fontSize || 18}px monospace`;
            this.ctx.fillStyle = this.labelColor || this.fontColor;
            this.ctx.fillText(al, this.cw * .52, this.ch * .45 + 5, this.cw + 12);
            this.ctx.font = `${this.labelSize || this.fontSize - 4 || 14}px monospace`;
            this.ctx.fillText(this.label || this.type, this.cw * .52, this.ch * .45 + 5 + this.fontSize, this.cw + 12);
            this.ctx.beginPath();
            if (this.height === 0)
                    this.ctx.arc(this.size / 2, this.size / 2, this.size / 2 - this.padding, this.start, diff / 10 + this.start, false);
            this.ctx.stroke();
        }
    ]
})
