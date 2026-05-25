ODA({ is: 'oda-jupyter-message', imports: '@oda/markdown-viewer, @oda/button',
    icon: 'icons:error-outline',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
            oda-button {
                border-bottom: 1px solid var(--dark-1);
            }
            oda-markdown-viewer {
                padding: 8px;
                height: 0;
                overflow: auto;
            }
        </style>
        <oda-button @tap="message=''">Clear</oda-button>
        <oda-markdown-viewer flex :value="message"></oda-markdown-viewer>
    `,
    message: ''
})
