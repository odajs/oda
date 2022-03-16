ODA({
    is: 'oda-progress-panel',
    template: `
    <style>
        :host{
            @apply --vertical;
            min-height: {{iconSize + 8}}px;
            cursor: pointer;
        }
    </style>
    <div ~if="items.length && !expanded" class="horizontal" style="align-items: center;">
        <oda-progress-bar ~props="item" :hide-label="hideLabels"></oda-progress-bar>
        <div ~if="!hideLabels && items.length > 1" >{{items.length}} requests</div>
    </div>
    <div ~if="items.length && expanded">
        <oda-progress-bar ~for="i in items" ~props="i" :hide-label="hideLabels"></oda-progress-bar>
    </div>
    `,
    items: [],
    iconSize: 32,
    expanded: false,
    props: {
        hideLabels: false,
    },
    attached() {
        this.listen('message', 'messageHandler', { target: top });
    },
    detached() {
        this.unlisten('message', 'messageHandler', { target: top });
    },
    messageHandler(e) {
        console.log(e);
    },
    get item() {
        if (this.items.length > 0) {
            if (this.items.length === 1) return this.items[0];
            else {
                return {
                    value: this.items.reduce((res, i) => res + i.value, 0) / this.items.length
                }
            }
        }
    },
    listeners: {
        tap: 'tap'
    },
    tap(e) {
        if (this.expanded) return;
        ODA.showDropdown('oda-progress-panel', { items: this.items, expanded: true }, { parent: this });
    },
});
ODA({
    is: 'oda-progress-bar',
    extends: [],
    template: /*html*/`
    <style>
        :host{
            @apply --horizontal;
            align-items: center;
            padding: 2px;
            position: relative;
            {{error ? 'color: red; fill: red;' : ''}}
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
    <style>{{}}</style>
    <svg :viewBox="\`0 0 \${iconSize} \${iconSize}\`" class="progress-ring">
        <circle ref="ring" stroke="#0075ff" fill="transparent" stroke-width="2" :r="~~(iconSize/ 7 * 3)" :cx="iconSize / 2" :cy="iconSize / 2"/>
    </svg>
    <div ~if="progress" class="progress-block" ~style="{color: progress === 1 ? '#00bb00' : 'gray' }">{{~~(100*progress)}}</div>
    <div ~if="!hideLabel" style="overflow: hidden; text-overflow: ellipsis;">{{label}}</div>
    `,
    progress: 0,
    background: 'silver',
    fill: '#4c4c4c',
    label: '',
    iconSize: 32,
    error: null,
    hideLabel: false,
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
    ]
});
