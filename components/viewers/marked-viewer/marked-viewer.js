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
        <iframe src="/web/oda/components/viewers/marked-viewer/lib/editor.html"></iframe>
    `,
    $pdp: {
        html: '',
        src: {
            $def: '',
            set(n) {
                let iframe = this.$('iframe');
                if (this.isReady && iframe) {
                    iframe.contentDocument.getElementById('marked-mathjax-input').value = this.src;
                    iframe.contentWindow.Preview.UpdateSrc();
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
    async attached() {
        await new Promise((r) => setTimeout(r, 0));
        let iframe = this.$('iframe');
        iframe.addEventListener('load', e => {
            iframe.contentDocument.getElementById('marked-mathjax-input').value = this.src;
            iframe.contentWindow.Preview.UpdateSrc();
            iframe.contentWindow.Preview.mjRunning = false;
            iframe.contentDocument.addEventListener('click', e => {
                this.dispatchEvent(new Event('click'));
            })
            iframe.contentDocument.addEventListener('dblclick', e => {
                this.dispatchEvent(new Event('dblclick'));
            })
            const resizeObserver = new ResizeObserver((e) => {
                iframe.style.height = iframe.contentDocument.body.scrollHeight + 10 + 'px';
                iframe.style.opacity = 1;
                this.isReady = true;
            })
            resizeObserver.observe(iframe.contentDocument.body);
        })
    }
})
