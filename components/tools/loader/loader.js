ODA({
    is: 'oda-loader',
    extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host{
            visibility: {{_show ? 'visible' : 'hidden'}};
            position: fixed !important;
            top: 50%;
            left: 50%;
            z-index: 100;
            transform: translate3d(-50%, -50%, 0);
            pointer-events: none;
            opacity: 0.5;
        }
        {{''}}
    </style>
    `,
    $wake: true,
    iconSize: 64,
    icon: 'odant:spin',
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
            this.debounce('set-tasks-debounce', () => {
                this._tasksChanged();
            }, 5 * this.delay);
        }
    },
    _show: false,
    delay: 1000,
    addTask(task) {
        if (!task) return;
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
        this._show = this.tasks.length > 0;
        this.$render();
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