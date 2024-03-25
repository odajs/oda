import * as markdown from './lib/markdown-wasm/markdown.es.js';
import './lib/mathjax-config.js';
import './lib/mathjax/tex-mml-chtml.js';
await markdown.ready;
await MathJax.startup.promise;
const PATH = import.meta.url.replace('markdown-wasm-viewer.js','');
ODA({ is: 'oda-markdown-wasm-viewer', template: /*html*/`
    <style>
        :host {
            @apply --flex;
        }
    </style>
    <link rel="stylesheet" href="${PATH}lib/preset.css">
    <div></div>
    `,
    src: String,
    url: {
        $type: String,
        set(n) {
            if (n) {
                (async () => {
                    try {
                        const response = await fetch(n);
                        if (response.ok)
                            this.src = await response.text();
                    } catch (e) {
                        console.error(e);
                    }
                })()
            }
        }
    },
    domIsReady: false,
    $observers: {
        srcChanged(src, domIsReady) {
            if (!src) this.$('div').innerHTML = '';
            else if (src && domIsReady) {
                this.$('div').innerHTML = markdown.parse(src);
                MathJax.texReset();
                MathJax.typesetClear();
                MathJax.typesetPromise([this.$('div')]).then(() => {
                    this.fire('loaded');
                }).catch(function (err) {
                    console.error(err);
                })
            }
        }
    },
    attached() {
        this.domIsReady = true;
    }
});
