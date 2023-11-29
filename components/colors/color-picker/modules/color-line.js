ODA({ is: 'oda-color-line',
    template: `
        <style>
            :host {
                display: flex;
                flex-direction: column;
            }

            div {
                margin: 1px;
                cursor: pointer;
                @apply --shadow;
            }

            div:hover {
                outline: 1px solid darkred;
                transform: scale(1.5);
            }
        </style>
        <div ~for="lightness" ~style="_getStyle(size, $for.item, hue, saturation)" @tap="_tap"></div>
    `,
    $public: {
        size: Number,
        hue: Number,
        saturation: Number,
        lightness: Array
    },
    _getStyle(size, light, hue, saturation) {
        return `background-color: hsl(${hue}, ${saturation}%, ${light}%); width: ${size}px; height: ${size}px;`;
    },
    _tap(e, d) {
        this.fire('color-tap', e.target.style.backgroundColor);
    }
})
