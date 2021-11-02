import './gantt-block.js';
import odaDateTime from './lib/date-time.js';

ODA({ is: 'oda-gantt', template: /*html*/`
    <style>
        :host {
            overflow-y: auto;
            overflow-x: hidden;
        }
        td {
            font-size: 0.6em;
            border: .5px solid hsla(0, 0%, 90%, .75);
            text-align: center;
        }
        tr:first-child td {
            border-top: none;
        }
        .gantt-header {
            padding-right: .5px;
            background-color: white;
            position: sticky;
            z-index: 99;
            top: 0;
        }
    </style>
    <div ref="ganttTable" @tap.stop="_tap" @up="fire('redraw-tasks')">
        <div class="gantt-header">
            <table width="100%" style="border-collapse:collapse;table-layout:fixed">
                <tr>
                    <th ~for="(i, k) in timeLine.info" :colspan="timeLine.colspan">{{i}}</th>
                </tr>
                <tr>
                    <td :ref="c.timeStart" :id="c.timeStart" ~for="(c, k) in timeLine.columns" :style="{'background-color':c.now?'hsla(120, 100%, 94%, 1)':c.weekend?'hsla(60, 100%, 94%, .5)':''}">{{c.name}}</td>
                </tr>
            </table>
        </div>
        <table width="100%" style="border-collapse:collapse;table-layout:fixed">
            <tr ~for="(t, k) in (dde.tasks && dde.tasks.length || 1)">
                <div>
                    <td ~for="(i, k) in timeLine.columns" :style="{height: cellHeight,'background-color':i.weekend?'hsla(60, 100%, 94%, .5)':''}"></td>
                </div>
            </tr>
        </table>
    </div>
    <oda-gantt-block ~for="(t, k) in dde.tasks" :task="t"></oda-gantt-block>
    `,
    props: {
        dde: {
            type: Object,
            default: { tasks: [], _gWidth: 0, _gHeight: 0 }
        },
        timeLine: {
            type: Object,
            default: {}
        },
        timeLineStyle: {
            type: String,
            default: 'Day',
            list: ['Day', 'Week', 'Week_2', 'Week_3', 'Month', 'Year', 'Years_2', 'Years_3', 'Years_10'],
            set(n) { this.drawingTasks(); }
        },
        taskHeight: {
            type: Number,
            default: 32,
            set(n) { this.drawingTasks(); }
        },
        cellHeight: {
            type: Number,
            default: 48,
            set(n) { this.drawingTasks(10, true); }
        },
        disabledTaskText: {
            type: Boolean,
            default: false,
            set(n) { this.drawingTasks(); }
        },
        _firstAnimation: true,
    },
    listeners: {
        resize(e) {
            this.drawingTasks(0);
        },
        'redraw-tasks'(e) {
            this._onlyNeedRedraw = true;
            this.drawingTasks();
        }
    },
    attached() {
        let arr = [];
        let count = 15;
        if (count > 10) this._firstAnimation = false;
        for (let i = 0; i < count; i++) {
            [
                { taskName: 'task1 (allowed all)', id: i + '001', start: '2019-09-06 03:00:00', end: '2019-09-11 16:00:00', progress: 40, statusColor: 1, allowedMoveTask: true },
                { taskName: 'task2 (disabled resizing)', id: i + '002', start: '2019-09-06 05:00:00', end: '2019-09-06 10:00:00', progress: 50, statusColor: 101, allowedResizing: false },
                { taskName: 'task3 (disabled changeProgress)', id: i + '003', start: '2019-09-06 04:00:00', end: '2019-09-06 12:00:00', progress: 20, statusColor: 201, allowedChangeProgress: false },
                { taskName: 'task4 (allowed all)', id: i + '004', start: '2019-01-06 01:00:00', end: '2019-10-21 12:00:00', progress: 10, statusColor: 301 },
                { taskName: 'task5 (status = canceled && disabled)', id: i + '005', start: '2019-09-06 08:00:00', end: '2019-09-06 17:00:00', progress: 50, status: 'canceled', disabled: true },
                { taskName: 'task6 (status = null)', id: i + '006', start: '2019-09-06 06:30:00', end: '2019-09-06 20:30:00', progress: 60, status: '' },
            ].forEach(el => arr.push(el));
        }
        this.dde.tasks = arr.map((el, i) => {
            let val = {
                ...{
                    start: '', end: '',
                    taskName: 'Task', id: '', statusColor: 0, status: 'new', progress: 0,
                    selected: false, trackType: '', animation: this._firstAnimation,
                    disabled: false, allowedMoveTask: true, allowedChangeProgress: true, allowedResizing: true,
                    size: { width: 0, height: 0, left: 0, top: 0 }, fontSize: 14
                }, ...el
            };
            return val;
        })
        this.drawingTasks(100, true);
    },
    getTimeLine(dateStart = new Date('2019', '08', '06'), style = this.timeLineStyle) {
        if (!(dateStart instanceof Date)) dateStart = new Date();
        this.timeLine = { colspan: 12, columns: [] };
        let secondInDays = 24 * 60 * 60;
        if (style.includes('Year')) dateStart = this._dateStart = (new Date(dateStart.getFullYear(), 0, 1));
        this['_' + style](dateStart, secondInDays);
        this._timeStart = this._dateStart / 1000;
        this._timeEnd = this.timeLine.columns.slice(-1)[0].timeEnd;
        this._timeSpan = this.timeLine.columns[0].timeEnd - this.timeLine.columns[0].timeStart + 1;
    },
    _Day(ds, secondInDays, dt = new Date()) {
        ds = this._dateStart = (new Date(ds.getFullYear(), ds.getMonth(), ds.getDate()));
        this.timeLine.info = [ds.getFormattedValue('D')];
        this.timeLine.colspan = 24;
        for (var i = 0; i < 24; i++)
            this.timeLine.columns.push({
                name: i + '',
                timeStart: ds.addHours(i) / 1000,
                timeEnd: ds.addHours(i) / 1000 + (secondInDays / 24) - 1,
                now: ds / secondInDays === new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()) / secondInDays && dt.getHours() === i
            });
    },
    _Week(ds, secondInDays, dt = new Date()) {
        ds = this._dateStart = (new Date(ds.getFullYear(), ds.getMonth(), ds.getDate()));
        this.timeLine.info = [ds.getFormattedValue('dd mmmm yyyy') + ' - ' + ds.addDays(6).getFormattedValue('dd mmmm yyyy')];
        this.timeLine.colspan = 7;
        for (var i = 0; i < 7; i++)
            this.timeLine.columns.push({
                name: ds.addDays(i).getFormattedValue('D'),
                timeStart: ds.addDays(i) / 1000,
                timeEnd: ds.addDays(i) / 1000 + secondInDays - 1,
                weekend: (ds.addDays(i).getDay() === 0 || ds.addDays(i).getDay() === 6) ? true : false,
                now: dt.getDate() === ds.getDate() + i
            });
    },
    _Week_2(ds, secondInDays, dt = new Date()) {
        ds = this._dateStart = (new Date(ds.getFullYear(), ds.getMonth(), ds.getDate()));
        this.timeLine.info = [ds.getFormattedValue('dd mmmm yyyy') + ' - ' + ds.addDays(13).getFormattedValue('dd mmmm yyyy')];
        this.timeLine.colspan = 14;
        for (var i = 0; i < 14; i++)
            this.timeLine.columns.push({
                name: ds.addDays(i).getFormattedValue('ShortDate'),
                timeStart: ds.addDays(i) / 1000,
                timeEnd: ds.addDays(i) / 1000 + secondInDays - 1,
                weekend: (ds.addDays(i).getDay() === 0 || ds.addDays(i).getDay() === 6) ? true : false,
                now: dt.getDate() === ds.getDate() + i
            });
    },
    _Week_3(ds, secondInDays, dt = new Date()) {
        ds = this._dateStart = (new Date(ds.getFullYear(), ds.getMonth(), ds.getDate()));
        this.timeLine.info = [ds.getFormattedValue('dd mmmm yyyy') + ' - ' + ds.addDays(20).getFormattedValue('dd mmmm yyyy')];
        this.timeLine.colspan = 21;
        for (var i = 0; i < 21; i++)
            this.timeLine.columns.push({
                name: ds.addDays(i).getFormattedValue('ShortDate'),
                timeStart: ds.addDays(i) / 1000,
                timeEnd: ds.addDays(i) / 1000 + secondInDays - 1,
                weekend: (ds.addDays(i).getDay() === 0 || ds.addDays(i).getDay() === 6) ? true : false,
                now: dt.getDate() === ds.getDate() + i
            });
    },
    _Month(ds, secondInDays, dt = new Date()) {
        ds = this._dateStart = (new Date(ds.getFullYear(), ds.getMonth(), 1));
        this.timeLine.info = [ds.getFormattedValue('month')];
        this.timeLine.colspan = ds.getDaysInMonth();
        for (var i = 1; i <= ds.getDaysInMonth(); i++)
            this.timeLine.columns.push({
                name: new Date(ds.getFullYear(), ds.getMonth(), i).getFormattedValue('dd ddd'),
                timeStart: ds.addDays(i - 1) / 1000,
                timeEnd: ds.addDays(i - 1) / 1000 + secondInDays - 1,
                weekend: (ds.addDays(i - 1).getDay() === 0 || ds.addDays(i - 1).getDay() === 6) ? true : false,
                now: dt.getDate() === ds.getDate() + i - 1
            });
    },
    _Year(ds, secondInDays, dt = new Date()) {
        this.timeLine.info = [ds.getFormattedValue('yyyy')];
        for (var i = 0; i < 12; i++)
            this.timeLine.columns.push({
                name: odaDateTime.monthNames()[i],
                timeStart: new Date(ds.getFullYear(), i, 1) / 1000,
                timeEnd: new Date(ds.getFullYear(), i, 1) / 1000 + new Date(ds.getFullYear(), i, 1).getDaysInMonth() * secondInDays - 1,
                now: dt.getMonth() === ds.getMonth() + i
            });
    },
    _Years_2(ds, secondInDays, dt = new Date()) {
        this.timeLine.info = [ds.getFullYear(), +ds.getFullYear() + 1];
        for (var i = 0; i < 24; i++)
            this.timeLine.columns.push({
                name: odaDateTime.monthNames()[i % 12],
                timeStart: new Date(ds.getFullYear(), i, 1) / 1000,
                timeEnd: new Date(ds.getFullYear(), i, 1) / 1000 + new Date(ds.getFullYear(), i, 1).getDaysInMonth() * secondInDays - 1,
                now: dt.getMonth() === ds.getMonth() + i
            });
    },
    _Years_3(ds, secondInDays, dt = new Date()) {
        this.timeLine.info = [ds.getFullYear(), +ds.getFullYear() + 1, Number(ds.getFullYear()) + 2];
        for (var i = 0; i < 36; i++)
            this.timeLine.columns.push({
                name: odaDateTime.monthNames('ru-RU', 'short')[i % 12],
                timeStart: new Date(ds.getFullYear(), i, 1) / 1000,
                timeEnd: new Date(ds.getFullYear(), i, 1) / 1000 + new Date(ds.getFullYear(), i, 1).getDaysInMonth() * secondInDays - 1,
                now: dt.getMonth() === ds.getMonth() + i
            });
    },
    _Years_10(ds, secondInDays, dt = new Date()) {
        const isLeapYear = (year) => {
            return new Date(year, 1, 29).getDate() === 29;
        }
        this.timeLine.info = [ds.getFullYear() + ' - ' + (+ds.getFullYear() + 10)];
        this.timeLine.colspan = 11;
        for (var i = 0; i <= 10; i++)
            this.timeLine.columns.push({
                name: +ds.getFullYear() + i,
                timeStart: (new Date(ds.getFullYear() + i, 0, 1)) / 1000,
                timeEnd: (new Date(ds.getFullYear() + i, 0, 1)) / 1000 + (isLeapYear(+ds.getFullYear() + i) ? 366 : 365) * secondInDays - 1,
                now: dt.getFullYear() === ds.getFullYear() + i
            });
    },
    drawingTasks(delay = 10, animated = false) {
        this._firstAnimation = animated;
        this.getTimeLine();
        setTimeout(() => {
            let cell0 = this.$refs[this._timeStart] && this.$refs[this._timeStart][0];
            if (!cell0) return;
            this.dde._gLeft = this.$refs.ganttTable.offsetLeft;
            this.dde._gWidth = this.$refs.ganttTable.offsetWidth;
            this.dde._gHeight = this.$refs.ganttTable.offsetHeight;
            this.dde._timeInPixel = (this._timeEnd - this._timeStart) / this.dde._gWidth;
            this.dde.tasks.forEach((el, i) => {
                if ((this._onlyNeedRedraw && el.needRedraw) || !this._onlyNeedRedraw) {
                    el.disabledTaskText = this.disabledTaskText;
                    el.needRedraw = false;
                    el.isCut = false;
                    let left = this.getSize(el, el.start);
                    el.size = {
                        left: left,
                        width: this.getSize(el, el.end, left),
                        top: cell0.offsetTop + cell0.offsetHeight + (this.cellHeight - this.taskHeight) / 2 + (this.cellHeight * i) - this.dde._gHeight,
                        height: this.taskHeight
                    };
                    el.dde = this.dde;
                }
            })
            this._onlyNeedRedraw = false;
        }, delay);
    },
    getSize(el, date = new Date(), left = 0) {
        if (typeof date === 'string') date = new Date(date);
        let time = date / 1000;
        if (time >= this._timeStart && time <= this._timeEnd) {
            let res = this.timeLine.columns.filter(el => time >= el.timeStart && time <= el.timeEnd);
            if (res) {
                let step = this.$refs[res[0].timeStart][0].offsetWidth / this._timeSpan;
                res = this.$refs[res[0].timeStart][0].offsetLeft + step * (time - res[0].timeStart);
                if (left) el._width = res - (left < 0 ? 0 : left);
                return res - left;
            }
        } else {
            if (left === 0 && time < this._timeStart) {
                if (time < this._timeStart - window.outerWidth * this.dde._timeInPixel) {
                    el.isCut = true;
                    return -window.outerWidth;
                }
                let step = this.$refs[this._timeStart][0].offsetWidth / this._timeSpan;
                return this.$refs[this._timeStart][0].offsetLeft + step * (time - this._timeStart);
            } else if (time > this._timeEnd) {
                let timeStart = this.timeLine.columns.slice(-1)[0].timeStart;
                let step = this.$refs[timeStart][0].offsetWidth / this._timeSpan;
                if (time > this._timeEnd) el._width = this.dde._gWidth - (left < 0 ? 0 : left);
                if (time > this._timeEnd + window.outerWidth * this.dde._timeInPixel) {
                    el.isCut = true;
                    return this.$refs[timeStart][0].offsetLeft + step * (this._timeEnd - timeStart + 1) + step * window.outerWidth * this.dde._timeInPixel - left;
                }
                return this.$refs[timeStart][0].offsetLeft + step * (this._timeEnd - timeStart + 1) + step * (time - this._timeEnd) - left;
            }
        }
    },
    _tap() {
        this.dde.tasks.forEach(el => {
            if (el.needRedraw) this._onlyNeedRedraw = true;
            el.selected = false;
            el.trackType = '';
        });
        if (this._onlyNeedRedraw) this.drawingTasks();
    }
});
