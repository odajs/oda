ODA({
    is: 'oda-loader',
    extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host{
            visibility: hidden;
            position: fixed !important;
            top: calc(50% - {{iconSize/2}}px);
            left: calc(50% - {{iconSize/2}}px);
            z-index: 100;
            transform: translate3d(-50%, -50%, 0);
            pointer-events: none;
            opacity: 0.5;
            animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        {{''}}
    </style>
    `,
    $wake: true,
    iconSize: 64,
    icon: 'icons:settings',
    fill: 'var(--info-color)',
    tasks: {
        $def: [],
        set() {
            if (this.tasks.length > 0) {
                this._tasksChanged();
            }
            else {
                this.throttle('set-tasks-throttle', () => {
                    this._tasksChanged();
                }, this.delay);
            }
            this._tasksChanged();
        }
    },
    _show: false,
    delay: 300,
    addTask(task) {
        if (!task) return;
        if (this.tasks.some(t => t.id === task.id)) return;
        this.tasks.push(task)
        this.tasks = [...this.tasks];
    },
    removeTask(task) {
        if (!task) return;
        const idx = this.tasks.findIndex(t => t.id === task.id);
        if (~idx) this.tasks.splice(idx, 1);
        this.tasks = [...this.tasks];
    },
    _tasksChanged() {
        this.style.visibility = (this.tasks.length > 0)?'visible':'hidden'
        // this._show = this.tasks.length > 0;
        this.$render();
        // this.async(()=>{
        //     this.$render();
        // }, 100)
    }
});
let loaderPromise;
export async function getLoader() {
    if (ODA.top.__loader) return ODA.top.__loader;
    return loaderPromise ??= new Promise(async (resolve, reject) => {
        if (window === ODA.top) {
            try {
                await ODA.waitReg('oda-loader');
                ODA.top.__loader = ODA.top.document.body.querySelector('oda-loader');
                if (!ODA.top.__loader) {
                    ODA.top.__loader = ODA.top.document.createElement('oda-loader');
                    ODA.top.document.body.appendChild(ODA.top.__loader);
                }
                resolve(ODA.top.__loader);
            }
            catch (err) {
                console.error('Error on get loader: ', err);
                reject(err);
            }
        }
        else {
            return ODA.top.__loader;
        }
    })
}