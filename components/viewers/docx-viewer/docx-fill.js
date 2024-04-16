import jszip from './lib/jszip.esm.js';

ODA({ is: 'oda-docx-fill', imports: './docx-viewer.js', extends: 'oda-docx-viewer',
    fillData: undefined,
    async fill() {
        if (!this.src || !this.fillData)
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
        const w = window.open();
        w.document.write(printContents);
        w.document.write('<script type="text/javascript">window.onload = function() { window.print(); window.close(); }</script>');
        w.document.close();
        w.focus();
    }
})
