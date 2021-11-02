import '../../../oda.js';
import './dist/json-viewer-node.js';
ODA({
    is: 'oda-json-viewer',
    template: `
        <style>
            :host {
                margin-left: 20px;
            }
        </style>
        <oda-json-viewer-node :value="item ? item : null"></oda-json-viewer-node>
    `,
    props: {
        source: {
            set(json) {
                if (typeof json !== 'string') return [];
                json = json.trim();
                if (json[0] !== '{' && json[0] !== '[' || json[json.length - 1] !== '}' && json[json.length - 1] !== ']') return [];
                json = json.replace(/'/g, '"');
                this.item = JSON.parse(json);
            }
        },
        item: Object,
    },
});