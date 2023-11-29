import * as JSZip from './lib/jszip.min.js';
import jszip from './lib/jszip.esm.js';

ODA({ is: 'oda-docx-viewer', imports: './lib/docx-preview.min.js',
    template: `
        <div id="docx-container"></div>
    `,
    src: {
        set(v) {
            this.srcLoad();
        }
    },
    fillData: undefined,
    async srcLoad(src = this.src) {
        if (!src) return;
        this.docxOptions = { ...docx.defaultOptions, ...{ experimental: true } };
        if (typeof this.src === 'string') {
            let response = await fetch(this.src);
            this._src = src = await response.arrayBuffer();
        }
        await docx.renderAsync(src, this.$('#docx-container'), null, this.docxOptions);
    },
    async fill() {
        if (!this._src || !this.fillData)
            return;
        let zip = new jszip();
        zip = await zip.loadAsync(this._src)
        let xmlfile = await zip.file("word/document.xml").async("string");

        const re = /({.*?})/sg,
            re2 = /(<.*?>)/g,
            result = xmlfile.match(re) || [],
            newres = [];
        result.forEach(element => {
            const newel = element.replace(re2, "");
            xmlfile = xmlfile.replace(element, newel);
        })
        for (let key in this.fillData) {
            xmlfile = xmlfile.replace('{' + key + '}', this.fillData[key]);
        }
        await zip.file("word/document.xml", xmlfile);
        xmlfile = await zip.generateAsync({ type: "uint8array" });
        await docx.renderAsync(xmlfile, this.$('#docx-container'), null, this.docxOptions);
    },
    print() {
        let printContents = this.$('#docx-container').innerHTML;
        printContents = printContents.replaceAll('.docx-wrapper', '.d-w');
        let w = window.open();
        w.document.write(printContents);
        w.document.write('<script type="text/javascript">window.onload = function() { window.print(); window.close(); }</script>');
        w.document.close();
        w.focus();
    }
})
