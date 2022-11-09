/* * oda.js v3.0
 * (c) 2019-2022 Igor Pasynkov, Roman Perepelkin
 * Under the MIT License.
 */
ODA({ is: 'oda-pell-editor', imports: './lib/pell.js',
    template: `
        <style>
            .pell {
                box-sizing: border-box;
                @apply --border; 
             }
            .pell-content { 
                @apply --content;
                @apply --flex;
                box-sizing: border-box; 
                outline: 0; 
                overflow-y: auto; 
                padding: 10px; 
            }
            .pell-actionbar { 
                @apply --header; 
            }
            .pell-button { 
                @apply --content;
                width: {{iconSize * 1.5}}px;
                height: {{iconSize}}px;
                vertical-align: bottom;
                margin: 1px; 
                cursor: pointer; 
                @apply --border;
            }
            .pell-button-selected { 
                @apply --dark;
            }
            .pell-button:hover {
                filter: brightness(.8); 
             }
             :host {
                @apply --vertical;
            }
        </style>
        <div id="editor" class="vertical flex" @keydown.stop></div>
    `,
    iconSize: 24,
    src: '',
    props: {
        readOnly: false,
    },
    get value() {
        return this.editor?.content?.innerHTML || ''
    },
    set value(v) {
        this.editor.content.innerHTML = v
    },
    get e(){
        return this.$('#editor');
    },
    attached(){
        this.editor ??= pell.init({
            element: this.e,
            onChange: () => this.fire('change', this.editor.content.innerHTML),
            actions: [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'heading1',
                'heading2',
                'heading3',
                'heading4',
                'heading5',
                'heading6',
                {
                    name: 'foreColor',
                    icon: '&#9734;',
                    title: 'foreColor',
                    result: async () => {
                        try {
                            let res = await ODA.showDropdown('oda-palette', { gradientMode: false }, { resolveEvent: 'value-changed' });
                            if (res) pell.exec('foreColor', res.value);
                        } catch (error) { }
                    }
                },
                {
                    name: 'backColor',
                    icon: '&#9733',
                    title: 'backColor',
                    result: async () => {
                        try {
                            let res = await ODA.showDropdown('oda-palette', { gradientMode: false }, { resolveEvent: 'value-changed' });
                            if (res) pell.exec('backColor', res.value);
                        } catch (error) { }
                    }
                },
                'olist',
                'ulist',
                'paragraph',
                'quote',
                'code',
                'line',
                'link',
                'image',
                'video',
                'html',
                {
                    name: 'Commands',
                    icon: '✓',
                    title: 'Commands',
                    result: () => {
                        let url = window.prompt('c-center, f-full, l-left, r-right, i-indent, o-outdent, 1-7 fontSize, s-subScript, u-superScript, z-unLink, <-undo, >-redo, x-removeFormat');
                        if (!url) return;
                        url = url[0].toLowerCase();
                        const comm = {
                            'c': () => pell.exec('justifyCenter'),
                            'f': () => pell.exec('justifyFull'),
                            'l': () => pell.exec('justifyLeft'),
                            'r': () => pell.exec('justifyRight'),
                            'x': () => pell.exec('removeFormat'),
                            'i': () => pell.exec('inDent'),
                            'o': () => pell.exec('outDent'),
                            's': () => pell.exec('subScript'),
                            'u': () => pell.exec('superScript'),
                            'z': () => pell.exec('unLink'),
                            '<': () => pell.exec('undo'),
                            '>': () => pell.exec('redo'),
                            '1': () => pell.exec('fontSize', url),
                            '2': () => pell.exec('fontSize', url),
                            '3': () => pell.exec('fontSize', url),
                            '4': () => pell.exec('fontSize', url),
                            '5': () => pell.exec('fontSize', url),
                            '6': () => pell.exec('fontSize', url),
                            '7': () => pell.exec('fontSize', url),
                        }
                        comm[url] && comm[url]();
                    }
                }
            ],
        })
    },
    editor: undefined,
    observers:[
        function setValue(editor, src){
            this.value = src
        },
        function setReadOnly(editor, readOnly){
            editor.content.contentEditable = !readOnly;
        }
    ]
})
