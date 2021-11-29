ODA({is:'oda-number-input',
    template:`
        <style>
            :host{
                @apply --vertical;
            }
            input{
                margin: 20px;
            }
        </style>
        <input ::value>
        <input ::value="input">
        <input ::value="display">
    `,
    props:{
        value: {
            default: 52352345.5465634687695,
            label: 'Значение'
        },
        input: '456',

        format:{
            default: '',
            list: ['percent', 'currency', 'text', '0.00' , '0.00%', '# 0,0000']
        }
    },
    get display(){
        return this.getFormattedValue(this.value);
    },
    getFormattedValue(val){
        return val.toLocaleString();
    }

    // value: 0,


})
