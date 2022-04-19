ODA({is: 'oda-code',
    template:`  
        <style>
            :host{
                @apply --horizontal;
            }
        </style>
        <div ~style="{backgroundColor: background}">
            Code EDITOR
        </div>
        
    `,
    props:{
        editor:{
            default: 'Первый',
            list: ['Первый', 'Второй'],
            save: true
        },
        background: {
            default: '',
            save: true
        }
    }
})