const PATH = import.meta.url.replace('pdf-viewer.js','');

ODA({ is: 'oda-pdf-viewer', imports: '@oda/button',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <iframe :src style="width: 100%; height: 100%; border: none;"></iframe>
    `,
    url: {
        $def: '',
        set(n) {
            this.src = PATH + 'web/viewer.html?file=' + (n?.startsWith('./') ? PATH + n.replace('./', '') : n);
        }
    },
    src: ''
})
