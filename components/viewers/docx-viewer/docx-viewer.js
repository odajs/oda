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
        <oda-button icon="icons:fullscreen" icon-size="32" @tap="setFullscreen" style="position: absolute; top: 8px; right: 8px; z-index: 9999"></oda-button>
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
            iframe.contentWindow.print();
            this.async(() => {
                document.body.removeChild(iframe);
                console.log('..... close print window');
            }, 10000)
        })
        iframe.srcdoc = ' ';
    },
    setFullscreen() {
        this.fullscreenMode = !this.fullscreenMode;
        const element = this;
        if (this.fullscreenMode) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
})
