ODA({is: 'oda-markdown',
    template:`  
        <style>
            :host{
                @apply --horizontal;
            }
        </style>
        <div ~style="{backgroundColor: background}">
            Markdown EDITOR
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