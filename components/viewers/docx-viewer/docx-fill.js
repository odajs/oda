import jszip from './lib/jszip.esm.js';
import * as JSZip from './lib/jszip.min.js';

ODA({ is: 'oda-docx-fill', imports: './docx-viewer.js', extends: 'oda-docx-viewer',
    fillData: undefined,
    async fill() {
        if (!this.bufSrc || !this.fillData)
            return;
        let zip = new jszip();
        zip = await zip.loadAsync(this.bufSrc)
        let xmlfile = await zip.file("word/document.xml").async("string");

        const re = /({.*?})/sg,
            re2 = /(<.*?>)/g,
            result = xmlfile.match(re) || [];
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
    }
})
