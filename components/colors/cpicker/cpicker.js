import './modules/picker-cse.js';
ODA({ is: 'oda-color-cpicker', template: /*html*/`
        <picker-cse :color :size></picker-cse>
    `,
    props: {
        color: {
            type: String,
            default: '',
            reflectToAttribute: true
        },
        size: {
            type: Number,
            default: 24,
            reflectToAttribute: true
        },
    }
})
