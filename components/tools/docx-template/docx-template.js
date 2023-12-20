// https://github.com/guigrpa/docx-templates
// https://guigrpa.github.io/2017/01/01/word-docs-the-relay-way/
// import { createReport } from 'https://unpkg.com/docx-templates/lib/browser.js';
import { createReport } from './lib/browser.js';

ODA({
    is: 'oda-docx-template',

    src: {
        set(v) {
            this.srcLoad();
        }
    },
    async srcLoad(src = this.src) {
        if (!src) return;
        let report;
        const onTemplateChosen = async () => {
            const template = await readFileIntoArrayBuffer(src);
            report = await createReport({
                template,
                data: this.data,
                cmdDelimiter: ['{', '}']
            })
        }
        const readFileIntoArrayBuffer = fd =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.readAsArrayBuffer(fd);
            })
        const saveDataToFile = (data = report, fileName = 'report.docx', mimeType = 'word/document.xml') => {
            const blob = new Blob([data], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            downloadURL(url, fileName, mimeType);
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);
        }

        const downloadURL = (data, fileName) => {
            const a = document.createElement('a');
            a.href = data;
            a.download = fileName;
            document.body.appendChild(a);
            a.style = 'display: none';
            a.click();
            a.remove();
        }
        await onTemplateChosen();
        await saveDataToFile();
    }
})
