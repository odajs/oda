ODA({
    is: 'oda-camera', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host{
            @apply --vertical;
            position: relative;
            overflow: hidden;
        }
        :host video{
            @apply --flex;
        }
        :host .swap-camera-button{
            position: absolute;
            bottom: 24px;
            right: 24px;
            filter: drop-shadow(2px 2px rgba(0,0,0,0.5));
        }
        :host .record-button{
            border-radius: 50%;
            width: 50px;
            height: 50px;
            background-color: white;
            position: absolute;
            bottom: 24px;
            left: calc(50% - 25px);
        }
        :host .record-button[playing]::after{
            content: '';
            position: absolute;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            outline: 2px dashed white;
            outline-offset: '1px';
            animation: rotation 20s linear infinite;
            top: 0;
            left: 0;
        }
        :host .swap-camera-button, :host .record-button{
            opacity: 0.75;
            cursor: pointer;
        }
        @keyframes rotation {
            0% {
                transform:rotate(0deg);
            }
            100% {
                transform:rotate(360deg);
            }
        }
    </style>
    <div class="vertical flex" style="position: relative;">
        <video id="video" @tap="$this.play()"></video>
        <oda-button ~if="cameras?.length === 2" class="swap-camera-button" icon="fontawesome:s-rotate" @tap="swapCameras"></oda-button>
        <div ~if="video" class="record-button" @tap.prevent.stop="_startStop" :playing="!video.paused" ~style="_getStartStopBtnStyle()"></div>
    </div>
    <details ~if="!hideSettings && cameras?.length" ::open="settingsOpened" @tap.prevent>
        <summary @tap.prevent="settingsOpened = !settingsOpened"><b>Settings</b></summary>
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 8px; padding: 8px;">
            <div>Zoom:</div>
            <oda-camera-settings-range-control :device="cameras[this.selectedCameraIdx]" :key="'zoom'"></oda-camera-settings-range-control>
            <div>FocusMode:</div>
            <oda-camera-settings-select-control  :device="cameras[this.selectedCameraIdx]" :key="'focusMode'"></oda-camera-settings-select-control>
        </div>
    </details>
    `,
    $public: {
        hideSettings: true,
        selectedCameraIdx: {
            $type: Number,
            $save: true
        },
        mode: {
            $def: 'scanner',
            $list: [
                'video',
                'photo',
                'scanner'
            ]
        },
    },
    settingsOpened: {
        $def: false,
        $save: true
    },
    cameras: {
        $type: Array
    },
    mediaStream: null,
    get video() {
        return this.$('#video') || undefined;
    },
    $observers: {
        updateStream: 'selectedCameraIdx',
    },
    async attached() {
        if (!this.video) {
            return this.async(() => this.attached(), 100);
        }
        await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        this.cameras = (await navigator.mediaDevices.enumerateDevices()).filter(device => device.kind === 'videoinput');
        this.selectedCameraIdx ??= 0;
        this.updateStream();
    },
    async updateStream() {
        if (!this.cameras?.length) return;
        try {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: this.cameras[this.selectedCameraIdx].deviceId } });
            this.video.srcObject = this.mediaStream;
            this.video.play();
        }
        catch (err) {
            console.error(err);
        }
    },
    swapCameras() {
        this.debounce('swapCamera', () => {
            this.selectedCameraIdx = this.selectedCameraIdx === 0 ? 1 : 0;
        }, 500);
    },
    _getStartStopBtnStyle() {
        return {
            'background-color': this.video.paused ? 'white' : 'red',
        };
    },
    _startStop() {
        if (this.mode === 'scanner') {
            if (this.video.paused) {
                this.video.play();
            }
            else {
                this.video.pause();
            }
        }
    }
});
ODA({
    is: 'oda-camera-settings-control',
    capabilities: {
        get() {
            if (!this.track) return;
            this.value ??= this.track.getSettings()[this.key];
            return this.track.getCapabilities();
        }
    },
    key: '',
    value: {
        $def: undefined,
        $save: true
    },
    track: {
        get() {
            if (!this.mediaStream) return;
            return this.mediaStream.getVideoTracks()[0];
        }
    },
    // $saveKey: {
    //     get() {
    //         this.
    //     }
    // },
    mediaStream: null,
    device: {
        async set(device) {
            this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
            this.$saveKey = `${device.deviceId}/${this.key}`;
        }
    },
    $observers: {
        updateValue: 'value'
    },
    updateValue() {
        if (!this.track) return;
        this.track.applyConstraints({
            advanced: [{
                [this.key]: this.value
            }]
        });
    }
})
ODA({
    is: 'oda-camera-settings-range-control', extends: 'oda-camera-settings-control',
    template: /*html*/`
    <input ~if="capabilities" type="range" ::value :min="capabilities[key].min" :max="capabilities[key].max" :step="capabilities[key].step">
    `,
    value: {
        $def: 0,
        $save: true
    },
})
ODA({
    is: 'oda-camera-settings-select-control', extends: 'oda-camera-settings-control',
    template: /*html*/`
    <select ~if="capabilities" ::value>
        <option ~for="capabilities[key]" ~text="$for.item" :selected="$for.item === value" ></option>
    </select>
    `,
    value: {
        $def: '',
        $save: true
    },
})

