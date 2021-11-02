ODA({ is: 'oda-html-editor', imports: ['@oda/ace-editor', '@oda/button'],
    template: /*html*/`
        <style>
            :host {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: stretch;
                height: 100vh;
            }
        </style>
        <div style="display: flex; flex: 0 0 auto; align-items: center; background: #ddd; position:sticky;top:0;z-index:9; 
                border-top: 1px solid gray; border-bottom: 1px solid gray;">
            <div ~style="'color:' + fill">{{label}}</div>
            <div style="flex:1"></div>
            <div ~if="showEditor" style="display: flex;align-items: center;">
                <input type="number" title="ACE lines" min=5 max=50 step=5 ::value="lines" ~style="'color:' + fill +';border: 1px solid '+ fill"
                        style="width:40px; background-color: #ddd; color: darkgray; text-align: center; outline: none;height:22px; opacity:50%"></input>
                <oda-button ~for="_buttons" :icon="item.icon" :title="item.title" :fill @tap="_pressedButton = index"></oda-button>
            </div>
            <oda-button icon="icons:code" :fill allow-toggle ::toggled="showEditor" title="show editor"></oda-button>
        </div>
        <oda-ace-editor ~if="showEditor" :options ::value :mode :theme :font-size="fontSize" :commands :lines style="border-bottom: 1px solid gray;height: 400px"></oda-ace-editor>
        <div style="flex:1">
            <iframe :srcDoc=value style="width: 100%; height: 100%; border: none;"></iframe>
        </div>
    `,
    props: {
        _pressedButton: {
            default: -1,
            set(n, o) {
                if (n >= 0) {
                    if (n) this.commands = this._buttons[n].commands;
                    else this._run();
                    this._pressedButton = -1;
                }
            }
        },
        _buttons: [
            { icon: 'av:play-arrow', title: 'open on new window', commands: '_run' },
            { icon: 'icons:search', title: 'find all', commands: 'find' },
            { icon: 'icons:help', title: 'show help', commands: 'openCommandPallete' },
            { icon: 'icons:settings', title: 'show settings', commands: 'showSettingsMenu' },
        ],
        options: { fontSize: 16, theme: 'ace/theme/chrome', mode: 'ace/mode/html' },
        src: {
            default: '',
            set(n) { this._load(n); }
        },
        value: '',
        lines: '',
        mode: '',
        theme: '',
        fontSize: '',
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
        label: '',
        fill: 'gray',
        showButRun: false,
        showEditor: false
    },
    attached() {
        this.async(() => {
            var url = new URL(window.location);
            var s = url.searchParams.get("s");
            this._load(s ? s : this.src);
        });
    },
    async _load(s = this.src) {
        this.label = 'Source code:';
        if (s && s.endsWith('.html')) {
            this.label = s.replace(/\.+\//g, '');
            let src = await fetch(s);
            s = src.ok ? await src.text() : s;
        }
        this.value = s;
    },
    async _run() {
        let newWindow = window.open('/')
        newWindow.onload = () => {
            newWindow.location = URL.createObjectURL(new Blob([this.value], { type: 'text/html' }));
        };
    }
});
