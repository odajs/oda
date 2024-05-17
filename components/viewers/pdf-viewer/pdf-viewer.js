const PATH = import.meta.url.replace('pdf-viewer.js','');

ODA({ is: 'oda-pdf-viewer', imports: '@oda/button',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
                height: 100%;
            }
        </style>
        <iframe :src style="width: 100%; height: 100%; border: none;"></iframe>
    `,
    $public: {
        nativeView: {
            $def: false,
            $save: true
        },
        url: ''
    },
    get src() {
        const n = this.url;
        if (this.nativeView)
            return  n?.startsWith('./') ? PATH + n.replace('./', '') : n;
        return PATH + 'web/viewer.html?file=' + (n?.startsWith('./') ? PATH + n.replace('./', '') : n);
    }
})
