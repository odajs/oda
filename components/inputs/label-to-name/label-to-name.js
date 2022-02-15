ODA({is: 'oda-label-to-name', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            min-width: 100px;
            padding: 8px;
        }
        input {
            outline: none;
            margin: 1px;
            padding: 2px 4px;
            min-height: 24px;
            max-height: 24px;
        }
    </style>
    <input autofocus class="flex " ::value="label" :placeholder>
    <input ~if="!hideName" style="border: none" ::value="name">
    `,
    placeholder: 'Input label',
    props: {
        label: {
            type: String,
            async set(label, o) {
                this.name = label ? label.trim() : null;
            }
        },
        hideName: false,
        name: {
            type: String,
            set(name, o) {
                name = name.split(' ').map((s, i) => {
                    if (i === 0)
                        return (s === 'the') ? null : s;

                    if (s.length < 7)
                        return s;
                    return s.substring(0, 4);
                });
                name = name.join('-');
                name = name.replace(/-{2,}/g, '-');
                name = name.replace(/(^\d)/, '_$1');
                name = name.replace(/\./g, '');
                let last = name[name.length - 1];
                if (last !== ' ' && last !== '-')
                    last = '';
                if (this.transliteration)
                    this.name = this.transliteration.slugify?.(name) + last;
                else
                    this.name = name;
            }
        }
    },
    get transliteration() {
        ODA.import("@ext/transliteration").then(i => this.transliteration = i)
    },
    listeners: {
        dblclick(e) {
            e.stopPropagation();
        }
    },
    focus() {
        this.async(() => {
            const element = this.$('input');
            element.focus();
            element.selectionStart = 0;
            element.select();
        })
    },
    attached() {
        this.focus();
    }
})