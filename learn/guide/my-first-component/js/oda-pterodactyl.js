ODA({ is: 'oda-pterodactyl',
    template: `
        <style>
            path {
                fill: var(--pterodactyl-color);
            }
            :host {
                position: absolute;
                z-index: 200;
                animation-name: move;
                animation-duration: 3s;
                animation-iteration-count: 1;
                animation-timing-function: linear;
            }
            @keyframes move {
                from {
                    left: 100%;
                }
                to {
                    left: -136px;
                }
            }
        </style>
        <svg version="1.1" baseProfile="full" width="95" height="84" xmlns="http://www.w3.org/2000/svg">
            <!--Тело птеродактиля-->
            <path d=" M0 31, h4, v-4, h5, v-5, h4, v-4, h5, v-5, h9, v9, h4, v9, h32, v4, h5, v5, h27, v4, h-14, v5, h9, v4, h-13, v5, h-32, v-5, h-4, v-4, h-5, v-5, h-5, v-4, h-4, v-5, h-27, z " stroke="transparent" id="pterodactyl"/>

            <!--Крыло поднято вверх-->
            <path d=" M36 32, v-19, h-5, v-13, h5, v4, h5, v5, h4, v4, h5, v5, h4, v4, h5, v5, h4, v5, z ">
                <animate attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite"/>
            </path>

            <!--Крыло опущено вниз-->
            <path d=" M36 47, h18, v18, h-5, v5, h-4, v9, h-5, v5, h-4, z ">
                <animate attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"></animate>
            </path>
        </svg>
    `,
    attached() {
        this.setPosition(10,100);
        this.getAnimations().forEach((anim, i, arr) => {
            anim.onfinish = () => {
                this.remove();
            };
        });
    },
    setPosition(min, max) {
        this.style.top = Math.floor(min + Math.random() * (max + 1 - min)) + 'px';
    },
    stopMove(){
        this.style.animationPlayState="paused";
        const svg = this.$core.root.querySelector("svg");
        svg.pauseAnimations();
    },
    continueMove(){
        this.style.animationPlayState="running";
        const svg = this.$core.root.querySelector("svg");
        svg.unpauseAnimations();
    },
})