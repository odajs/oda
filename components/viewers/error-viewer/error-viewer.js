ODA({
    is: 'oda-error-viewer', imports: '@oda/ace-editor',
    template: /*html*/`
    <style>:host{@apply --vertical; }</style>
    <div style="margin-bottom: 8px;align-items: center;" horizontal>
        <div>{{message}}</div>
        <oda-button @tap="_gotoError(message)" icon="enterprise:target"></oda-button>
    </div>
    <oda-ace-editor :value="code" :mode></oda-ace-editor>
    `,
    message: '',
    set code(code) {
        this.async(() => this._gotoError(this.message), 100)
    },
    mode: 'xquery',
    _gotoError(message) {
        if (message) {
            const [line, col] = message.match(/\(\d*,\s\d*\)$/)?.[0].replace(/[()\s]/g, '').split(',');
            this.$('oda-ace-editor').editor.gotoLine(line, col);
        }
    }
})