// https://github.com/VolodymyrBaydalka/docxjs

import * as JSZip from './lib/jszip.min.js';

ODA({ is: 'oda-docx-viewer', imports: './lib/docx-preview.min.js, @oda/button',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                overflow: auto;
                position: relative;
            }
        </style>
        <div id="docx-container" style="overflow: auto;"></div>
    `,
    src: undefined,
    isReady: false,
    fullscreenMode: false,
    attached() {
        this.isReady = true;
    },
    $observers: {
        async srcChanged(src, isReady) {
            if (src && isReady) {
                this.bufSrc = src;
                const docxOptions = { ...docx.defaultOptions, ...{ experimental: true } };
                if (typeof src === 'string') {
                    const response = await fetch(src);
                    this.bufSrc = await response.arrayBuffer();
                }
                await docx.renderAsync(this.bufSrc, this.$('#docx-container'), null, docxOptions);
            }
        }
    },
    printScreenValue() {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.transform = 'translate(-1300px, -1800px)';
        iframe.style.height = '1754px';
        iframe.style.width = '1240px';
        document.body.appendChild(iframe);
        let clonedDiv = this.$('#docx-container').cloneNode(true);
        iframe.addEventListener('load', () => {
            iframe.contentDocument.body.appendChild(clonedDiv);
            this.async(() => {
                iframe.contentWindow.print();
                document.body.removeChild(iframe);
            }, 100)
        })
        iframe.srcdoc = '';
    },
    setFullscreen() {
        const element = this;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
})
