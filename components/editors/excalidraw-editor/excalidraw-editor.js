const libPath = import.meta.url.split('/').slice(0, -1).join('/') + '/lib/';

ODA({ is: 'oda-excalidraw-editor',
    template: `
        <style>
            :host {
                overflow: hidden;
                position: relative;
                height: 100%;
            }
            iframe {
                border: none;
                outline: none;
                padding: 0;
                margin: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
            }
        </style>
        <iframe></iframe>
    `,
    $public: {
        langCode: {
            $def: 'en-EN',
            $list: ['en-EN', 'ru-RU']
        }
    },
    data: {
        $def: undefined,
        set(n) {
            this.isReady && n && this.excalidrawAPI?.updateScene(n);
        }
    },
    lib: {
        $def: undefined,
        set(n) {
            this.isReady && n && this.excalidrawAPI?.updateLibrary({ libraryItems: n });
        }
    },
    value: {
        $def: '',
        get() {
            if (this.data)
                return JSON.stringify(this.data) || '';
            return '';
        },
        set(n) {
            if (v) {
                this._value = v;
                this.data = JSON.parse(v);
            } else {
                this.data = { elements: [] };
            }
        },
    },
    set src(v) {
        this.value = v;
    },
    attached() {
        this.iframe = this.$('iframe');
        langCode = this.langCode || 'en-EN';
        this.iframe.addEventListener('load', () => {
            this.iframe.contentDocument.addEventListener('excalidrawApi', (e) => {
                this.excalidrawAPI = e.detail.api;
                if (this.data) {
                    this.excalidrawAPI.addFiles(Object.values(this.data.files || []));
                    this.excalidrawAPI.updateScene(this.data);
                    this.async(() => {
                        this.excalidrawAPI.scrollToContent();
                        this.async(() => this.iframe.style.opacity = 1, 100);
                    }, 100)
                }
                if (this.lib)
                    this.excalidrawAPI.updateLibrary({ libraryItems: this.lib });
                this.async(() => this.isReady = true, 500);
            }, { once: true })
            this.iframe.contentDocument.addEventListener('excalidrawChange', (e) => {
                if (this.isReady) {
                    this.debounce('excalidrawChange', () => {
                        const appState = {
                            viewBackgroundColor: e.detail.appState.viewBackgroundColor,
                            theme: e.detail.appState.theme,
                            zenModeEnabled: e.detail.appState.zenModeEnabled,
                            viewModeEnabled: e.detail.appState.viewModeEnabled,
                            gridSize: e.detail.appState.gridSize,
                        }
                        const val = JSON.stringify({ appState, elements: e.detail.elements, files: e.detail.files });
                        if (this._value !== val) {
                            this._value = val;
                            this.fire('change', val);
                        }
                    }, 300)
                }
            })
        })
        this.iframe.srcdoc = srcdoc();
    }
})

let langCode = 'en-EN';
const srcdoc = () => {
    return `
<meta charset="UTF-8" />
<script src="${libPath}react.production.min.js"></script>
<script src="${libPath}react-dom.production.min.js"></script>
<script src="${libPath}excalidraw.production.min.js"></script>
<div id="app"></div>
<style>
    html, body { width: 100%; height: 100%; padding: 0; margin: 0; }
    .dropdown-menu-group { display: none; }
</style>
<script type="module">
    const App = () => {
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "div", { style: { height: "100vh" } },
                React.createElement(ExcalidrawLib.Excalidraw, {
                    langCode: "${langCode || 'en-EN'}",
                    ref: (api) => setTimeout(() => document.dispatchEvent(new CustomEvent("excalidrawApi", { detail: { api } })), 300),
                    onChange: (elements, appState, files) => document.dispatchEvent(new CustomEvent("excalidrawChange", { detail: { elements, appState, files } }))
                })
            )
        )
    }
    const excalidrawWrapper = document.getElementById("app");
    const root = ReactDOM.createRoot(excalidrawWrapper);
    root.render(React.createElement(App));
</script>
`
}
