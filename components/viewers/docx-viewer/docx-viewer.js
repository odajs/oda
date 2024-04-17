// https://github.com/VolodymyrBaydalka/docxjs

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
                const docxOptions = { ...docx.defaultOptions, ...{ experimental: true } };
                if (typeof src === 'string') {
                    const response = await fetch(src);
                    this.bufSrc = await response.arrayBuffer();
                }
                await docx.renderAsync(this.bufSrc, this.$('div'), null, docxOptions);
            }
        }
    }
})
