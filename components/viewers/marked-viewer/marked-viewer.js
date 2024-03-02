import { marked } from './lib/marked.esm.js';
ODA({ is: 'oda-marked-viewer',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --fllex;
                position: relative;
                height: 100%;
            }
            iframe {
                border: none;
                width: 100%;
                opacity: 0;
                -webkit-transition: opacity 1s ease-in-out;
                -moz-transition: opacity 1s ease-in-out;
                transition: opacity 1s ease-in-out;
            }
        </style>
        <iframe></iframe>
    `,
    $pdp: {
        html: '',
        src: {
            $def: '',
            set(n) {
                if (this.isReady) {
                    this.typesetInput();
                }
            }
        },
        url: {
            $def: '',
            set(n) {
                if (n) {
                    (async () => {
                        let src = '';
                        try { src = await fetch(n) } catch (e) { console.log(e) }
                        this.src = src && src.ok ? await src.text() : n;
                    })()
                }
            }
        }
    },
    typesetInput() {
        let iframe = this.$('iframe');
        iframe.contentWindow.MathInput.value = (marked(this.src || ''));
        iframe.contentWindow.typesetInput();
    },
    async attached() {
        await new Promise((r) => setTimeout(r, 0));
        let iframe = this.$('iframe');
        iframe.addEventListener('load', async e => {
            this.typesetInput();
            iframe.contentDocument.addEventListener('click', e => {
                this.dispatchEvent(new Event('click'));
            })
            iframe.contentDocument.addEventListener('dblclick', e => {
                this.dispatchEvent(new Event('dblclick'));
            })
            const resizeObserver = new ResizeObserver((e) => {
                iframe.style.height = iframe.contentDocument.body.scrollHeight + 10 + 'px';
                iframe.style.opacity = 1;
            })
            resizeObserver.observe(iframe.contentDocument.body);
            this.isReady = true;
        })
        iframe.src = '/web/oda/components/viewers/marked-viewer/lib/editor.html';
    }
})
