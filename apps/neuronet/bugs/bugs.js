ODA({is: 'oda-bugs-item',
    template: `
        <style>
            :host([energy][show-system])::before{
                position: fixed;
                font-size: xx-small;
                @apply --shadow;
                border-radius: 100vh;
                margin: 4px;
                content: attr(energy);
                bottom: 100%;
                left: 80%;
                z-index: 10;
                transform: rotate({{-angle}}deg);
                padding: 2px;
                border-radius: 4px;
            }
            :host{
                background-color: {{color}};
                @apply --raised;
                top: 0px;
                left: 0px;
                transform-origin: center;
                align-items: center;
                @apply --vertical;
                position: absolute !important;
                border-radius: {{markerRadius?markerRadius+'px':'50%'}};
                transform: translate3d({{x}}px, {{y}}px, 0px) rotate({{angle || 0}}deg) ;
            }
            .marker{
                @apply --border;
                pointer-events: none;
                position: absolute;
                border-color: {{color}} !important;
                visibility: {{showSystem?'visible':'hidden'}};
                border-radius: 50%;
                box-sizing: border-box;
            }
        </style>
        <div id="markers" style="position: absolute; left: 0px; top: 0px;">
            <div ~for="markerStyles" class="marker"  ~style="$for.item"></div>
        </div>
    `,
    $public:{
        $pdp: true,
        energy: {
            $type: Number,
            $attr: 'energy'
        },
        showSystem: {
            $def: false,
            $attr: 'show-system'
        },
        fix: false,
        color: 'white',
        x:{
            $type: Number,
            get(){
                return (this.scene?.clientWidth - 120) * Math.random() + 60;
            },
            set(n){
                this.activate();
            },
        },
        y:{
            $type: Number,
            get(){
                return (this.scene?.clientHeight - 120) * Math.random() + 60;
            },
            set(n){
                this.activate();
            },
        }
    },

    collision: undefined,
    attached(){
        this.async(()=>{
            this.activate();
        }, 100)
    },
    get markers(){
        return Array.from(this.$('#markers')?.children || []);
    },
    markerRadius: 0,
    get markerStyles(){
        this.markers = undefined;
        const width = this.offsetWidth;
        const height = this.offsetHeight;
        const max = Math.max(width, height);
        const min = Math.min(width, height);
        if (!min) return []
        const markerCount = Math.ceil(max / min);
        const step = markerCount>1?(max - min)/(markerCount - 1):0;
        const styles = [];

        for (let i = 0, x = min; i < markerCount; i++){
            let left = '0px';
            let top = '0px';
            if (width>height)
                left = (x - min) + 'px';
            else
                top = (x - min) + 'px';
            styles.push({width: min + 'px', height: min + 'px', left, top})
            x += step;
        }
        return styles;
    },
     $listeners:{
        resize(e){
            this.markerRadius = Math.min(this.offsetWidth, this.offsetHeight)/2;
            this.markerStyles = undefined;
        },
        track(e){
            switch (e.detail.state){
                case 'track':{
                    this.x += e.detail.ddx;
                    this.y += e.detail.ddy;
                    this.activate();
                } break;
                case 'end':{
                    this.activate();
                } break;
            }
        }
    },
    $pdp:{
        get scene(){
            return this.parentElement;
        },
        get me(){
            return this;
        }
    },
    set collision(n){
        this.debounce('collision', ()=>{
            this.collision = undefined;
        })
    },
    set collisionX(n){
        if (n){
            this.collision = true;
            this.collisionX = 0;
            this.x += n;
        }
    },
    set collisionY(n){
        if (n){
            this.collision = true;
            this.collisionY = 0;
            this.y += n;
        }
    },
    activate(){
        if (this.fix) return;
        this.throttle('activate', ()=>{
            const r1 = this.markerRadius;
            const scrRect = this.scene.getBoundingClientRect();
            this.markers.forEach(async marker=>{
                let rect = marker.getBoundingClientRect();
                let x1 = rect.x + rect.width/2;
                let y1 = rect.y + rect.width/2;
                let delta = x1 - scrRect.x - r1;
                if (delta < 0){
                    this.collisionX = -delta;
                }
                else{
                    delta = scrRect.right - x1 - r1;
                    if (delta < 0){
                        this.collisionX = delta;
                    }
                }
                delta = y1 - scrRect.y - r1;
                if (delta < 0){
                    this.collisionY = -delta;
                }
                else{
                    delta = scrRect.bottom - y1 - r1;
                    if (delta < 0){
                        this.collisionY = delta;
                    }
                }
                Array.prototype.forEach.call(this.scene.children, el=>{
                    if (el === this) return;
                    const r2 = el.markerRadius;
                    if (!r2) return;
                    el.markers?.forEach(eMarker=>{
                        let elRect = eMarker.getBoundingClientRect();
                        let x2 = elRect.x + elRect.width/2;
                        let y2 = elRect.y + elRect.width/2;
                        let correct = correctCollision(x1, y1, r1, x2, y2, r2);
                        if (!correct) return;
                        this.collisionX = correct.x;
                        this.collisionY = correct.y;
                    })

                })
            })
        })
    },
    set angle(n){
        this.activate();
    }
})
ODA({is: 'oda-bug', extends: 'oda-bugs-item',
    template: `
        <style>
            :host{
                opacity: {{energy/255 + .5}};
                background: linear-gradient(90deg, {{gradient}});
                @apply --shadow;
            }
            .motors{
                justify-content: space-around;
                padding: 4px 0px 25%;
            }
        </style>
        <oda-bug-head></oda-bug-head>
        <div class="body horizontal flex" style="justify-content: center;">
            <div class="motors vertical">
                <oda-bug-motor @value-changed="move(1, 1)"></oda-bug-motor>
                <oda-bug-motor @value-changed="move(1, 1)"></oda-bug-motor>
                <oda-bug-motor @value-changed="move(-1, -1)"></oda-bug-motor>
            </div>
            <div class="vertical" style="padding: 4px 0px">
                <oda-bug-energy></oda-bug-energy>
            </div>
            <div class="motors vertical">
                <oda-bug-motor @value-changed="move(1, -1)"></oda-bug-motor>
                <oda-bug-motor @value-changed="move(1, -1)"></oda-bug-motor>
                <oda-bug-motor @value-changed="move(-1, 1)"></oda-bug-motor>
            </div>
        </div>
    `,
    $public:{
        $pdp: true,
        energy:{
            $def: 255,
            set (n){
                if (n > 0.1){
                    this.throttle('energy', ()=>{
                        this.move(1, (Math.random() -.5) * 5);
                    })
                }
                else{
                    this.energy = 0;
                    this.remove();
                }
            }
        },
        color:{
            get (){
                return this.collision?'red':'brown';
            }
        },
        delay: 0,
        allowMove: {
            $def: false,
            set(n){
                this.move();
            }
        },
        get maxSize(){
            return Math.sqrt(Math.pow(this.scene.offsetWidth, 2) + Math.pow(this.scene.offsetHeight, 2));
        },
    },
     $listeners:{
        dblclick(e){
            this.allowMove = !this.allowMove;
        }
    },

    get gradient(){
            if (this.collision)
                return 'red, yellow, red, brown, red, yellow, red';
            return 'brown, saddlebrown, rosybrown, sandybrown, rosybrown, saddlebrown, brown, black, brown, saddlebrown, rosybrown, sandybrown, rosybrown, saddlebrown, brown';
    },

    rotate(a){
        this.angle+=a;
    },
    move(c = 0, r = 0){
        if (!this.allowMove) return;
        if (!this.energy) return;
        const speed = this.energy/255;
        this.x += c * Math.cos((90-this.angle) * Math.PI/180) * speed;
        this.y -= c * Math.sin((90-this.angle) * Math.PI/180) * speed;
        this.angle += r * speed;
        this.energy = this.energy - speed / 10;
    },
    get angle(){
        return Math.random() * 360;
    },
    eat(el){
        if (!el.energy)
            return;
        const energy = Math.min(Math.sqrt(this.energy), el.energy);
        this.energy += energy;
        el.energy -= energy;
    }
})
ODA({is: 'oda-bug-head',
    template:`
        <style xmlns="http://www.w3.org/1999/html">
            :host{
                min-width: 75%;
                background-color: black;
                border-radius: 100vh 100vh 0 0 !important;
                justify-content: center;
                @apply --vertical;
                @apply --no-flex;
                @apply --shadow;
                padding: 0px 2px;
            }
        </style>
        <oda-bug-mouth style="align-self: center;"></oda-bug-mouth>
        <div class="horizontal" style="justify-content: center;">
            <oda-bug-eye></oda-bug-eye>
            <oda-bug-eye></oda-bug-eye>
        </div>

    `,
    get eyes(){
        return Array.from(this.$$('oda-bug-eye'));
    }
},{
    radar: ODA({is: 'oda-bug-radar', extends: 'oda-bug-sensor',
        template: `
            <style>
                :host{
                    position: relative;
                    @apply --vertical;
                    @apply --shadow;
                    align-items: center;
                    background-color: {{color}} !important;
                    justify-content: center;
                    border-radius: 50% 50% 20% 20%  !important;
                }
               #line{
                    justify-content: space-between;
                    position: absolute;
                    width: 0.1px;
                    height: 4px;
                    background-color: {{showSystem?'black':'transparent'}};
                    bottom: 100%;
               }
               :host>div>div{
                    height: 1px;
               }
            </style>
            <div id="line" class="vertical">
                <div style="top: 0px; "></div>
                <div style="bottom: 0px; "></div>
            </div>
        `,
        get dots(){
            return Array.from(this.$('#line')?.children || []);
        },
        attached(){
            this.look();
        },
        look(){
            if (!this.energy){
                this.color = 'black';
                this.angle = 0;
                return;
            }
            if (!this.dots.length) return;
            const dot1 = this.dots[1].getBoundingClientRect();
            const dot2 = this.dots[0].getBoundingClientRect();
            const lineCoord = {x1: dot1.x, y1: dot1.y, x2: dot2.x, y2: dot2.y};
            const lineEq = lineEquation(lineCoord);
            const nearPoint = {};
            const vectorX = (lineCoord.x2 > lineCoord.x1)?1:((lineCoord.x2 < lineCoord.x1)?-1:0)
            const vectorY = (lineCoord.y2 > lineCoord.y1)?1:((lineCoord.y2 < lineCoord.y1)?-1:0)
            Array.prototype.forEach.call(this.scene.children, el=>{
                if (Object.equal(el, this.me))
                    return;
                el.markers?.forEach(m=>{
                    const r = m.domHost.markerRadius;
                    const rect = m.getBoundingClientRect();
                    const x = rect.x + (rect.right - rect.left)/2;
                    const y = rect.y + (rect.bottom - rect.top)/2;
                    const intersect = intersection(x, y, r, lineEq.k, lineEq.b)
                    intersect?.forEach(point=>{
                        switch (vectorX){
                            case 1:{
                                if (point.x<lineCoord.x1 || point.x>lineCoord.x2) return;
                            } break;
                            case -1:{
                                if (point.x>lineCoord.x1 || point.x<lineCoord.x2) return;
                            } break;
                            default:{
                                if (point.x !== lineCoord.x1) return;
                            } break;
                        }
                        switch (vectorY){
                            case 1:{
                                if (point.y<lineCoord.y1 || point.y>lineCoord.y2) return;
                            } break;
                            case -1:{
                                if (point.y>lineCoord.y1 || point.y<lineCoord.y2) return;
                            } break;
                            default:{
                                if (point.y !== lineCoord.y1) return;
                            } break;
                        }
                        const length = Math.sqrt(Math.pow(point.x - lineCoord.x1, 2) + Math.pow(point.y - lineCoord.y1, 2));
                        if (nearPoint.length === undefined || nearPoint.length>length){
                            nearPoint.length = length;
                            nearPoint.marker = m;
                            nearPoint.found = el;
                        }
                    })
                })
            })
            if (nearPoint.marker){
                this.distance = nearPoint.length;
                this.color = getComputedStyle(nearPoint.marker)['border-color'];
                this.found = nearPoint.found;
            }
            this.async(()=>{
                let a = this.angle + (Math.random()-.5) * 10;
                if (a<-15)
                    a = -15;
                if (a > 15)
                    a = 15;
                this.angle = a;
                this.look();
            }, 100)

        },
        set distance(n){
            if (n){
                this.async(()=>{
                    this.distance = undefined
                }, this.delay)
            }
        },
        set color(n){
            if (n){
                this.async(()=>{
                    this.color = undefined
                }, 100)
            }
        },
        angle: 0,
    }),
    mouth: ODA({is: 'oda-bug-mouth', extends: 'oda-bug-radar',
        template:`
            <style>
                 @keyframes blinker { 100% { opacity: 0; } }
                :host{
                    max-height: 2px;
                    min-width: 50%;
                    animation: 200ms ease blinker infinite;
                }
            </style>
        `,
        set found(n){
            if(n){
                this.me.eat(n);
                this.found = undefined;
            }
        }
    }),
    eye: ODA({is: 'oda-bug-eye', extends: 'oda-bug-radar',
        template:`
            <style>
                :host{
                    @apply --border;
                    margin-bottom: 2px !important;
                    padding: 1px;
                    max-height: 2px;
                    transform: rotate({{angle}}deg);
                    border-color: brown !important;
                }
               #line{
                    height: {{maxSize}}px !important;
               }
            </style>
            <div style="width: 1px; height: 6px; border-radius: 50%; background-color: black;"></div>
        `,

    })
})

ODA({is: 'oda-bug-neuron',
    template: `
        <style>
            :host{
                margin: 1px;
                width: 4px;
                height: 4px;
                cursor: pointer;
                border-radius: 50%;
                background-color: {{value?activeColor:color}};
            }
        </style>
    `,
     $listeners:{
        tap(e){
            e.stopPropagation();
            this.activate();
        }
    },

    color: 'transparent',
    activeColor: 'red',
    activate(){
        this.value = true;
    },
    set value(n){
        if (n){
            this.async(()=>{
                this.value = false;
            }, this.delay)
        }
    },
    get value(){
        return false
    }
})
ODA({is: 'oda-bug-sensor', extends: 'oda-bug-neuron',
    template: `
        <style>
            :host{
                margin: 1px;
                border-radius: 50% !important;
            }
        </style>
    `
})
ODA({is: 'oda-bug-energy', extends: 'oda-bug-sensor',
    template: `
        <style>
            :host{
                align-self: center;
                min-height: {{Math.sqrt(energy)}}px !important;
                min-width: {{Math.sqrt(energy)}}px !important;
            }
        </style>
    `,
    activate(){
        this.energy += Math.sqrt(255);
    }
})
ODA({is: 'oda-bug-motor', extends: 'oda-bug-neuron',
    color: 'black'
})

ODA({is:'oda-food', imports: '@oda/icon', extends: 'oda-bugs-item',
    template: `
        <oda-icon :icon-size="Math.sqrt(energy)" icon="maps:local-florist" fill="red" stroke="green"></oda-icon>
    `,
    $public:{
        energy:{
            get(){
                return Math.random() * 1000 + 255;
            }
        },
        color: 'lightgreen'
    },
    isFood: true,

})

ODA({is:'oda-wall', extends: 'oda-bugs-item',
    template: `
        <style>
            :host{
                width: {{width}}px;
                height: {{height}}px;
                background-color: {{color}}
            }
        </style>
    `,
    $public:{
        width: 8,
        height: 8,
    },
    x: 0,
    y: 0
})

ODA({is:'oda-bug-controls', imports: '@oda/button', extends: 'oda-bugs-item',
    template: `
        <style>
            :host{
                z-index: 1;
                @apply --header;
                flex-direction: row !important;
                border-radius: 0px !important;
                background-color: {{color}}
            }
            [toggled]{
                @apply --selected;
            }
        </style>
        <oda-button icon="icons:bug-report" :icon-size allow-toggle ::toggled="allowMove"></oda-button>
        <oda-button icon="icons:info-outline" :icon-size allow-toggle ::toggled="showSystem"></oda-button>
    `,
    iconSize: 32,
    $public:{
        fix: true,
        allowMove:{
            $def: false,
            set(n){
                Array.from(this.scene.children).forEach(el=>{
                    el.allowMove = n
                })
            },
            $save: true
        },
        showSystem:{
            $def: false,
            set(n){
                Array.from(this.scene.children).forEach(el=>{
                    el.showSystem = n
                })
            },
            $save: true
        }
    },
    get x(){
        return 0
    },
    get y() {
        return 0
    }
})

function lineEquation({x1, y1, x2, y2}){
    const k = (y2 - y1)/(x2 - x1);
    const b = (x2 * y1 - x1 * y2)/(x2 - x1);
    return {k, b};
}
function intersection(x, y, r, k, b) {
    //находим дискременант квадратного уравнения
    const d = (Math.pow(( 2 * k * b - 2 * x - 2 * y * k ), 2) - (4 + 4 * k * k) * (b * b - r * r + x * x + y * y - 2 * y * b));
    //если он меньше 0, уравнение не имеет решения
    if(d >= 0) {
        const x1= ((-(2 * k * b - 2 * x - 2  * y * k) - Math.sqrt(d))/(2 + 2 * k * k));
        const x2 = ((-(2 * k * b - 2 * x - 2 * y * k) + Math.sqrt(d))/(2 + 2 * k * k));
        const y1 = k * x1 + b;
        const y2 = k * x2 + b;
        //если абсциссы точек совпадают, то пересечение только в одной точке
        if (x1 === x2)
            return [{x, y}]
        return [{x:x1, y:y1}, {x:x2, y:y2}];
    }
}
function restoreColor(clr){
    let rgb = clr.split(';');
    rgb = clr.substring(clr.indexOf('(') + 1);
    rgb = rgb.substring(0, rgb.indexOf(')'));
    rgb = rgb.split(',');
    let r = parseInt(rgb.shift());
    let g = parseInt(rgb.shift());
    let b = parseInt(rgb.shift());
    return {r, g, b};
}
function correctCollision(x1, y1, r1, x2, y2, r2){
    const R = r1 + r2;
    let deltaX = x1 - x2;
    let deltaY = y1 - y2;
    let deltaXPow = Math.pow(deltaX, 2);
    let deltaYPow = Math.pow(deltaY, 2);
    let deltaSum = deltaXPow + deltaYPow;
    let c = Math.sqrt(deltaSum);
    if (c<R){
        const delta = Math.pow(R - c, 2);
        return {x: Math.sqrt(deltaXPow / deltaSum * delta) * Math.sign(deltaX), y: Math.sqrt(deltaYPow / deltaSum * delta) * Math.sign(deltaY)}
    }
}