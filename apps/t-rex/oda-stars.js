ODA({ is: 'oda-star1',
    template: `
        <style>
            .hidden {
                display: none;
            }
            svg path {
                fill: var(--star-color);
            }
        </style>
        <svg version="1.1" baseProfile="full" width="25" height="29" xmlns="http://www.w3.org/2000/svg">
            <path d=" M0 16, v-3, h6, v-4, h3, v-9, h3, v9, h4, v4, h9, v3, h-9, v3, h-4, v10, h-3, v-10, h-3, v-3, z"/>
        </svg>
    `,
    props: {
        name: "Привет звезда1",
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

ODA({ is: 'oda-star2',
    template: `
        <style>
            .hidden {
                display: none;
            }
            svg path {
                fill: var(--star-color);
            }
        </style>
        <svg version="1.1" baseProfile="full" width="25" height="29" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 16, v-3, h6, v-4, h3, v-9, h3, v9, h4, v4, h9, v3, h-9, v3, h-4, v10, h-3, v-10, h-3, v-3, z"/>
            <rect x="1" y="4" height="3" width="3" visibility="visible"/>
            <rect x="18" y="4" height="3" width="3" visibility="visible"/>
            <rect x="1" y="21" height="3" width="3" visibility="visible"/>
            <rect x="18" y="21" height="3" width="3" visibility="visible"/>
        </svg>
    `,
    props: {
        name: "Привет звезда2",
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

