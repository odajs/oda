ODA({
    is: 'oda-voice-input',
    imports: '@oda/button',
    template: `
    <style>
        :host {
            @apply --horizontal;
            @apply --no-flex;
            @apply --center;
            opacity: 0.8;
            cursor: pointer;
            /*padding: 4px;*/
            outline-offset: -1px;
        }

        :host(:not([disabled])):hover {
            opacity: 1;
            outline: 1px dotted rgba(0, 0, 0, 0.2);
        }

        :host([active]), :host(:active), :host([toggled]), :host([active]):hover, :host(:active):hover, :host([toggled]):hover {
            filter: none;
            background: none;
            opacity: 1;
        }

        :host([active]) > #icon, :host(:active) > #icon, :host([toggled]) > #icon {
            fill: red;
        }
    </style>
    <oda-button allow-toggle ::toggled="active" id="icon" ref="icon" :size="size" icon="av:mic"></oda-button>
    `,
    props: {
        value: '',
        active: {
            type: Boolean,
            reflectToAttribute: true,
        },
        size: 24,
        language: {
            type: String,
            value: 'ru-RU'
        },
        words: {
            type: Array,
        },
        _apiKey: {
            type: String,
            value: '77c703bb-5442-479f-8b74-6ef02a1ff23c'
        },
        _ttsObject: {
            type: Object
        },
        // _recognizer: {
        //     type: Object
        // },
        // _analyzer: {
        //     type: Object
        // },
        // _timerID: {
        //     type: Number
        // },
        // _infoSendBytes: {
        //     type: Object
        // },
        // _infoSendPackages: {
        //     type: Object
        // },
        // _infoProcessed: {
        //     type: Object
        // },
        // _infoFormat: {
        //     type: Object
        // },
        // _cnv: {
        //     type: HTMLCanvasElement
        // },
        // _ctx: {
        //     type: CanvasRenderingContext2D
        // }
    },
    listeners: {
        'tap': '_tap'
    },
    observers: [
        '_activeChanged(active)',
        '_sizeChanged(size)'
    ],
    async attached() {
        this._setRecognizer();
        this._cnv = document.createElement('canvas');
        this._cnv.width = this.size;
        this._cnv.height = this.size;
        this._ctx = this._cnv.getContext('2d');
        // this.appendChild(this._cnv);
    },
    _setRecognizer() {
        if (typeof webkitSpeechRecognition !== 'undefined') {
            this._recognizer = new webkitSpeechRecognition();
        }
    },
    _sizeChanged(size) {
        if (!this._cnv) return;
        this._cnv.width = size;
        this._cnv.height = size;
    },
    _tap() {
        this.active = !this.active;
    },
    _activeChanged(active) {
        this.debounce('activate', () => {
            if (active) {
                this._start();
            } else if (this._recognizer && this._recognizer.recorder && this._recognizer.recorder.recording) {
                this._stop();
            }
        }, 200);
    },
    _start() {
        if (!this._recognizer) {
            this._setRecognizer();
        }
        /**@type {SpeechRecognition} */
        const recognizer = this._recognizer;
        recognizer.interimResults = true;
        recognizer.lang = 'ru-Ru';
        recognizer.onresult = (event) => {
            const result = event.results[event.resultIndex];
            this._complete(result[0].transcript, result.isFinal);
        };
        // this._recognizer.oninfo = this._info.bind(this),
        console.log(recognizer);
        recognizer.start();
        // if (this._recognizer.constructor.name === 'SpeechRecognition') {
        //     this._recognizer.interimResults = true;
        //     this._recognizer.lang = 'ru-Ru';
        //     this._recognizer.onresult = (event) => {
        //         const result = event.results[event.resultIndex];
        //         this._complete(result[0].transcript, result.isFinal);
        //     };
        //     console.log(this._recognizer);
        //     this._recognizer.start();
        // } else {
        //     this._recognizer.start({
        //         initCallback: this.init.bind(this),
        //         dataCallback: this._complete.bind(this),
        //         errorCallback: this._error.bind(this),
        //         infoCallback: this._info.bind(this),
        //         stopCallback: this._stop.bind(this),
        //         apiKey: this._apiKey,
        //         punctuation: false,
        //         allowStrongLanguage: false,
        //         model: 'queries',
        //         applicationName: "ODANT",
        //         lang: this.language,
        //         partialResults: true,
        //         utteranceSilence: 60,
        //         expNumCount: 0
        //  });
        // }
    },
    _complete(text, done, merge, words) {
        if (done) {
            this.value = text || this.value;
            this._stop();
            this.debounce('speech-recognition-done', () => {
                this.fire('done', this.value);
            }, 100);
            console.log('Speech recognition completed. Result: ', text);
            if (this._timerID) {
                clearTimeout(this._timerID);
                this._timerID = 0;
            }
        } else if (text) {
            this.value = text;
            if (this._timerID) {
                clearTimeout(this._timerID);
            }
        } else {
            if (!this._timerID) {
                this._timerID = setTimeout(() => {
                    this._timerID = 0;
                    this._stop();
                }, 10000);
            }
        }
        if (words && words.length > 0) {
            this.words = words || this.words;
        }

    },
    _stop() {
        if (this._recognizer) {
            if (this._recognizer.recorder) this._recognizer.recorder.stop();
            this._recognizer.stop();
            this.active = false;
        }
        cancelAnimationFrame(this._renderID);
        this.$refs.icon.style.background = '';
        console.log('Speech recognition stopped');
    },
    init(sessionId, code) {
        console.log(`Speech recognition started.\r\nSession ID: ${sessionId}.\r\nServer response code: ${code}`);
        this._analyzer = this._recognizer.recorder.getAnalyserNode();
    },
    _info({ sendBytes, sendPackages, processed, format }) {
        this._infoSendBytes = sendBytes;
        this._infoSendPackages = sendPackages;
        this._infoProcessed = processed;
        this._infoFormat = format;
        this._renderID = requestAnimationFrame(this.renderCnv.bind(this));
    },
    _error(err) {
        throw err;
    },
    renderCnv() {
        if (this._analyzer) {
            const size = this._analyzer.fftSize;
            let data = new Float32Array(size);
            this._analyzer.getFloatFrequencyData(data);
            data = data.filter(i => i);
            data.sort();
            const min = data[0];
            const max = data[data.length - 1];
            const median = min / 2 - 50;
            const level = max + -min;
            const radius = -level / -400 * this.size;

            this._ctx.fillStyle = level > -median ? 'gray' : 'lightgray';
            this._ctx.clearRect(0, 0, this.size, this.size);
            this._ctx.beginPath();
            this._ctx.arc(this.size / 2, this.size / 2, radius, 0, 2 * Math.PI);
            this._ctx.fill();
            this._ctx.closePath();

            this.$refs.icon.style.background = `url(${this._cnv.toDataURL()}`;
        }
    }
});