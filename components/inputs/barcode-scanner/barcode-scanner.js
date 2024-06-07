ODA({
    is: 'oda-barcode-scanner', extends: 'oda-button', imports: '@oda/button',
    icon: 'box:i-scan',
    $listeners: {
        click: 'startScan'
    },
    result: null,
    formats: '*',
    async startScan() {
        const supportedFormats = await BarcodeDetector?.getSupportedFormats();
        const formats = this.formats === '*'
            ? supportedFormats
            : supportedFormats.filter(f => this.formats.includes(f));
        const detector = new BarcodeDetector({ formats });
        const cameraDialog = ODA.createComponent('oda-camera-dialog');
        const result = await new Promise(async (resolve, reject) => {
            let stop = false;
            cameraDialog.listen('select-barcode', () => {
                stop = true;
                resolve(cameraDialog.selectedBarcode);
            });
            const fn = async () => {
                if (stop) return;
                if (
                    !cameraDialog.isConnected
                    || !cameraDialog.video
                    || !(cameraDialog.video.srcObject || cameraDialog.video.src)
                    || cameraDialog.video.readyState !== cameraDialog.video.HAVE_ENOUGH_DATA
                ) {
                    return this.async(fn, 300);
                }
                try {
                    const barcodes = await detector.detect(cameraDialog.video);
                    cameraDialog.barcodes = barcodes;
                }
                catch (err) {
                    console.error(err);
                }
                finally {
                    this.async(fn, 300);
                }
            };
            fn();
            await ODA.showDialog(cameraDialog)
                .then(() => {
                    stop = true;
                    if (cameraDialog.selectedBarcode) {
                        resolve(cameraDialog.selectedBarcode);
                    }
                    else {
                        reject();
                        this.dispatchEvent(new Event('scan-canceled'));
                    }
                })
                .catch(() => {
                    stop = true;
                    reject();
                    this.dispatchEvent(new Event('scan-canceled'));
                });
        });
        this.result = result;
        cameraDialog.fire(result ? 'ok' : 'cancel');
        this.dispatchEvent(new Event('scan-complete'));
    }
});
ODA({
    is: 'oda-camera-dialog', imports: '@oda/camera', extends: 'oda-camera',
    template: /*html*/`
    <style>
        :host .box{
            border: 1mm solid lime;
            position: absolute;
            font-weight: bold;
            mix-blend-mode: difference;
        }
        :host .box::after{
            content: attr(value-text);
            margin: 2px;
            position: relative;
            left: 100%;
        }
        :host .barcodes-list{
            @apply --vertical;
            margin: 4px;
            overflow-x: hidden;
            overflow-y: auto;
            text-overflow: ellipsis;
            border: 1px solid gray;
        }
        :host .barcodes-list > *{
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 4px;
        }
    </style>
    <div ~for="barcodes" class="box" ~style="_getBoxStyle($for.item.boundingBox)" :value-text="$for.item.rawValue" @tap="_selectBarcode($for.item)"></div>
    <div class="barcodes-list">
        <div ~for="barcodes" ~text="$for.item.rawValue" @tap.prevent.stop="_selectBarcode($for.item)"></div>
    </div>
    `,
    hideSettings: false,
    barcodes: [],
    selectedBarcode: undefined,
    coef: {
        get() {
            if (!this.isConnected || !this.video || !(this.video.srcObject || this.video.src)) return;
            return this.offsetWidth / this.video.videoWidth;
        }
    },
    _getBoxStyle(box) {
        return {
            left: `${box.left * this.coef}px`,
            top: `${box.top * this.coef}px`,
            width: `${box.width * this.coef}px`,
            height: `${box.height * this.coef}px`
        }
    },
    _selectBarcode(barcode) {
        this.selectedBarcode = barcode;
        this.fire('select-barcode');
    }

});