import './lib/qr.js';
ODA({
    is: 'oda-qr-code',
    template: `
        <qr-code @tap='save' :data="value" :margin :modulesize="moduleSize" :format></qr-code>
    `,
    $public: {
        value: '',
        format: {
            $def: 'png',
            $list: ['png', 'svg', 'html'],
        },
        margin: 2,
        moduleSize: 5,
        saveFile:false,
    },
    get source() {
        let url = el => {
            let rowStr = (new XMLSerializer()).serializeToString(el);
            let [bn,mime,end] = (this.format === 'svg')? ['<?xml version="1.0" encoding="UTF-8" standalone="no"?>', "image/svg+xml;",'']
                              : (this.format === 'html')? ['<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>',"text/html;",'</body></html>']
                              : ['','','']
            return URL.createObjectURL(new Blob([bn,rowStr,end], {type: mime + "charset=utf-8" }));
        }
        return (this.format === 'png')? this.$('qr-code').shadowRoot.firstChild.src
             : (this.format === 'svg')? url( this.$('qr-code').shadowRoot.firstChild )
             : (this.format === 'html')? url (this.$('qr-code').shadowRoot.firstChild.firstChild)
             : undefined
    },
    save() {
        if (!this.saveFile) return
        const a = document.createElement('a');
        a.href = this.source;
        a.setAttribute('download', 'qr-code.'+this.format);
        document.body.appendChild(a);
        a.click();
        a.remove();
        console.log(111)
    }
})
