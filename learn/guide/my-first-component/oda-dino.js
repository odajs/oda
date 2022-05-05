import {createPolygon, intersectPolygonPolygon} from "./utils.js"

ODA({ is: 'oda-dino',
    template: `
        <style>
            svg path {
                fill: var(--dino-color);
            }
            #small-eye {
                fill: var(--dino-eyes-color);
            }
            #big-eye {
                stroke: var(--dino-eyes-color);
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

            <!-- Тело наклон-->
            <path d=" M0 53, h6, v6, h13, v7, h26, v-7, h54, v7, h13, v-3, h6, v-7, h52, v7, h6, v28, h-32, v7, h19, v6, h-45, v-6, h-12, v9, h-7, v7, h7, v6, h-13, v-13, h-16, v4, h-39, v-7, h-6, v-6, h-6, v-7, h-7, v-6, h-6, v-6, h-7, v-7, h-6, z " id="body-bow" visibility="hidden" class="hidden"/>

            <!--Глаз маленький наклон-->
            <rect x="125" y="66" fill="white" height="6" width="6" id="small-eye-bow" visibility="hidden"/>

            <!--Глаз большой наклон-->
            <rect x="126.5" y="67.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye-bow" visibility="hidden"/>

            <!--Рот наклон-->
            <path d="M143 90,v9,h20,v-1,h7,v-8,z" fill="grey" id="month-bow" visibility="hidden"/>

            <!--Первая нога-->
            <path d="M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z" id="first-leg" visibility="hidden" >
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Вторая нога-->
            <path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg" visibility="hidden">
                <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!-- Третья нога -->
            <path d="M64 111, v7, h16, v-6, h-9, v-1, z" visibility="hidden" id="third-leg">
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Четвертая нога-->
            <path d=" M32 111, v7, h7, v6, h12, v-6, h-6, v-7, z " visibility="hidden" id="fourth-leg">
                <animate attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            </path>
        </svg>
    `,
    props: {
        svg: {}
    },
    attached() {
        this.polygons = new Map();
        this.svg = this.$core.root.querySelector("svg");
        this.polygons.set('dino-body', createPolygon(this.svg,'#body'));
        this.polygons.set('dino-first-leg', createPolygon(this.svg,'#first-leg'));
        this.polygons.set('dino-second-leg', createPolygon(this.svg,'#second-leg'));
        this.polygons.set('dino-third-leg', createPolygon(this.svg,'#third-leg'));
        this.polygons.set('dino-fourth-leg', createPolygon(this.svg,'#fourth-leg'));
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
    gameOver(){
        this.style.animationPlayState="paused";
        this.svg.pauseAnimations();
        this.svg.getElementById('big-eye').setAttribute('visibility', 'visible');
        this.svg.getElementById('small-eye').setAttribute('visibility', 'hidden');
        this.svg.getElementById('month').setAttribute('visibility', 'visible');
    },
    gameStart(){
        if (this.style.animationPlayState === "paused") {
            this.classList.remove("dino-jump");
            this.svg.unpauseAnimations();
            this.style.animationPlayState=null;
            this.svg.getElementById('big-eye').setAttribute('visibility', 'hidden');
            this.svg.getElementById('small-eye').setAttribute('visibility', 'visible');
            this.svg.getElementById('month').setAttribute('visibility', 'hidden');
        }
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

        // const bow = dino.getElementById('body').classList.contains("hidden") ? "-bow" : "";

        return intersectPolygonPolygon(this.polygons.get('dino-body'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords)
         || (getComputedStyle(this.svg.getElementById('first-leg')).visibility === 'visible' ?
                 intersectPolygonPolygon(this.polygons.get('dino-first-leg'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords) :
                 intersectPolygonPolygon(this.polygons.get('dino-fourth-leg'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords)) ||
             (getComputedStyle(this.svg.getElementById('second-leg')).visibility === 'visible' ?
                 intersectPolygonPolygon(this.polygons.get('dino-second-leg'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords) :
                 intersectPolygonPolygon(this.polygons.get('dino-third-leg'), cactus.polygons.get('cactus'), dinoCoords, cactusCoords));
    }
})