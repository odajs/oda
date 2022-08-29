ODA({
    is: 'oda-error-viewer', imports: '@oda/ace-editor',
    template: /*html*/`
    <style>:host{@apply --vertical; }</style>
    <div ~for="messages" style="margin-bottom: 8px;align-items: center;" horizontal>{{item}}<oda-button @tap="_gotoError(item)" icon="enterprise:target"></oda-button> </div>
    <oda-ace-editor :value="code" :mode></oda-ace-editor>
    `,
    messages: [],
    set code(code) {
        this.async(() => this._gotoError(this.messages?.[0]), 100)
    },
    mode: 'xquery',
    _gotoError(message) {
        if (message) {
            const [line, col] = message.match(/\(\d*,\s\d*\)$/)?.[0].replace(/[()\s]/g, '').split(',');
            this.$('oda-ace-editor').editor.gotoLine(line, col);
        }
    }
})