// https://github.com/SuperYesifang/excel-viewer
const libPath = import.meta.url.split('/').slice(0, -1).join('/') + '/lib/';

import ExcelViewer from './lib/excel-viewer-esm.js';

ODA({ is: 'oda-excel-viewer',
    template: `
        <link rel="stylesheet" :href>
        <div id="excel-container"></div>
    `,
    get href() {
        return libPath + 'excel/xspreadsheet.css';
    },
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
