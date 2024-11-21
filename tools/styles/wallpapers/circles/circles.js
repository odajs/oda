ODA({is: 'oda-circles',
    template:`
        <style>
            :host {
                width: 100vw;
                height: 100vh;
                background-color: black;
                animation: fadeIn 1 1s ease-out;
                overflow: hidden;
                
            }    
            i {
                position: absolute;
                width: 120px;
                height: 120px;
                border-radius: 50%;
                -webkit-animation: 'screen'  infinite;
                animation: 'screen'  infinite;
            } 
            @keyframes screen {
                from {  opacity: 0; }
                25% { opacity: 0.3; transform: scale3d(3, 3, 4); }
                50% { opacity: 0.75; }
                75% { opacity: 1; }
                to { opacity: 0; }
            }
        </style>
        <i ~for="count" ~style="{
            width: random($for.item, 'size', 40, 200) + 'px',
            height: random($for.item, 'size', 40, 200) + 'px',
            top: random($for.item, 'top', 10, offsetHeight) + 'px',
            left: random($for.item, 'left', 10, offsetWidth) + 'px',
            background: '-webkit-radial-gradient(center, ellipse cover,  oklch(0.66 0.227 ' + random($for.item, 'color', 0, 360) + '),rgba(0,0,0,0) 100%)',
            boxShadow: '0px 0px 5px 0px white',
            animationDuration: random($for.item, 'dur', 2, 10) + 's',
            filter: 'blur(' + blur + 'px)'
        }"></i>
    `,
    count: 40,
    blur: 0,
    st: {},
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
