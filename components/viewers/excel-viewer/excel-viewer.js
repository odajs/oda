// https://github.com/SuperYesifang/excel-viewer

import ExcelViewer from './lib/excel-viewer-esm.js';

ODA({ is: 'excel-docx-viewer',
    template: `
        <link rel="stylesheet" href="./lib/excel/xspreadsheet.css">
        <div id="excel-container"></div>
    `,
    src: undefined,
    isReady: false,
    attached() {
        this.isReady = true;
    },
    $observers: {
        async srcChanged(src, isReady) {
            if (src && isReady) {
                this.bufSrc = src;
                if (typeof src === 'string') {
                    const response = await fetch(src);
                    this.bufSrc = await response.arrayBuffer();
                }
                await new ExcelViewer(this.$('#excel-container'), this.bufSrc);
            }
        }
    }
})
