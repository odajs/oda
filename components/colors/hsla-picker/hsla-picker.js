import './modules/hsla-picker.js';
ODA({ is: 'oda-hsla-picker',
template:`
        <style>
            :host {
                @apply --horizontal;
                @apply --center;
            }
        </style>
        <hsla-picker :color :size @change="changeColor"></hsla-picker>
    `,
    $public: {
        color: {
            $type: String,
            $def: '',
            $attr: true
        },
        size: {
            $type: Number,
            $def: 24,
            $attr: true
        }
    },
    changeColor(e) {
        this.color = e.detail || e;
    }
})
