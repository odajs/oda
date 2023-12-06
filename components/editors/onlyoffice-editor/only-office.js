ODA({is: 'oda-only-office',
    template:`
        <style>
            :host{
                @apply --vertical;
                position: relative;
                @apply --flex;
            }
        </style>
        <iframe class="flex" src="./frame.html"></iframe>
    `
})