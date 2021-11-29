ODA({is:'oda-number-input',
    template:`
        <input>
    `,
    props:{

        value: {
            default: 0,
            label: 'Значение'
        },
        format:{
            list: ['percent', 'currency', 'text']
        }
    },
    // value: 0,


})
