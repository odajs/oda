import './mind-map-vis/mind-map-vis.js';

ODA({
    is: 'oda-code-viewer', template: `
        <div style="display: flex; align-items: center; position: sticky; top: 0; z-index: 99; background: #FBF1D3; 
                border-top: 1px solid gray; border-bottom: 1px solid gray;">
            <div ~style="'color:' + fill">{{label}}</div>
            <div style="flex:1"></div>
            <oda-button ~if="showButRun" icon="av:play-arrow" :fill @tap="_run" title="open on new window"></oda-button>
            <oda-button icon="icons:search" :fill @tap="commands='find'" title="find"></oda-button>
            <oda-button icon="icons:help" :fill @tap="commands='openCommandPallete'" title="show help"></oda-button>
            <oda-button icon="icons:settings" :fill @tap="commands='showSettingsMenu'" title="show settings"></oda-button>
        </div>
        <oda-ace-editor :options ::value :mode :commands :readonly style="border-bottom: 1px solid gray;overflow: auto;"></oda-ace-editor>
    `,
    props: {
        options: { fontSize: 16, theme: 'ace/theme/solarized_light', mode: 'ace/mode/javascript', minLines: 100 },
        value: '',
        mode: '',
        label: '',
        fill: 'gray',
        showButRun: false,
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
            type: String,
            set(n) { 
                this._load(n); 
            }
        }
    },
    attached() {
        this.async(() => {
            var url = new URL(window.location);
            var s = url.searchParams.get("s");
            this._load(s ? s : this.src);
        });
    },
    async _load(s) {
        if (s) {
            this.label = s.replace(/\.+\//g, '');
            let src = await fetch(s);
            s = src.ok ? await src.text() : s;
            this.value = s;
        }
    },
    async _run() {
        let newWindow = window.open('/')
        newWindow.onload = () => {
            newWindow.location = URL.createObjectURL(new Blob([this.value], { type: 'text/html' }));
        };
    }
});
