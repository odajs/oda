ODA({ is: 'oda-md-editor', imports: '@oda/ace-editor, @oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --flex;
            }
        </style>
        <div style="display:flex; align-items: center; position: sticky; top: 0; z-index: 99; background: #282A36; border-bottom: 1px solid gray;">
            <div ~style="_info?'color:yellow':'color:'+fill">{{label}}</div>
            <div style="flex:1"></div>
            <oda-button icon="av:play-arrow" :fill @tap="_run" title="run"></oda-button>
            <oda-button icon="icons:search" :fill @tap="commands='find'" title="find"></oda-button>
            <oda-button icon="icons:help" :fill @tap="commands='openCommandPallete'" title="show help"></oda-button>
            <oda-button icon="icons:settings" :fill @tap="commands='showSettingsMenu'" title="show settings"></oda-button>
            <oda-button icon="icons:save" :fill @tap="_showDialog=true" title="save" ~if="_btnSave"></oda-button>
        </div>
        <oda-ace-editor :options ::value :src :mode :theme :lines :font-size="fontSize" :commands @tap="_showDialog=false"></oda-ace-editor>
        <div ~if="_showDialog" style=" background-color: lightgray;border: 1px solid gray;border-radius: 4px;width:200px;position:absolute;top:40px;right:10px;padding:10px;position:fixed;">
            Save all changes?
            <hr>
            <div style="display: flex;justify-content: flex-end;">
                <oda-button icon="icons:close" title="cancel" @tap="_showDialog=false"></oda-button>
                <oda-button icon="icons:check" title="save" @tap="_save"></oda-button>
            </div>
        </div>
    `,
    props: {
        options: { fontSize: 16, theme: 'ace/theme/dracula', mode: 'ace/mode/markdown', minLines: 100, wrap: true },
        src: '',
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
        fill: 'darkgray',
        _copyValue: '',
        _showDialog: false,
        _info: false,
        _btnSave: false,
        _path: '',
        _user: ''
    },
    async attached() {
        let url = new URL(window.location),
            src = url.searchParams.get("src"),
            s = url.searchParams.get("s");
        this._path = url.searchParams.get("_path");
        this._user = url.searchParams.get("_user");
        let file = src || s;
        if (file) {
            let txt = await fetch(file);
            this.value = this._copyValue = txt.ok ? await txt.text() : file;
            if (txt.ok) this.label = file;
            if (file.endsWith('.js')) this.mode = 'javascript';
            if (file.endsWith('.json')) this.mode = 'json';
            if (file.endsWith('.html')) this.mode = 'html';
            if (src) this._btnSave = true;
        }
    },
    _save() {
        this._showDialog = false;
        let arr = this.label.replace(ODA.rootPath + '/', '').split('/');
        let filename = arr.pop();
        let path = '/' + arr.join('/');
        if (this._path)
            path = this._path.substring(0, this._path.lastIndexOf('/'));
        let formData = new FormData();
        formData.append('upload', new File([this.value], filename));
        formData.append('path', path);
        formData.append('action', '/upload');
        formData.append('method', 'post');
        formData.append('enctype', 'multipart/form-data');
        let request = new XMLHttpRequest();
        request.open('POST', '/upload');
        request.send(formData);
        this._showInfo('... saved');
        this._copyValue = this.value;
    },
    _showInfo(info) {
        let l = this.label;
        this.label = info;
        this._info = true;
        setTimeout(() => {
            this._info = false;
            this.label = l;
        }, 2000);
    },
    async _run() {
        let src = URL.createObjectURL(new Blob([this.value], { type: 'text/html' }));
        window.open(ODA.rootPath + '/components/viewers/md-viewer/md-viewer.html?s=' + src, 'HTML');
    }
});
