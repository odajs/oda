ODA({ is: 'oda-code-viewer', imports: ['@oda/ace-editor'],
    template: `
        <style> :host { overflow: hidden; } </style>
        <div style="display: flex; align-items: center; position: sticky; top: 0; z-index: 99; background: #FBF1D3; 
                border-top: 1px solid gray; border-bottom: 1px solid gray;">
            <div ~style="'color:' + fill">{{label}}</div>
            <div style="flex:1"></div>
            <oda-button ~for="_buttons" :icon="item.icon" :title="item.title" :fill @tap="_pressedButton = index"></oda-button>
        </div>
        <oda-ace-editor :options ::value :mode :commands :readonly style="border-bottom: 1px solid gray;overflow: auto;"></oda-ace-editor>
    `,
    props: {
        _pressedButton: {
            default: -1,
            set(n, o) {
                if (n >= 0) {
                    this.commands = this._buttons[n].commands;
                    this._pressedButton = -1;
                }
            }
        },
        _buttons: [
            { icon: 'icons:search', title: 'find all', commands: 'find' },
            { icon: 'icons:help', title: 'show help', commands: 'openCommandPallete' },
            { icon: 'icons:settings', title: 'show settings', commands: 'showSettingsMenu' },
        ],
        options: { fontSize: 16, theme: 'ace/theme/solarized_light', mode: 'ace/mode/javascript' },
        value: '',
        mode: '',
        label: '',
        fill: 'gray',
        readonly: true,
        commands: {
            type: String,
            set(n) {
                if (n) {
                    setTimeout(() => {
                        this.commands = '';
                    }, 500);
                }
            }
        },
        src: {
            default: '',
            set(n) { this._load(n); }
        }
    },
    attached() {
        this.async(() => {
            var url = new URL(window.location);
            var s = url.searchParams.get("s");
            this._load(s ? s : this.src);
            let mode = this.label.endsWith('.html') ? 'html' : this.label.endsWith('.md') ? 'markdown' : 'javascript';
            this.$('oda-ace-editor').mode = mode;
        }, 100);
    },
    async _load(s) {
        if (s) {
            this.label = s.replace ? s.replace(/\.+\//g, '') : s;
            let src = await fetch(s);
            s = src.ok ? await src.text() : s;
            this.value = s;
        }
    }
});
