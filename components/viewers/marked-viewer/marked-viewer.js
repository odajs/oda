import { marked } from './lib/marked/marked.esm.js';
import './lib/mathjax-config.js';
import './lib/mathjax/tex-mml-chtml.js';

ODA({ is: 'oda-marked-viewer', template: /*html*/`
    <style>
        :host {
            @apply --flex;
        }
        h1, h2, h3, h4, h5, h6 { padding-top: 0; margin-top: 0 }
        h4, h5 { padding-bottom: 0; margin-bottom: 6px; }
        h6 { padding-bottom: 0; margin-bottom: 4px; }
        h1 { font-size: 2.0736em; font-weight: 300; }
        h2 { font-size: 1.728em; font-weight: 300; }
        h3 { font-size: 1.44em; font-weight: 200; }
        h4 { font-size: 1.2em; font-weight: 200; }
        h5 { font-size: 1.14em; font-weight: 200; }
        h6 { font-size: 0.83333em; font-weight: 200; }
        hr { opacity: .2;  }
        blockquote {
            color: #6a737d;
            margin: 1em 2em;
            padding: 0 1em;
            margin: 0;
            border-left: 5px solid lightgray;
        }
        img {
            max-width: 90%;
        }
    </style>
    <div></div>
    `,
    loadMathJax() {
        MathJax.startup.promise.then(() => {
            this.mathJaxReady = true;
        });
    },
    mathJaxReady: false,
    src: String,
    url: {
        $type: String,
        set(n) {
            if (n) {
                (async () => {
                    let src = '';
                    try { src = await fetch(n) } catch (e) { console.log(e) }
                    this.src = src?.ok ? await src.text() : n;
                })()
            }
        }
    },
    $observers: {
        srcChanged(src, mathJaxReady) {
            if (!src) this.$('div').innerHTML = '';
            else if (src && mathJaxReady) {
                this.$('div').innerHTML = marked.parse(src);
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
    async attached() {
        if(!this.mathJaxReady) this.loadMathJax();
    }
})