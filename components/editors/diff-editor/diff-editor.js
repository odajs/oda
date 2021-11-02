ODA({ is: 'oda-diff-editor', imports: '@oda/monaco-editor', extends: 'oda-monaco-editor',
    props: {
        originalText: String,
        modifiedText: String
    },
    observers: [
        function setValues(originalText, modifiedText, _editor) {
            if(originalText && modifiedText && _editor) {
                const originalModel = monaco.editor.createModel(originalText, 'text/plain');
                const modifiedModel = monaco.editor.createModel(modifiedText, 'text/plain');
                _editor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });
            }
        }
    ],
    _setEditor() {
        this._editor = monaco.editor.createDiffEditor(this.$refs.editor, {
            theme: this.theme,
            readOnly: this.readOnly,
            enableSplitViewResizing: false
        });
    }
});