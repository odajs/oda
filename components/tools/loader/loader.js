ODA({
    is: 'oda-loader',
    extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host{
            position: fixed !important;
            top: 50%;
            left: 50%;
            z-index: 100;
            transform: translate3d(-50%, -50%, 0);
            pointer-events: none;
            opacity: .5;
        }
    </style>
    `,
    $wake: true,
    iconSize: 64,
    icon: 'odant:spin',
    fill: 'var(--info-color)',
    tasks: [],
    _show: {
        $def: true,
        set(v) {
            this.style.setProperty('visibility', v ? 'visible' : 'hidden');
        }
    },
    delay: 1000,
    addTask(task) {
        if (!task) return;
        this.tasks.push(task);
        this._tasksChanged();
    },
    removeTask(task) {
        if (!task) return;
        const idx = this.tasks.findIndex(t => t.id === task.id);
        if (~idx) this.tasks.splice(idx, 1);
        this._tasksChanged();
    },
    _tasksChanged(tasks = this.tasks) {
        this.debounce('_tasksChanged', () => {
            this._show = this.tasks.length !== 0;
        }, this.delay);
        this.debounce('fallback', () => {
            this._show = this.tasks.length !== 0;
        }, 5_000);
    }
});
let loader;
export async function getLoader() {
    if (loader) return loader;
    await ODA.waitReg('oda-loader');
    loader = document.body.querySelector('oda-loader');
    if (!loader) {
        loader = document.createElement('oda-loader');
        document.body.appendChild(loader);
    }
    return loader;
}