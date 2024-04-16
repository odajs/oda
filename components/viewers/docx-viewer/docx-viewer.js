import * as JSZip from './lib/jszip.min.js';

ODA({ is: 'oda-docx-viewer', imports: './lib/docx-preview.min.js',
    template: `
        <div id="docx-container"></div>
    `,
    src: undefined,
    isReady: false,
    attached() {
        this.isReady = true;
    },
    $observers: {
        async srcChanged(src, isReady) {
            if (src && isReady) {
                let buf = src;
                const docxOptions = { ...docx.defaultOptions, ...{ experimental: true } };
                if (typeof src === 'string') {
                    const response = await fetch(src);
                    buf = await response.arrayBuffer();
                }
                await docx.renderAsync(buf, this.$('div'), null, docxOptions);
            }
        }
    }
})
