import {createPolygon, intersectPolygonPolygon} from "./utils.js"

ODA({ is: 'oda-dino',
    template: `
        <style>
            path {
                fill: var(--dino-color);
            }
            #small-eye {
                fill: var(--dino-eyes-color);
            }
            #big-eye {
                stroke: var(--dino-eyes-color);
            }
            :host(.dino-jump) {
                animation-name: dino-jump;
                animation-duration: 1s;
                animation-iteration-count: 1;
                animation-timing-function: ease-out;
            }
            @keyframes dino-jump {
                from {
                    top: var(--dino-top);
                    animation-timing-function: ease-out;
                }
                50% {
                    top: var(--dino-max-top);
                    animation-timing-function: ease-in;
                }
                to {
                    top: var(--dino-top);
                    animation-timing-function: ease-in;
                }
            }
        </style>

        <svg version="1.1" baseProfile="full" width="128" height="137" xmlns="http://www.w3.org/2000/svg">

            <!-- Тело -->
            <path d=" M0 48, h7, v12, h6, v7, h6, v6, h13, v-6, h7, v-7, h9, v-6, h10, v-6, h6, v-42, h7, v-6, h51, v6, h6, v29, h-32, v6, h19, v7, h-25, v12, h13, v13, h-7, v-6, h-6, v22, h-7, v10, h-6, v6, h-6, v7, h-45, v-7, h-7, v-6, h-6, v-7, h-6, v-6, h-7, z " stroke="transparent" id="body"/>

            <!--Глаз маленький-->
            <rect x="77" y="9" fill="white" height="7" width="6" id="small-eye"/>

            <!--Глаз большой-->
            <rect x="78.5" y="10.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye" visibility="hidden"/>

            <!--Рот-->
            <path d=" M95 34, v8, h20, v-1, h13, v-7, z " id="month" visibility="hidden"/>

            <!--Первая нога поднята вверх-->
            <path d=" M32 111, v7, h7, v6, h12, v-6, h-6, v-7, z " visibility="hidden" id="first-leg-up">
                <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Первая нога опущена вниз-->
            <path d="M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z" id="first-leg-down" visibility="hidden" >
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!-- Вторая нога поднята вверх -->
            <path d="M64 111, v7, h16, v-6, h-9, v-1, z" visibility="hidden" id="second-leg-up">
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Вторая нога опущена вниз-->
            <path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg-down" visibility="hidden">
                <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            </path>


        </svg>
    `,
    props: {
        svg: {},
        audio: {},
    },
    ready() {
        this.audio = new Audio('./audio/t-rex-get-it-on.mp3');
        this.audio.volume = .8;
        this.audio.loop = true;
        this.audio.play();
    },
    attached() {
        this.polygons = new Map();
        this.svg = this.$core.root.querySelector("svg");
        this.polygons.set('dino-body', createPolygon(this.svg,'#body'));
        this.polygons.set('dino-first-leg-up', createPolygon(this.svg,'#first-leg-up'));
        this.polygons.set('dino-first-leg-down', createPolygon(this.svg,'#first-leg-down'));
        this.polygons.set('dino-second-leg-up', createPolygon(this.svg,'#second-leg-up'));
        this.polygons.set('dino-second-leg-down', createPolygon(this.svg,'#second-leg-down'));
    },
    jump() {
        this.classList.add("dino-jump");
        this.svg.pauseAnimations();
        this.getAnimations().forEach((anim, i, arr) => {
            anim.onfinish = () => {
                this.classList.remove("dino-jump");
                this.offsetHeight; // reflow
                this.svg.unpauseAnimations();
            }
        });
    },
    stopMove() {
        this.audio.pause();
        this.style.animationPlayState="paused";
        this.svg.pauseAnimations();
        this.svg.getElementById('big-eye').setAttribute('visibility', 'visible');
        this.svg.getElementById('small-eye').setAttribute('visibility', 'hidden');
        this.svg.getElementById('month').setAttribute('visibility', 'visible');
    },
    continueMove() {
        this.audio.play();
        this.classList.remove("dino-jump");
        this.svg.unpauseAnimations();
        this.style.animationPlayState=null;
        this.svg.getElementById('big-eye').setAttribute('visibility', 'hidden');
        this.svg.getElementById('small-eye').setAttribute('visibility', 'visible');
        this.svg.getElementById('month').setAttribute('visibility', 'hidden');
    },
    isIntersection(cactus) {
        let dinoCoords = this.getBoundingClientRect();
        let cactusCoords = cactus.getBoundingClientRect();

        if ((cactusCoords.left+cactusCoords.width < dinoCoords.left ||
            dinoCoords.left+dinoCoords.width < cactusCoords.left ||
            dinoCoords.top + dinoCoords.height < cactusCoords.top ||
            cactusCoords.top + cactusCoords.height < dinoCoords.top))
        {
            return false;
        }

        return intersectPolygonPolygon(this.polygons.get('dino-body'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords)
         || (getComputedStyle(this.svg.getElementById('first-leg-up')).visibility === 'visible' ?
                 intersectPolygonPolygon(this.polygons.get('dino-first-leg-up'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords) :
                 intersectPolygonPolygon(this.polygons.get('dino-first-leg-down'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords)) ||
             (getComputedStyle(this.svg.getElementById('second-leg-up')).visibility === 'visible' ?
                 intersectPolygonPolygon(this.polygons.get('dino-second-leg-up'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords) :
                 intersectPolygonPolygon(this.polygons.get('dino-second-leg-down'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords));
    }
})