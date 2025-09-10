ODA({ is: "oda-scheduler", imports: '@oda/button, @tools/containers',
    template: `
        <style>
            :host {
                @apply --vertical;
                overflow: hidden;
                height: 100%;
            }
            .title {
                z-index: 999;
                position: absolute;
                white-space: wrap;
                word-break: break-all;
                border: 1px solid red;
                background: lightyellow;
                padding: 2px;
            }
        </style>
        <oda-scheduler-toolbar :slot="showToolbar ? undefined : toolBarSlot" style="width: 100%"></oda-scheduler-toolbar>
        <div class="flex" ~is="modeTemplate"></div>
        <div ~if="title" class="title" @tap="title=undefined" ~style="style">{{title?.label}}</div>
    `,
    toolBarSlot: 'top-center',
    attached() {
        this.async(() => {
            this.currentTime = new Date();
            $ = this;
        }, 100)
    },
    get style() {
        let w = this.offsetWidth,
            left = this.title?.x + 10,
            top = this.title?.y + 10,
            maxWidth = w - (this.title?.x || 0);
        maxWidth = maxWidth > 300 ? 300 : maxWidth;
        return `max-width: ${maxWidth - 24}px; top: ${top}px; left: ${left}px;`;
    },
    showToolbar: false,
    $pdp: {
        title: undefined,
        currentTime: {
            get() {
                return this.currentTime = new Date();
            },
            set(v) {
                this.async(() => {
                    this.currentTime = new Date();
                }, 60000)
            }
        },
        taskTemplate: 'oda-scheduler-task',
        get modes() {
            return this.constructor.__rocks__.descrs.schedulerMode.$list;
        },
        schedulerMode: {
            $list: ['day', 'week', 'month', 'agenda', 'timeline'],
            $def: 'day',
            $save: true
        },
        date: {
            $type: Date,
            get() {
                return new Date();
            }
        },
        fromDate: {
            $type: Date,
            get() {
                let date = this.date;
                switch (this.schedulerMode) {
                    case 'day':
                    case 'agenda':
                    case 'timeline':
                        date = new Date(date.setHours(0, 0, 0, 0));
                        break;
                    case 'week':
                        date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1)
                        break;
                    case 'month':
                        date = new Date(date.setDate(1)).setHours(0, 0, 0, 0);
                }
                return date;
            }
        },
        get fromTime() {
            return this.fromDate.getTime();
        },
        toDate: {
            $type: Date,
            get() {
                let date = this.fromDate;
                switch (this.schedulerMode) {
                    case 'day':
                    case 'agenda':
                    case 'timeline':
                        date = new Date(date.setDate(date.getDate() + 1));
                        break;
                    case 'week':
                        date = new Date(date.setDate(date.getDate() + 7));
                        break;
                    case 'month':
                        date = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                        break;
                }
                return date;
            }
        },
        get toTime() {
            return this.toDate.getTime();
        },
        dataSet: [],
        get tasks() {
            return this.dataSet.filter(i => i);
            // return this.dataSet.filter(i => {
            //     return this.inDayTask(i.startTime, i.endTime) || this.fewDaysTask(i.startTime, i.endTime);
            // })
        },
        inDayTask(start, end, from = this.fromTime, to = this.toTime) {
            return ((end - start < 24 * 60 * 60 * 1000) && start >= from && start < to && (end <= to && end !== from));
        },
        fewDaysTask(start, end, from = this.fromTime, to = this.toTime) {
            return (start < from && end >= from && (end <= to && (end !== from))) || (end >= to && start >= from && start < to) || (start < from && end > to);
        },
        hours: 24,
        get intervalsInHour() {
            return 60 / this.interval;
        },
        get intervalsInDay() {
            return this.intervalsInHour * this.hours;
        },
        get fnDates() {
            return fDates;
        },
        weekDay(date, weekday = 'long') {
            return new Intl.DateTimeFormat('ru-Ru', { weekday }).format(date || new Date());
        }
    },
    $public: {
        focusedTime: Number,
        focusedTask: Object,
        $pdp: true,
        iconSize: 24,
        interval: {
            $def: 15,
            $list: [60, 30, 20, 15, 10, 5],
            $save: true
        },
        interval2: {
            $def: 0,
            $save: true
        }
    },
    get modeTemplate() {
        return 'oda-scheduler-' + this.schedulerMode;
    },
    async addTask(time = Date.now()) {
        let task = new TaskItem({ start: time, duration: this.interval });
        await this.editTask(task);
        this.dataSet.push(task);
    },
    async editTask(task, isEdit = false) {
        const start = task.start;
        const idx = this.dataSet.indexOf(task);
        const deleteTask = (async (e) => {
            this.dataSet.splice(idx, 1);
        })
        let buttons = [];
        if (isEdit)
            buttons = [{ label: 'Delete Task', tap: async e => await deleteTask(task) }];
        await ODA.showDialog('oda-scheduler-task-editor', { task }, { title: 'Edit task', buttons });
        this.$render();
    }
})

ODA({ is: 'oda-scheduler-toolbar',
    template: `
        <style>
            :host {
                @apply --horizontal;
                padding: 4px;
                @apply --header;
                align-items: center;
            }
            input {
                height: 32px;
                width: 160px;
                margin-left: 4px;
                outline: none;
            }
        </style>
        <oda-button @pointerdown="date=new Date()">now</oda-button>
        <oda-button icon="eva:o-arrow-back-outline" @pointerdown="dateShift"></oda-button>
        <oda-button icon="eva:o-arrow-forward-outline" @pointerdown="dateShift"></oda-button>
        <input :value-as-date="date" type="date" class="no-flex" @change="setDate">
        <div class="flex"></div>
        <oda-button ~for="modes" :label="$for.item" @pointerdown="schedulerMode = $for.item" :focused="schedulerMode === $for.item"></oda-button>
    `,
    dateShift(e) {
        const date = this.date;
        let shift = e.target?.icon.includes('back') ? -1 : 1;
        shift = this.schedulerMode === 'week' ? shift * 7 : shift;
        if (this.schedulerMode === 'month') {
            date.setMonth(date.getMonth() + shift);
        } else {
            date.setDate(this.date.getDate() + shift);
        }
        this.date = date;
    },
    setDate(e) {
        this.date = e.target.valueAsDate;
    },
    $observers: {
        setType(schedulerMode) {
            let type = 'date';
            type = this.schedulerMode === 'month' ? 'month' : type;
            type = this.schedulerMode === 'week' ? 'week' : type;
            this.$('input').type = type;
            this.$render();
        }
    }
})

ODA({ is: 'oda-scheduler-mode-view',
    template: `
        <style>
            :host {
                overflow: hidden;
                overflow-y: auto;
                @apply --vertical;
                @apply --content;
            }
        </style>
    `,
    $public: {
        $pdp: true,
        get view() {
            return this;
        }
    },
    $listeners: {
        resize(e) {
            this.$render();
        }
    },
    $listeners: {
        mousewheel(e) {
            if (!(e.ctrlKey || e.shiftKey || e.optionKey) || this.schedulerMode === 'month' || this.schedulerMode === 'agenda') return;
            e.stopPropagation();
            e.preventDefault();
            const dir = e.deltaY < 0 ? 1 : -1;
            this.debounce('scroll', () => {
                if (dir === 1) {
                    if (this.interval2 > 0) {
                        this.interval2 -= 2;
                        this.interval2 = this.interval2 <= 0 ? 0 : this.interval2;
                    } else {
                        this.interval = this.interval === 60 ? 30 : this.interval === 30 ? 20 : this.interval - 5;
                        this.interval = this.interval <= 5 ? 5 : this.interval;
                    }
                } else {
                    if (this.interval === 60) {
                        this.interval2 += 2;
                        this.interval2 = this.interval2 > 8 ? 8 : this.interval2;
                    } else {
                        this.interval = this.interval === 30 || this.interval === 60 ? 60 : this.interval === 20 ? 30 : this.interval + 5;
                    }
                }
            }, 100)

        }
    }
})

ODA({ is: 'oda-scheduler-day', extends: 'oda-scheduler-mode-view',
    template: `
        <div class="vertical dark" @tap="goDate" style="cursor: pointer; position: sticky; top: 0px; padding: 4px; z-index: 3;">
            <span class="no-flex center">{{day.getDate() + ' ' + weekDay(day, 'long')}}</span>
            <div ~is="taskTemplate" ~for="items" :task="$for.item" @dblclick.stop="editTask($for.item, true)" style="height: 20px;"></div>
        </div>
        <div class="horizontal">
            <oda-scheduler-time-scale></oda-scheduler-time-scale>
            <oda-scheduler-time-grid></oda-scheduler-time-grid>
        </div>
    `,
    $pdp: {
        day: {
            $type: Date,
            get() {
                return this.fromDate;
            }
        }
    },
    goDate() {
        this.date = fDates(this.day).short;
        this.schedulerMode = 'day';
    },
    get items() {
        let start = this.day;
        start = start.setHours(0, 0, 0, 0);
        let end = this.day;
        end = end.setDate(end.getDate() + 1);
        const result = this.tasks?.filter(i => {
            return this.fewDaysTask(i.startTime, i.endTime, start, end);
        })?.sort((a, b) => a.startTime - b.startTime) || [];
        return result;
    }
})

ODA({ is: 'oda-scheduler-time-scale',
    template: `
        <style>
            :host {
                overflow: visible;
                @apply --vertical;
                @apply --border;
                border-right: none;
            }
            .hour {
                border-top: 1px solid transparent;
            }
            label {
                font-size: xx-small;
                padding: 0px 2px;
                text-align: center;
                align-self: flex-start;
                margin-top: -6px;
            }
        </style>
        <div ~for="hours" class="hour vertical">
            <div ~for="intervalsInHour" class="horizontal" ~style="{height: iconSize+'px'}" >
                <label :dark="_getDark($for, $$for)" :bold="!$$for.index" :disabled="!!$$for.index">{{($for.index).toString().padStart(2,'0')}}:{{($$for.index * interval).toString().padStart(2,'0')}}</label>
            </div>
        </div>
    `,
    get ft() {
        let ft = new Date(this.focusedTime);
        return new Date(ft.getHours(), ft.getMinutes(), 0, 0);
    },
    _getDark(f1, f2) {
        return new Date(f1.index, f2.index * this.interval, 0, 0).getTime() === this.ft.getTime();
    }

})

ODA({ is: 'oda-scheduler-time-grid',
    template: `
        <style>
            :host {
                position: relative;
                overflow: visible;
                @apply --vertical;
                @apply --flex;
                @apply --border;
            }
            .hour {
                border-top: 1px solid var(--dark-background);
            }
            oda-scheduler-time-interval {
                border-bottom: 1px dotted var(--dark-background);
            }
            oda-scheduler-time-interval:last-child {
                border-bottom: none;
            }
            :host::before {
                content: attr(cur-time);
                position: absolute;
                left: 0px;
                right: 0px;
                height: 0px;
                top: {{timeTop}}px;
                @apply --border;
                border-color: var(--error-color);
                z-index: 2;
            }
        </style>
        <div ~for="hours" class="hour">
             <oda-scheduler-time-interval ~for="intervalsInHour" ~style="{height: iconSize+'px'}" :start-time="getTime($for.index, $$for.index * interval)"></oda-scheduler-time-interval>
        </div>
    `,
    get timeTop() {
        let t = this.currentTime;
        t = Math.ceil((t.getHours() + t.getMinutes() / 60) * 100) / 100;
        const res = t * this.iconSize * this.intervalsInHour + t;
        return res;
    },
    getTime(hour, min) {
        return this.day.setHours(hour, min, 0, 0);
    },
    $observers: {
        scrollToTime(schedulerMode, view, interval, date) {
            this.currentTime = new Date();
            view.scrollTo(0, 0);
            this.async(() => {
                view.scrollTo({ top: this.timeTop - (view.offsetHeight / 2), behavior: 'smooth' });
            }, 500)
        }
    }
})

ODA({ is: 'oda-scheduler-time-interval',
    template: `
        <style>
            :host {
                @apply --horizontal;
                box-sizing: border-box;
                padding-right: 12px;
                position: relative;
            }
            .task {
                z-index: 1;
            }
        </style>
        <div ~is="taskTemplate" class="task" ~for="items" :task="$for.item" @pointerdown.stop @dblclick.stop="editTask($for.item, true)" ~style="getHeight($for.item)"></div>
    `,
    active: {
        $attr: true,
        get() {
            return this.startTime === this.focusedTime;
        }
    },
    header: {
        $attr: true,
        get() {
            return this.endTime <= this.currentTime.getTime();
        }
    },
    get items() {
        const result = this.tasks?.filter(i => {
            return i.startTime >= this.startTime && i.startTime < this.endTime && (new Date(i.start).getDate() === new Date(i.end).getDate() || i.end < new Date(this.startTime).setHours(24, 0, 0, 0));
        })?.sort((a, b) => a.startTime - b.startTime) || [];
        return result;
    },
    startTime: Number,
    get endTime() {
        return this.startTime + (this.interval * 60 * 1000);
    },
    getHeight(task) {
        const hour = task.duration / 60,
            intervalsInDay = Math.trunc(hour * this.intervalsInHour),
            intHour = Math.trunc(hour),
            remainder = task.duration % this.interval,
            height = (intervalsInDay + (remainder ? 1 : 0)) * this.iconSize - 5 + intHour + 'px';
        return { height }
    },
    $listeners: {
        pointerdown(e) {
            this.focusedTask = undefined;
            this.focusedTime = this.startTime;
        },
        dblclick(e) {
            this.addTask(this.startTime);
        }
    }
})

ODA({ is: 'oda-scheduler-week', extends: 'oda-scheduler-mode-view',
    template: `
        <style>
            :host {
                @apply --vertical;
            }
            span {
                cursor: pointer;
            }
        </style>
        <div class="horizontal dark" style="position: sticky; top: 0px; background: white; z-index: 3; border-bottom: 1px solid var(--dark-background);">
            <label class="no-flex" style="display: block; padding: 8px 0 0 6px; font-size: x-small;"></label>
            <div ~for="7" class="flex horizontal" style="margin-left: 12px; padding: 4px;">
                <div class="vertical center flex" style="align-self: flex-start">
                    <span class="flex" style="align-items: center" @tap="setDate($for.index)" style="max-height: 20px; height: 20px; width: 100%;">{{getDate($for.index).getDate()  + ' ' + weekDay(getDate($for.index), 'short')}}</span>
                    <div class="flex" ~is="taskTemplate" ~for="items($for.index)" :task="$$for.item" @dblclick.stop="editTask($$for.item, true)" style="max-height: 20px; height: 20px; width: 100%;"></div>
                </div>
            </div>
        </div>
        <div class="horizontal flex">
            <oda-scheduler-time-scale></oda-scheduler-time-scale>
            <oda-scheduler-time-grid  ~for="7" :day="getDate($for.index)" :mode="'hideTimeScale'"></oda-scheduler-time-grid>
        </div>
    `,
    getDate(idx) {
        return new Date(this.fromDate.setDate(this.fromDate.getDate() + idx));
    },
    items(idx) {
        let start = this.getDate(idx);
        start = start.setHours(0, 0, 0, 0);
        let end = this.getDate(idx);
        end = end.setDate(end.getDate() + 1);
        const result = this.tasks?.filter(i => {
            return this.fewDaysTask(i.startTime, i.endTime, start, end);
        })?.sort((a, b) => a.startTime - b.startTime) || [];
        return result;
    },
    setDate(idx) {
        let date = new Date(this.fromDate.setDate(this.fromDate.getDate() + idx));
        this.date = fDates(date).short;
        this.schedulerMode = 'day';
    }
})

ODA({ is: 'oda-scheduler-month', extends: 'oda-scheduler-mode-view',
    template: `
        <style>
            :host {
                @apply --vertical;
                height: 100%;
                margin: 0;
                overflow: hidden;
            }
            .day-weeks {
                width: 100%;
                padding: 6px;
                text-align: center;
                border-bottom: 1px solid var(--dark-background);
            }
            .column {
                border-left: 1px solid var(--dark-background);
            }
            .month {
                border-bottom: 1px solid var(--dark-background);
                width: 100%;
                height: 100%;
                position: relative;
                overflow-y: auto;
            }
        </style>
        <div class="horizontal flex">
            <div ~for="7" class="column vertical flex">
                <div class="day-weeks">{{weekDay(new Date('2023', '04', $for.item), 'short')}}</div>
                <div ~for="6" class="month flex" ~style="{background: dates[$$for.index * 7 + $for.index || '0']?.current ? 'unset' : 'lightgray'}">
                    <div class="horizontal" style="cursor: pointer; position: sticky; top: 0; z-index: 1;" ~style="{background: dates[$$for.index * 7 + $for.index || '0']?.current ? 'white' : 'lightgray'}">
                        <div class="flex" @tap="goDate(dates[$$for.index * 7 + $for.index || '0']?.date)">{{dates[$$for.index * 7 + $for.index || '0']?.i}}</div>
                        <div class="flex" @tap.stop="addTask(dates[$$for.index * 7 + $for.index || '0']?.date)"></div>
                    </div>
                    <oda-scheduler-month-day :month-date="dates[$$for.index * 7 + $for.index || '0']?.date" @dblclick.stop="addTask(dates[$$for.index * 7 + $for.index || '0']?.date)">
                </div>
            </div>
        </div>
    `,
    get dates() {
        const dates = [];
        let startDay = new Date(this.fromDate.setDate(1)).getDay();
        startDay ||= 7;
        if (startDay !== 1) {
            const prevDate = new Date(this.fromDate.setDate(0)),
                prev = prevDate.getDate();
            for (let i = prev - startDay + 2; i <= prev; i++) {
                const date = new Date(prevDate.setDate(i));
                dates.push({ i, date, current: false });
            }
        }
        const endDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth() + 1, 0).getDate(),
            nextDate = new Date(this.fromDate.getFullYear(), this.fromDate.getMonth() + 1, 1);
        for (let i = 1; i <= endDate; i++) {
            const d = new Date(this.fromDate.setDate(i));
            dates.push({ i, date: d, current: true });
        }
        for (let i = endDate + 1; i <= 42; i++) {
            const d = new Date(nextDate.setDate(i - endDate));
            dates.push({ i: i - endDate, date: d, current: false });
        }
        return dates;
    },
    goDate(date) {
        this.date = new Date(this.fnDates(date).short);
        this.schedulerMode = 'day';
    }
})

ODA({ is: 'oda-scheduler-month-day',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                height: calc(100% - 20px);
            }
        </style>
        <div class="vertical flex" style="overflow-y: auto;">
            <div ~is="taskTemplate" :wrap="'wrap'" ~for="items" :task="$for.item" @dblclick.stop="editTask($for.item, true)" style="min-height: 20px"></div>
        </div>
    `,
    monthDate: Date,
    get endTime() {
        const end = this.monthDate;
        return end.setDate(end.getDate() + 1);
    },
    get items() {
        return this.tasks.filter(i => {
            return this.inDayTask(i.startTime, i.endTime, this.monthDate.getTime(), this.endTime) || this.fewDaysTask(i.startTime, i.endTime, this.monthDate.getTime(), this.endTime);
        }).sort((a, b) => a.startTime - b.startTime);
    }
})

ODA({ is: 'oda-scheduler-agenda', extends: 'oda-scheduler-mode-view',
    template: `
        <style>
            :host {
                @apply --vertical;
                height: 100%;
                margin: 0;
                overflow: auto;
            }
        </style>
        <div ~for="items">
            <div style="padding: 8px 4px;">{{$for.key + ' ' + weekDay(new Date($for.key))}}</div>
            <div ~is="taskTemplate" ~for="$for.item" :task="$$for.item" @dblclick.stop="editTask($$for.item, true)" style="max-height: 24px; min-height: 24px" show-time></div>
        </div>
    `,
    get items() {
        const items = {};
        const tasks = this.tasks.filter(i => {
            return this.inDayTask(i.startTime, i.endTime) || this.fewDaysTask(i.startTime, i.endTime);
        }).sort((a, b) => a.startTime - b.startTime);
        tasks.map(i => {
            const date = fDates(i.start).short;
            items[date] ||= [];
            items[date].push(i);
        })
        return items;
    },
})

ODA({ is: 'oda-scheduler-timeline', extends: 'oda-scheduler-mode-view',
    template: `
        <style>
            :host::-webkit-scrollbar {
                height: 0px !important;
            }
            :host {
                @apply --horizontal;
                overflow: auto;
                transition: visibility 0s ease-in-out;
            }
            .splitter {
                min-width: 4px;
                width: 4px;
            }
        </style>
        <oda-scheduler-timeline-day id="timeline-1" :idx="-1"></oda-scheduler-timeline-day>
        <div class="splitter"></div>
        <oda-scheduler-timeline-day id="timeline-0" :idx="0"></oda-scheduler-timeline-day>
        <div class="splitter" id="splitter"></div>
        <div ~for="deep()" class="horizontal">
            <oda-scheduler-timeline-day :idx="$for.index+1"></oda-scheduler-timeline-day>
            <div class="splitter"></div>
        </div>
    `,
    deep() {
        const deep = Math.ceil(this.offsetWidth / this.$('#timeline-0').offsetWidth) + 2;
        return deep;
    },
    $pdp: {
        isReady: false
    },
    attached() {
        const options = {
            root: this,
            rootMargin: '0px',
            threshold: .01
        }
        const callback = (entries, observer) => {
            if (!this._sign)
                return;
            let date = this.date;
            if (entries[0].isIntersecting && this._sign === -1 && entries[0].target.id === 'timeline-1') {
                this.isReady = false;
                this.style.visibility="hidden"
                this.date = new Date(date.setDate(date.getDate() - 1));
                this.$('#splitter').scrollIntoView({ inline: 'start' });
                this.scrollLeft -= entries[0].intersectionRatio * entries[0].boundingClientRect.width;
            } else if (!entries[0].isIntersecting && this._sign === 1) {
                this.isReady = false;
                this.style.visibility="hidden"
                this.date = new Date(date.setDate(date.getDate() + 1));
                this.$('#timeline-0').scrollIntoView({ inline: 'start' });
            }
            this.style.visibility="visible"
            this.isReady = true;
            this._sign = undefined;
        }
        const observer = new IntersectionObserver(callback, options);
        this.async(() => {
            this.$('#timeline-0').scrollIntoView({ inline: 'start' });
            observer.observe(this.$('#timeline-0'));
            observer.observe(this.$('#timeline-1'));
            this.isReady = true;
        }, 500)
    },
    $listeners: {
        mousewheel(e) {
            e.preventDefault();
            const _sign = this._sign = e.deltaY > 0 ? 1 : -1;
            this.scrollLeft += e.deltaY / 4;
        }
    }
})

ODA({ is: 'oda-scheduler-timeline-day', extends: 'oda-scheduler-mode-view',
    template: `
        <style>
            * {
                box-sizing: content-box;
            }
            :host {
                @apply --vertical;
                align-items: flex-start;
                overflow: unset !important;
            }
            .interval {
                border-left: 1px dotted var(--dark-background);
                width: {{iconSize+10}}px;
            }
            .grid {
                border: 1px solid var(--dark-background);
            }
            label {
                font-size: x-small;
                padding: 8px 2px;
                border-bottom:  1px solid var(--dark-background);
            }
            span {
                padding: 4px;
                position: sticky;
                left: 0px;
                opacity: {{isReady?1:0}};
                transition: opacity 0.5s ease-in-out;
            }
            task {
                transition: opacity 0.5s ease-in-out;
            }
        </style>
        <span>{{(getDate().getDate() + ' ' + weekDay(getDate(), interval2>4?'short':'long'))}}</span>
        <div class="horizontal grid flex" style="width: 100%; position: relative;">
            <div ~for="hours/(interval2||1)" class="vertical flex" ~style="{maxWidth: intervalsInHour * iconSize+10 +'px', minWidth: intervalsInHour * iconSize+10 +'px', borderLeft: $for.index===0?'none':'1px solid var(--dark-background)'}">
                <label>{{($for.index*(interval2||1)).toString().padStart(2,'0')}}:00</label>
                <div class="horizontal flex" style="position: relative; height: 100%;">
                    <div ~for="intervalsInHour" class="interval flex" ~style="{border: $$for.index===0?'none':''}"></div>
                </div>
            </div>
            <div class="task" ~if="isReady" ~is="taskTemplate" ~for="items" :task="$for.item" @dblclick.stop="editTask($for.item, true)" style="max-height: 24px; min-height: 24px; position: absolute;" ~style="{top: $for.item.idx*27+28+'px', left: getLeft($for.item), width: getWidth($for.item)}"></div>
        </div>
    `,
    idx: 0,
    getDate() {
        let date = this.fromDate;
        date = new Date(date.setDate(date.getDate() + this.idx));
        return date;
    },
    get items() {
        const date = this.getDate();
        const from = date.setHours(0, 0, 0, 0);
        const to = date.setDate(date.getDate() + 1);
        const items = {};
        const tasks = this.tasks.filter(i => {
            return this.inDayTask(i.startTime, i.endTime, from, to) || this.fewDaysTask(i.startTime, i.endTime, from, to);
        }).sort((a, b) => a.startTime - b.startTime);
        tasks.map((i, idx) => i.idx = idx);
        return tasks;
    },
    pxInMinute() {
        return this.offsetWidth / 24 / 60;
    },
    getLeft(task) {
        return this.pxInMinute() * (new Date(task.startTime).getHours()) * 60 + (new Date(task.startTime).getMinutes()) + 'px';
    },
    getWidth(task) {
        return this.pxInMinute() * task.duration + 'px';
    }
})

ODA({ is: 'oda-scheduler-task',
    template: `
        <style>
            :host {
                @apply --horizontal;
                @apply --flex;
                @apply --border;
                margin: 1px;
                position: relative;
                overflow: hidden;
            }
            :host([selected]) {
                outline: 1px dashed blue;
            }
            .mark {
                border-left: 8px solid {{task?.color || 'lightgray'}};
                border-right: 1px solid var(--header-background);
            }
            .dot {
                position: absolute;
                left: 2px;
                top: 4px;
                width: 4px;
                height: 4px;
                background: {{task?.color || 'lightgray'}};
                border-radius: 50%;
                filter: invert(1);
            }
            .row {
                opacity: 0.5;
                background-color: {{task?.color || 'lightgray'}};
            }
            label {
                font-size: small;
                padding-top: 4px;
                position: absolute;
                left: 12px;
                width: calc(100% - 14px);
                overflow: hidden;
                white-space: {{wrap}};
                word-break: break-all;
                text-overflow: ellipsis;
                align-items: center;
            }
        </style>
        <div class="dot"></div>
        <div class="mark" @pointerover="_pointerover" @pointerout="_pointerout"></div>
        <div class="horizontal flex row"></div>
        <label>{{_label}}</label>
    `,
    wrap: 'nowrap',
    selected: {
        $attr: true,
        get() {
            return this.task === this.focusedTask;
        }
    },
    showTime: false,
    get _label() { return this.label + this.time },
    get time() {
        return this.showTime ? (' [' + fDates(this.task.start).shortTime + ' ... ' + fDates(this.task.end).shortTime + ']') : '';
    },
    task: Object,
    get label() {
        return this.task?.label || this.task?.name || ''
    },
    $listeners: {
        tap(e) {
            e.stopPropagation();
            this.focusedTime = undefined;
            this.focusedTask = this.task;
        }
    },
    _pointerover(e) {
        $.title ||= { x: e.x, y: e.y, label: this.label };
    },
    _pointerout() {
        $.title = undefined;
    }
})

ODA({ is: 'oda-scheduler-task-editor', imports: '@oda/palette',
    template: `
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                background-color: var(--header-background);
            }
            label {
                opacity: .8;
                font-size: 12px;
            }
            fieldset {
                border-radius: 4px;
                padding: 2px;
                margin: 4px;
                @apply --content;
                @apply --vertical;
                border-style: double;
            }
            legend {
                font-size: x-small;
            }
            input {
                border: none;
                outline: none;
                @apply --flex;
            }
            oda-palette {
                border: 4px solid {{task.color || 'transparent'}};
                align-self: center;
                margin: 0 8px 8px 0;
            }
        </style>
        <fieldset>
            <legend>Name</legend>
            <input ::value="task.name" autofocus>
        </fieldset>
        <div class="horizontal">
            <div class="vertical">
                <fieldset style="width: 100px;">
                    <legend>Start</legend>
                    <input tabindex="0" id="start" :value="fnDates(task.start).local" type="datetime-local" @blur="setDate">
                </fieldset>
                <fieldset style="width: 100px;">
                    <legend>End</legend>
                    <input id="end" :value="fnDates(task.end).local" type="datetime-local" @blur="setDate">
                </fieldset>
            </div>
            <oda-palette ::value="task.color" colors="9" gradients="9" size="20"></oda-palette>
        </div>
    `,
    attached() {
        this.async(() => {
            this.$('input').focus();
        }, 500)
    },
    task: Object,
    setDate(e) {
        if (e.target.id === 'start')
            this.task.start = e.target.value;
        if (e.target.id === 'end')
            this.task.end = e.target.value;
    },
    get fnDates() {
        return fDates;
    }
})

const TaskItem = class extends ROCKS({
    color: {
        $type: String,
        get() {
            return this.data.color || '';
        },
        set(v) {
            this.data.color = v;
        }
    },
    name: {
        $type: String,
        get() {
            return this.data.name || '';
        },
        set(v) {
            this.data.name = v;
        }
    },
    get label() {
        return this.name;
    },
    start: {
        $type: Date,
        get() {
            return this.data.start;
        },
        set(v) {
            let end = this.end;
            this.data.start = v;
            this.end = end;
        }
    },
    get startTime() {
        return this.start.getTime();
    },
    duration: {
        $type: Number,
        get() {
            return this.data.duration || 15;
        },
        set(v) {
            this.data.duration = v;
        }
    },
    end: {
        get() {
            return new Date(this.start.getTime() + this.duration * 60000);
        },
        set(v) {
            if (v <= this.start)
                throw new Error('End time can not be less then start');
            this.duration = (new Date(v).getTime() - this.start.getTime()) / 60000;
        }
    },
    get endTime() {
        return this.end.getTime();
    },
    data: Object
}) {
    constructor(data) {
        super();
        this.data = data;
    }
}

function fDates(d = new Date()) {
    if (typeof d === 'string')
        d = new Date(d);
    const utc = d.toISOString();
    const local = new Date(d.getTime() - (d.getTimezoneOffset()) * 60 * 1000).toISOString().slice(0, -5).replace('T', ' ');
    const short = local.split(' ')[0];
    const time = local.split(' ')[1].slice(0, -3);
    const monthStr = short.slice(0, -3);
    let shortTime = short.split('-').reverse();
    shortTime = shortTime[0] + '-' + shortTime[1] + ' ' + time;
    return { utc, local, short, time, monthStr, shortTime };
}
let $;
