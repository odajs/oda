
ODA({ is: 'embedded-viewer',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
            }        
        </style>      
        <object :data frameborder='0' style="height: 100vh;"></object>
    `,
    url: '',
    get data() {
        return `https://view.officeapps.live.com/op/embed.aspx?src=${this.url || ''}`;
    }
})
