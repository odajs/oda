ODA({ is: 'oda-pdf-viewer', imports: '@oda/button',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <iframe style="width: 100%; height: 100%; border: none;"></iframe>
        <oda-button icon="icons:fullscreen" fill="lightgray" icon-size="26" @tap="setFullscreen" style="position: absolute; top: 10px; right: -8px; z-index: 9999"></oda-button>
    `,
    url: '',
    file: undefined,
    isReady: false,
    attached() {
        this.isReady = true;
    },
    $observers: {
        urlChanged(url, isReady) {
            if (isReady)
                this.$('iframe').src = url || '';
        },
        fileChanged(file, isReady) {
            if (file && isReady) {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const buffer = await e.target.result;
                    this.getUrl(buffer);
                }
                reader.readAsArrayBuffer(file);
            }
        }
    },
    async getUrl(buffer) {
        const fileBlob = await new Blob([new Uint8Array(buffer)], { type: 'application/pdf'})
        this.url = URL.createObjectURL(fileBlob);
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
