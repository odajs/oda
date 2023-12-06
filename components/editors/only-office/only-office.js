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
        <iframe class="flex"></iframe>      
    `,
    get frameUrl(){
        return path + '#' + this.url;
    },
    get url(){
        return "https://odajs.org/components/editors/onlyoffice-editor/demo/demo.docx";
    },
    attached(){
        this.async(()=>{
            this.$('iframe').src = this.frameUrl;
        }, 100)
    }
})