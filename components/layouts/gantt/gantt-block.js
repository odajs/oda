ODA({ is: 'oda-gantt-block', template: /*html*/`
    <style>
        :host {
            position: relative;
        }
        .gantt-block {
            position: absolute;
            display: flex;
            /* justify-content: center; */
            align-items: center;
            @apply --center;
            border-width: .5px;
            border-style: solid;
            border-radius: 4px;
        }
        .gantt-block-array-left,
        .gantt-block-array-right,
        .gantt-block-array-top {
            font-size: 13px;
            cursor: pointer;
            margin: 0 1px;
            z-index: 1;
        }
        .gantt-block-array-left {
            margin-right: auto;
        }
        .gantt-block-array-right {
            margin-left: auto;
        }
        .gantt-block-array-top {
            position: absolute;
        }
        .gantt-block-title {
            position: absolute;
        }
    </style>
    <div class="gantt-block" :style="styleBlock()" @tap.stop="task.selected=task.disabled?false:_move?true:!task.selected;_move=false;" @down.stop="task.trackType=task.selected?'moveTask':''" @up="task.trackType='';task.progress=task.progress>>0">
        <span ref="title" class="gantt-block-title" :style="styleTitle()">{{task.animation || task.disabledTaskText?'' : _title()}}</span>
        <div class="gantt-block-array-left" ~if="task.selected && task.allowedResizing" :style="styleArray()" @down.stop="task.trackType='retask.sizeLeft'" @up="task.trackType=''">⯇</div>
        <div class="gantt-block-array-right" ~if="task.selected && task.allowedResizing" :style="styleArray()" @down.stop="task.trackType='retask.sizeRight'" @up="task.trackType=''">⯈</div>
        <div ref="arraytop" class="gantt-block-array-top" ~if="task.selected && task.allowedChangeProgress" :style="styleArray(true)" @down.stop="task.trackType='setProgress'" @up="task.trackType='';task.progress=task.progress>>0">⯆</div>
    </div>
    `,
    props: {
        task: {
            type: Object,
            default: {
                start: '2020-01-01 12:00:00', end: '2020-01-02 12:00:00',
                taskName: 'Task', id: '', statusColor: 0, status: 'new', progress: 30,
                selected: false, trackType: '', animation: true, disabledTaskText: false,
                disabled: false, allowedMoveTask: true, allowedChangeProgress: true, allowedResizing: true,
                size: { width: 400, height: 32, left: 100, top: 100 }, fontSize: 14,
                dde: undefined,
            }
        },
        status: {
            type: String,
            default: 'new',
            list: ['new', 'inwork', 'done', 'pending', 'canceled', 'warning'],
            set(n) { this.task.status = n; }
        },
        _statusColors: {
            type: Object,
            default: { new: 180, inwork: 220, done: 130, pending: 300, canceled: 30, warning: 360 }
        },
        _width: 0,
        _move: false
    },
    listeners: {
        track(e) {
            if (this.task.trackType && e.detail.state === 'track') {
                this._move = this.task.dde.moveTask = false;
                if (this.task.trackType === 'moveTask' && this.task.allowedMoveTask && this.task.selected) {
                    this.task.dde.tasks.forEach(task => {
                        if (task.selected && task.allowedMoveTask) {
                            task.needRedraw = true;
                            task.size.left = task.size.left + e.detail.ddx;
                            task.start = new Date((new Date(task.start) / 1000 + e.detail.ddx * task.dde._timeInPixel) * 1000).getFormattedValue('FD');
                            task.end = new Date((new Date(task.end) / 1000 + e.detail.ddx * task.dde._timeInPixel) * 1000).getFormattedValue('FD');
                            this._move = true;
                        }
                    });
                } else if (this.task.trackType === 'setProgress' && this.task.allowedChangeProgress) {
                    let progress = this.task.progress + e.detail.ddx * 100 / this.task.size.width;
                    this._correctProgress(progress);
                    this._move = true;
                } else if (this.task.trackType === 'retask.sizeLeft' && this.task.allowedResizing) {
                    this._correctProgress(this.task.progress + 0.000001);
                    this.task.needRedraw = true;
                    this.task.size.left = this.task.size.left + e.detail.ddx;
                    this.task.size.width = this.task.size.width - e.detail.ddx;
                    this.task._width = this.task._width - e.detail.ddx;
                    this.task.start = new Date((new Date(this.task.start) / 1000 + e.detail.ddx * this.task.dde._timeInPixel) * 1000).getFormattedValue('FD');
                    this._move = true;
                } else if (this.task.trackType === 'retask.sizeRight' && this.task.allowedResizing) {
                    this._correctProgress(this.task.progress + 0.000001);
                    this.task.needRedraw = true;
                    this.task.size.width = this.task.size.width + e.detail.ddx;
                    this.task._width = this.task._width + e.detail.ddx;
                    this.task.end = new Date((new Date(this.task.end) / 1000 + e.detail.ddx * this.task.dde._timeInPixel) * 1000).getFormattedValue('FD');
                    this._move = true;
                }
                this.task.size.width = this.task.size.width < 1 ? 1 : this.task.size.width;
            }
        }
    },
    ready() {
        if (this.dde === undefined) this.task.dde = { _timeInPixel: 0, moveTask: '', tasks: [this.task] }
    },
    async attached() {
        if (this.task.animation) {
            let t = 20;
            for (var i = 0; i <= this.task.size.width; i += this.task.size.width / 40) {
                this._width = i;
                await timer(t--);
            }
            this.task.animation = false;
            function timer(ms) {
                return new Promise(res => setTimeout(res, ms));
            }
        }
    },
    styleBlock() {
        let size = {};
        for (let key in this.task.size) size[key] = this.task.size[key] + 'px';
        if (this.task.animation) size.width = this._width + 'px';
        return { ...size, ...this._blockColor() };
    },
    _blockColor() {
        let color = this.task.statusColor || this._statusColors[this.task.status];
        return color ? {
            'border-color': `hsla(${color}, 60%, 70%, .9)`,
            'background-image': `linear-gradient(to right, hsla(${color}, 60%, 70%, .6) ${this.task.progress}%, hsla(${color}, 60%, 70%, .3) 0%)`,
            'border-width': this.task.selected ? '2px' : '',
            'border-style': this.task.selected ? 'dashed' : ''
        } : {
                'border-color': 'hsla(0, 0%, 73%, .9)',
                'background-image': `linear-gradient(to right, hsla(0, 0%, 83%, .8) ${this.task.progress}%, hsla(0, 0%, 83%, .4) 0%)`,
                'border-width': this.task.selected ? '2px' : '',
                'border-style': this.task.selected ? 'dashed' : ''
            };
    },
    styleArray(isTop = undefined) {
        const color = this.task.statusColor || this._statusColors[this.task.status];
        let style = color ? { 'color': `hsla(${color}, 60%, 70%, .9)` } : { 'color': 'hsla(0, 0%, 73%, .9)' };
        if (isTop) {
            let progress = this._correctProgress();
            let position = {
                top: '-6px',
                left: this.task.size.width / 100 * progress - 7 + 'px'
            };
            style = { ...style, ...position };
        }
        return style;
    },
    _correctProgress(progress = this.task.progress) {
        return this.task.progress = progress < 0 ? 0 : progress > 100 ? 100 : progress;
    },
    _title() {
        return this.task.trackType === 'setProgress' ? (this.task.progress >> 0) + '%' : this.task.taskName;

    },
    styleTitle() {
        if (this.$refs.title && this.task._width)
            return {
                'text-align': 'center',
                'font-size': `${this.task.fontSize}px`,
                left: this.task.trackType !== 'setProgress' && this.$refs.title.offsetWidth >= this.task._width ?
                    (this.task.dde._gWidth - this.task._width - this.task.size.left >= this.task.size.left ?
                        this.task.size.width + 'px' : - this.$refs.title.offsetWidth + 'px') :
                    (this.task._width - this.$refs.title.offsetWidth) / 2 + (this.task.size.left < 0 ? - this.task.size.left : 0) + 'px',
                width: this.task.taskName.length * this.task.fontSize / 2 + 'px',
            }
    }
});