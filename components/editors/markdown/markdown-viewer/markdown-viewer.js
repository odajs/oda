import * as markdown from './lib/markdown-wasm/markdown.es.js';
import './lib/mathjax-config.js';
import './lib/mathjax/tex-mml-chtml.js';
import './lib/highlight.min.js';
await markdown.ready;
await MathJax.startup.promise;
const PATH = import.meta.url.replace('markdown-viewer.js','');
ODA({ is: 'oda-markdown-viewer', template: /*html*/`
        <link rel="stylesheet" :href="presetcss">
        <div class="md-wasm"></div>
    `,
    value: String,
    presetcss: `${PATH}lib/preset.css`,
    url: {
        $type: String,
        async set(n) {
            try {
                const response = await fetch(n);
                if (response.ok)
                    this.value = await response.text();
            } catch (e) {
                console.error(e);
            }
        }
    },
    domIsReady: false,
    $observers: {
        srcChanged(value, domIsReady) {
            if (!value) this.$('div').innerHTML = '';
            else if (value && domIsReady) {
                this.$('div').innerHTML = markdown.parse(value, {
                    onCodeBlock(lang, str) {
                        str = String.fromCharCode.apply(null, str);
                        if (lang && hljs.getLanguage(lang)) {
                            try {
                                return hljs.highlight(lang, str).value;
                            } catch (err) { }
                        }
                        try {
                            return hljs.highlightAuto(str).value;
                        } catch (err) { }
                        return '';
                    }
                })
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
    },
    async exportValue() {
        let css = await fetch(this.presetcss);
        css = await css.text();
        const wasm = this.$('.md-wasm');
        const html = wasm?.outerHTML;
        return { css, html, type: 'md' };
    }
})
