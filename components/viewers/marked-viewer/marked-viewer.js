import { marked } from './lib/marked.esm.js';
import markedKatex from 'https://cdn.jsdelivr.net/npm/marked-katex-extension@5.0.1/+esm';

ODA({ is: 'oda-marked-viewer',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --fllex;
                position: relative;
                height: 100%;
            }
            .katex-html { display: none; }
        </style>
        <div ~html></div>
    `,
    $pdp: {
        html: '',
        src: {
            $def: '',
            set(n) {
                n && (this.html = marked.parse(n));
            }
        },
        url: {
            $def: '',
            set(n) {
                if (n) {
                    (async () => {
                        if (!this.isUse) {
                            this.isUse = true;
                            const options = { throwOnError: false }
                            marked.use(markedKatex(options));
                        }
                        let src = '';
                        try { src = await fetch(n) } catch (e) { console.log(e) }
                        this.src = src && src.ok ? await src.text() : n;
                    })()
                }
            }
        }
    }
})
