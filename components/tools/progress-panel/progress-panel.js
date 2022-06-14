ODA({is: 'oda-progress-panel',
    template: `
    <style>
        :host{
            @apply --vertical;
            min-height: {{iconSize + 8}}px;
            overflow: hidden;
        }
    </style>
    <div ~if="items?.length && !expanded && show" class="horizontal" style="align-items: center;">
        <oda-progress-bar ~props="item" :hide-percent="hidePercents" :task="item" :hide-label="hideLabels" hide-buttons style="cursor: pointer;"></oda-progress-bar>
        <div ~if="!hideLabels && (items?.length || 0) > 1" >{{items?.length || ''}} requests</div>
    </div>
    <div ~if="items?.length && expanded" style="overflow: auto;">
        <oda-progress-bar ~for="i in items" ~props="i" :task="i" :hide-label="hideLabels"></oda-progress-bar>
    </div>
    `,
    items: [],
    iconSize: 64,
    expanded: false,
    _show: false,
    get show() {
        this.items?.length;
        this.interval('show', () => {
            this._show = this.items?.length !== 0;
        }, this.delay);
        return this._show;
    },
    delay: 500,
    props: {
        hideLabels: false,
        hidePercents: true,
    },
    get item() {
        if (this.items.length > 0) {
            if (this.items.length === 1) return this.items[0];
            else {
                return {
                    progress: this.items.reduce((res, i) => res + i.progress, 0) / this.items.length,
                    error: this.items.some(i => i.error)
                }
            }
        }
    },
    listeners: {
        tap: 'tap'
    },
    tap(e) {
        if (this.expanded) return;
        ODA.showDialog('oda-progress-panel',
            { items: this.items, expanded: true },
            {
                title: 'Task monitor',
                autosize: false,
                hideOkButton: true,
                buttons: [{
                    label: 'Clear',
                    execute: () => { this.items.splice(0, this.items.length) }
                }]
            }
        );
    },
});
ODA({is: 'oda-progress-bar',
    extends: [],
    template: /*html*/`
    <style>
        :host{
            @apply --horizontal;
            align-items: center;
            padding: 2px;
            position: relative;
            {{Boolean(error) ? 'color: red; fill: red;' : ''}}
            overflow: hidden;
            text-overflow: ellipsis;
        }
        :host svg{
            padding: 2px;
            height: {{iconSize||0}}px;
            width: {{iconSize||0}}px;
        }
        :host svg circle {
            transform-origin: center;
        }
        :host svg circle {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
        }
        :host .progress-block{
            position: absolute;
            line-height: {{iconSize+2}}px;
            width: {{iconSize+2}}px;
            left: 3px;
            top: 3px;
            text-align: center;
            font-size: 70%;
        }
        :host oda-icon{
            transform: translate3d(-50%, 20%, 0);
            left: 50%;
            position: absolute;
        }
        :host .text{
            font-size: {{iconSize/3}}px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
            max-height: 100%;
        }

        @keyframes dash {
            0% {
                stroke-dasharray: 0 {{$refs.ring?.r.baseVal.value * 2 * Math.PI}};
                stroke-dashoffset: {{($refs.ring?.r.baseVal.value * 2 * Math.PI)/4}};
            }
            50% {
                stroke-dasharray: {{$refs.ring?.r.baseVal.value * 2 * Math.PI}} 0;
                stroke-dashoffset: {{($refs.ring?.r.baseVal.value * 2 * Math.PI)/4}};
            }
            60% {
                stroke-dasharray: {{$refs.ring?.r.baseVal.value * 2 * Math.PI}} 0;
                stroke-dashoffset: {{($refs.ring?.r.baseVal.value * 2 * Math.PI)/4}};
            }
            90% {
                stroke-dasharray: 0 {{$refs.ring?.r.baseVal.value * 2 * Math.PI}};
                stroke-dashoffset: {{-$refs.ring?.r.baseVal.value * 2 * Math.PI + ($refs.ring?.r.baseVal.value * 2 * Math.PI)/4}};
            }
            100% {
                stroke-dasharray: 0 {{$refs.ring?.r.baseVal.value * 2 * Math.PI}};
                stroke-dashoffset: {{-$refs.ring?.r.baseVal.value * 2 * Math.PI + ($refs.ring?.r.baseVal.value * 2 * Math.PI)/4}};
            }
        }
    </style>
    <svg :viewBox="\`0 0 \${iconSize} \${iconSize}\`" class="progress-ring no-flex">
        <circle ref="ring" :stroke="error ? 'red' : stroke" fill="transparent" stroke-width="3" :r="~~(iconSize/ 7 * 3)" :cx="iconSize / 2" :cy="iconSize / 2"/>
    </svg>
    <div ~if="!hidePercent && progress" class="progress-block" ~style="{color: progress === 1 ? '#00bb00' : 'gray' }">
        <div ~if="!error || progress < 1" class="text">{{~~(100*progress)}}</div>
        <oda-icon :icon-size="iconSize*0.75" ~if="error && (progress === 0 || progress === 1)" icon="icons:error"></oda-icon>
    </div>
    <div ~if="!hideLabel" class="text" style="overflow: hidden; text-overflow: ellipsis;">{{label}}</div>
    <div class="flex"></div>
    <div ~if="!hideButtons" class="no-flex horizontal">
        <!-- <oda-button icon="icons:info-outline" @tap="showInfo"></oda-button> -->
        <oda-button icon="icons:close" @tap="closeTask"></oda-button>
    </div>
    `,
    progress: 0,
    stroke: '#0075ff',
    label: '',
    error: null,
    task: null,
    props: {
        hideButtons: false,
        hidePercent: false,
        hideLabel: false,
    },
    observers: [
        function calcRing(progress) {
            const ring = this.$refs.ring;
            const circumference = ring.r.baseVal.value * 2 * Math.PI;
            if (progress) {
                ring.style.removeProperty('animation');
                ring.style.setProperty('stroke-dasharray', `${circumference * progress} ${circumference * (1 - progress)}`);
                ring.style.setProperty('stroke-dashoffset', `${circumference / 4}`);
            } else {
                ring.style.setProperty('animation', 'dash 3s linear infinite');
            }
        }
    ],
    showInfo() {

    },
    closeTask() {
        this.task.remove?.();
    }
});
