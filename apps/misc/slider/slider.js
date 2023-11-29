ODA({ is: 'oda-slider', imports: '@oda/icon',
    template: `
        <style>
            :host {
                display: flex;
                flex-direction: {{thumbnails === "horizontal" ? "column" : "row"}};
                @apply --flex;
                justify-content: center;
                position: relative;
                height: 100%;
                width: 100%;
            }
            .img {
                height: 100%;
                width: 100%;
                object-fit: {{fit}};
                animation: img-in {{interval / 4000}}s ease-in-out;
            }
            @keyframes img-in {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            @keyframes img-out {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }
            .thumbnails {
                overflow-x: {{thumbnails === "horizontal" ? "auto" : "hidden"}};
                overflow-y: {{thumbnails === "horizontal" ? "hidden" : "auto"}};
                width:  {{thumbnails === "horizontal" ? "100%" : "100px"}};
                height: {{thumbnails === "horizontal" ? "70px" : "100%"}};
                margin-left: {{thumbnails === "horizontal" ? "unset" : "2px"}};
            }
            .thumbnails img {
                cursor: pointer;
                width: 100px;
                margin: 2px;
                opacity: .5;
            }
            .thumbnails .selected {
                opacity: 1;
            }
            oda-icon {
                position: absolute;
                top: 50%;
                cursor: pointer;
                color: white;
            }
        </style>
        <div style="position: relative; width: 100%;" ~style="{height: thumbnails === 'horizontal' && !hideThumbnails ? 'calc(100% - 70px)' : '100%'}">
            <img class="img" :src="images[this.idx || 0]" alt="" />
            <a :href="images[this.idx || 0]" target="_blank">
                <oda-icon icon-size="24" icon="bootstrap:card-image" style="top: 10px; right: 10px; background: rgba(200, 200, 200, .3); padding: 4px;"></oda-icon>
            </a>
            <oda-icon icon-size="48" icon="bootstrap:chevron-left" style="left: 10px" @tap="_tap(-1, true)"></oda-icon>
            <oda-icon icon-size="48" icon="bootstrap:chevron-right" style="right: 10px;" @tap="_tap(1, true)"></oda-icon>
        </div>
        <div ~if="!hideThumbnails" class="thumbnails" ~class="_class">
            <img ~class="{selected: idx===$for.index}" ~for="images" :src="$for.item" @tap="_tapThumbnails($for.index)" :id="'img-'+$for.index"/>
        </div>
    `,
    $public: {
        interval: {
            $def: 3000,
            $save: true
        },
        hideThumbnails: {
            $def: false,
            $save: true
        },
        thumbnails: {
            $def: 'horizontal',
            $list: ['horizontal', 'vertical'],
            $save: true
        },
        play: {
            $def: false,
            set(v) {
                if (v) {
                    if (this.interval > 0) {
                        this._interval = setInterval(() => this._tap(1), this.interval);
                    }
                } else {
                    if (this._interval) {
                        clearInterval(this._interval);
                        this._interval = undefined;
                    }
                }
            }
        },
        useFade: {
            $def: true,
            $save: true
        },
        fit: {
            $def: 'cover',
            $list: ['cover', 'contain', 'fill', 'scale-down', 'unset', 'none'],
            $save: true
        }
    },
    images: [],
    idx: 0,
    get _class() { return this.thumbnails === 'horizontal' ? 'horizontal' : 'vertical' },
    _tap(i = 0, stopPlay, idx) {
        const img = this.$('.img');
        if (this.useFade)
            img.style.animationName = 'img-out';
        if (stopPlay) this.play = false;
        this.async(() => {
            if (idx >= 0)
                this.idx = idx;
            this.idx += i;
            this.idx = this.idx < 0 ? this.images?.length - 1 : this.idx >= this.images?.length ? 0 : this.idx;
            if (this.useFade)
                img.style.animationName = 'img-in';
            this.$('#img-' + this.idx)?.scrollIntoView({ inline: 'center', block: 'center', behavior: 'smooth' });
        }, this.interval / 4 - 100);
    },
    _tapThumbnails(idx) {
        this._tap(0, true, idx);
    },
    attached() {
        const shuffle = (array) => array.sort(() => Math.random() - 0.5);
        this.images = shuffle(this.images);
        this.play = true;
    }
})
