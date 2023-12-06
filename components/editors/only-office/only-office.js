const path = import.meta.url.split('only-office.js')[0]+'frame.html'
ODA({is: 'oda-only-office',
    template:`
        <style>
            :host{
                @apply --vertical;
                position: relative;
                @apply --flex;
            }
        </style>
        <iframe class="flex" :src="frameUrl"></iframe>      
    `,
    get frameUrl(){
        return path;
    }
})