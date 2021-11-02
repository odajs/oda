import '../../../oda.js';
import '../../editors/ace-editor/ace-editor.js';
import ODA from '../../../oda.js';

ODA({
    is: 'oda-json-ace-viewer',
    extends: 'oda-ace-editor',
    props: {
        options: {
            mode: 'ace/mode/json',
            readOnly: true,
            showLineNumbers: true,
            printMargin: true
        },
        source: {
            set(json) {
                if (typeof json !== 'string') return '';
                json = json.trim();
                if (json[0] !== '{' && json[0] !== '[' || json[json.length - 1] !== '}' && json[json.length - 1] !== ']') return '';
                json = json.replace(/'/g, '"');
                json = JSON.parse(json);
                this.value = JSON.stringify(json, null, 3);
            }
        },
    }

});