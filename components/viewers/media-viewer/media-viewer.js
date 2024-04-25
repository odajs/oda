const PATH = import.meta.url.replace('media-viewer.js','');

ODA({ is: 'oda-media-viewer',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                position: relative;
                max-height: 100%;
            }
        </style>
        <iframe ~if="!isVideo && !isAudio" :src style="width: 100%; height: 100%; border: none; overflow: auto;"></iframe>
        <video ~if="isVideo" :src controls style="max-height: 100%"></video>
        <audio ~if="isAudio" :src controls style="display: flex; margin: auto;"></audio>
    `,
    src: '',
    isVideo: {
        $def: false,
        get() {
            const ext = (this.src || '').split('.').at(-1);
            return ['mp4', 'mkv', 'ogv', 'webm', 'mov', 'avi'].includes(ext);
        }
    },
    isAudio:  {
        $def: false,
        get() {
            const ext = (this.src || '').split('.').at(-1);
            return ['mp3', 'wav', 'flac', 'ogg'].includes(ext);
        }
    }
})