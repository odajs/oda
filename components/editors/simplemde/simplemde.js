// https://simplemde.com/
// https://github.com/sparksuite/simplemde-markdown-editor

import './dist/simplemde.min.js';

ODA({ is: 'oda-simplemde', template: /*html*/`
    <style>
        :host {
            @apply --flex;
            height: 100%;
        }
    </style>
    <link rel="stylesheet" href="./dist/simplemde.min.css">
    <link rel="stylesheet" type="text/css" href="./dist/font-awesome.min.css">
    <textarea ref="mde"></textarea>
    `,
    props: {
        simpleMde: Object,
        value: {
            type: String,
            set(n) {
                if (this.simpleMde) this.simpleMde.value(n);
            }
        }
    },
    async attached() {
        this.simpleMde = new SimpleMDE({
            element: this.$refs.mde,
            spellChecker: false,
            toolbar: [
                'bold', 'italic', "heading", 'strikethrough', '|',
                'quote', 'unordered-list', 'ordered-list', 'horizontal-rule', '|',
                'code', 'table', 'link', 'image', '|',
                'preview'/*, 'side-by-side'*/
            ],
            codeSyntaxHighlighting: true
        });
        if(this.value) this.simpleMde.value(this.value);
    }
});