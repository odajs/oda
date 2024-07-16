ODA({
    is: 'oda-error-viewer', imports: '@oda/ace-editor',
    template: /*html*/`
    <style>
        :host{
            @apply --vertical;
        }
        :host .message-block{
            margin-bottom: 8px;
            align-items: center;
            white-space: break-spaces;
            padding: 8px;
        }
    </style>
    <div class="error message-block" horizontal>
        <div>{{message}}</div>
        <oda-button @tap="_gotoError(message)" icon="enterprise:target"></oda-button>
    </div>
    <oda-ace-editor class="flex" :wrap="false" :value="code" :mode read-only></oda-ace-editor>
    `,
    message: '',
    set code(code) {
        if (code) {
            this.async(() => this._gotoError(this.message), 100)
        }
    },
    mode: 'xquery',
    _gotoError(message) {
        if (message) {
            const [line, col] = message.match(/\(\d*,\s\d*\)$/)?.[0].replace(/[()\s]/g, '').split(',');
            this.$('oda-ace-editor').editor.gotoLine(line, col);
        }
    }
})