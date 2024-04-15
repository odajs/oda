ODA({ is: 'oda-pdf-viewer',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
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
                    let res = e.target.result;
                    const blob = this.b64toBlob(res?.split('base64,')[1]);
                    const blobURL = URL.createObjectURL(blob);
                    this.$('iframe').src = blobURL || '';
                }
                reader.readAsDataURL(file);
            }
        }
    },
    b64toBlob(b64Data, contentType = 'application/pdf', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
})
