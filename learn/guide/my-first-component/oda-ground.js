ODA({ is: 'oda-ground',
    template: `
        <style>
            .hidden {
                display: none;
            }
            svg path {
                fill: var(--moon-color);
            }
        </style>
        <svg version="1.1" baseProfile="full" width="136" height="25" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0, h3, v3, h-3, z" id="ground3" visibility="hidden"/>
            <path d="M0 0, h4, v3, h-4, z" id="ground4" visibility="visible"/>
            <path d="M0 0, h6, v3, h-6, z" id="ground6" visibility="hidden"/>
            <path d="M0 0, h9, v3, h-9, z" id="ground9" visibility="hidden"/>
            <path d="M0 0, h10, v3, h-10, z" id="ground10" visibility="hidden"/>
            <path d="M0 0, h13, v3, h-13, z" id="ground12" visibility="hidden"/>
        </svg>
    `,
    props: {
        name: "Привет земля",
    },
    ready() {
        const num = Math.floor(Math.random() * 7);
    },
    gameOver(){
        this.style.animationPlayState="paused";
    },
    gameStart(){
        if (this.style.animationPlayState === "paused") {
            svg.style.animationPlayState="running";
        }
    },
})
