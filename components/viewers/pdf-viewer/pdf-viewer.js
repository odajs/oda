ODA({ is: 'oda-pdf-viewer',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <!-- <iframe style="width: 100%; height: 100%; border: none;"></iframe> -->
        <object type="application/pdf" style="width: 100%; height: 100%; border: none;">
            <div>No online PDF viewer installed</div>
        </object>
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
                this.$('object').data = url || '';
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
    }
})
