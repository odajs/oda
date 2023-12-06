ODA({is: 'oda-only-office',
    template:`
        <style>
            :host{
                @apply --vertical;
                position: relative;
                @apply --flex;
            }
        </style>
        <div class="flex vertical">
            <iframe class="flex" src="./frame.html"></iframe>
        </div>
        
    `
})