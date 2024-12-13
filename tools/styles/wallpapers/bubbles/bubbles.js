ODA({is: 'oda-bubbles',
    template: /*css*/`
        <style>
            :host {
                width: 100vw;
                height: 100vh;
                background-color: black;
                animation: fadeIn 1 1s ease-out;
                overflow: hidden;
                color: rgba(255, 104, 104, 0.1)
            }
            i {
                position: absolute;
                width: 120px;
                height: 120px;
                border-radius: 50%;
                -webkit-animation: 'screen' infinite linear;
                animation: 'screen'  infinite  linear;
            }
            @keyframes screen {
                from { opacity: 0; transform: scale3d(1, 1, 1); }
                98% { opacity: 1; transform: scale3d(2, 2, 2); }
                99% { opacity: 0.01; transform: scale3d(4, 4, 4); }
                to { opacity: 0; transform: scale3d(4, 4, 4); }
            }
        </style>
        <i ~for="circles" ~style="$for.item"></i>
    `,
    count: 20,
    blur: 0,
    st: {},
    circles: {
        get() {
            const result = [];
            for (let i = 0; i < this.count; i++) {
                result.push({
                    width: this.random(i, 'size', 40, 200) + 'px',
                    height: this.random(i, 'size', 40, 200) + 'px',
                    top: this.random(i, 'top', 10, this.offsetHeight) + 'px',
                    left: this.random(i, 'left', 10, this.offsetWidth) + 'px',
                    background: `radial-gradient(
                        circle at 30% 30%,
                        white 5px,
                        transparent 8%,
                        rgba(100, 250, 255, 0.5) 100%
                    )`,
                    boxShadow: `inset 0px 0px 16px 0px oklch(0.66 0.227 ${this.random(i, 'color', 0, 360)})`,
                    animationDuration: this.random(i, 'dur', 2, 10) + 's',
                    filter: 'blur(' + this.blur + 'px)'
                });
            }
            return result;
        }
    },
    random(i, k, min, max) {
        if (this.st[k + i] !== undefined) return this.st[k + i];
        this.st[k + i] = min + Math.random() * (max - min);
        return this.st[k + i];
    },
    attached(){
        document.body.style.overflow = 'hidden'
        // setInterval(()=>{
        //     this.count ++;
        // }, 5000)
    }
})
