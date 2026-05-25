ODA({ is: 'oda-jupyter-message', imports: '@oda/markdown-viewer',
    icon: 'icons:error-outline',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
            oda-markdown-viewer {
                padding: 8px;
                height: 0;
                overflow: auto;
            }
        </style>
        <oda-markdown-viewer flex :value="message"></oda-markdown-viewer>
    `,
    message: ''
})
