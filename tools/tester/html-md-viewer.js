import '../../oda.js';
import '../../components/editors/html-editor/html-editor.js';
import '../../components/viewers/md-viewer/md-viewer.js';

ODA({
    is: 'oda-html-md-viewer',
    template: `
        <oda-html-editor :if="src.includes('.html')" :src></oda-html-editor>
        <oda-md-viewer :if="src.includes('.md')" :src></oda-md-viewer>
    `,
    props: {
        src: ''
    }
})