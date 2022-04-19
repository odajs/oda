ODA({is: 'oda-html',
    template:`  
        <style>
            :host{
                @apply --horizontal;
            }
        </style>
        <div ~style="{backgroundColor: background}">
            HTML EDITOR
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