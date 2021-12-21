ODA({is:'oda-number',
    template:`
        <style>
            :host{
                @apply --vertical;
            }
            input{
                text-align: right;
                width: 200px;
                margin: 16px;
            }
            div{
                align-items: center;
            }
        </style>
        <span>value: {{value}}</span>
        <span>mask:<input ::value="mask"></span>
        <div class="horizontal">
            <input @input="onInput" :value="maskedValue">
        </div>
    `,
    mask: '# 0.000',
    value: 0,
    get maskedValue () {

    },
    async onInput (e) {

    }
})