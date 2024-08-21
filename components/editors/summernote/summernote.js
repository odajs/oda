const distPath = import.meta.url.split('/').slice(0, -1).join('/') + '/dist/';

ODA({ is: 'oda-summernote',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
            }
        </style>
        <iframe class="flex" style="border: none;"></iframe>
    `,
    editorHeight: '',
    _value: '',
    get value() {
        return this._value || '';
    },
    set value(n) {
        if (this._value !== n) {
            this._value = n;
            this.init();
        }
    },
    attached() {
        this.init();
    },
    init() {
        this.iframe = this.$('iframe');
        if (!this.iframe) return;
        this.iframe.addEventListener('load', () => {
            this.iframe.contentDocument.addEventListener('summernoteChange', (e) => {
                this.debounce('summernoteChange', () => {
                    this._value = e.detail.contents;
                    this.fire('change', this._value)
                }, 300)
            })
        })
        this.iframe.srcdoc = srcdoc(this.value, this.editorHeight);
    }
})

const srcdoc = (v, h) => {
    return `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script src="${distPath}jquery-3.4.1.slim.min.js"></script>
    <link href="${distPath}summernote-lite.min.css" rel="stylesheet">
    <script src="${distPath}summernote-lite.min.js"></script>
    <style>
        .note-editor {
            border: none !important;
        }
        .note-toolbar {
            border: 1px solid lightgray;
            position: sticky;
            top: 0;
            z-index: 1;
        }
        .note-statusbar {
            display: none;
        }
    </style>
</head>
<body>
    <div id="summernote">${v}</div>
    <script type="module">
        $('#summernote').summernote({
            placeholder: '',
            tabsize: 2,
            height: ${h || undefined},
            focus: true,
            toolbar: [
                ['style', ['style']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['link', 'picture', 'video']],
                ['table', ['table']],
                ['hr', ['hr']],
                ['font', ['strikethrough', 'superscript', 'subscript']],
                ['height', ['height']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ],
            callbacks: {
                onChange: function(contents, $editable) {
                  document.dispatchEvent(new CustomEvent("summernoteChange", { detail: { contents, $editable } }));
                }
            }
        })
    </script>
</body>
</html>
    `
}
