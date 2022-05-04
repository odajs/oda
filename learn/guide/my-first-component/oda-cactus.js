import {createPolygon, intersectPolygonPolygon} from "./utils.js"

ODA({ is: 'oda-cactus',
    template: `
        <style>
            svg path {
                fill: var(--cactus-color);
            }
        </style>

        <svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
        </svg>
    `,
    attached() {
        const svg = this.$core.root.querySelector("svg");
        this.polygons = new Map();
        this.polygons.set('cactus', createPolygon(svg,'path'));
    },
    gameOver(){
        this.style.animationPlayState="paused";
    },
})
