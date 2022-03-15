ODA({
    is: 'oda-progress-panel',
    template: /*html*/`
    <style>
        :host{
            @apply --vertical;
        }
    </style>
        <oda-progress-bar ~if="!expanded" ~props="item" @tap="open"></oda-progress-bar>
        <oda-progress-bar ~if="expanded" ~for="i in items" ~props="i" @tap="open"></oda-progress-bar>
    `,
    items: [],
    iconSize: 32,
    expanded: false,
    item() {
        if (this.items.length > 0) {
            if (this.items.length === 1) return this.items[0];
            else {
                return {
                    value: this.items.reduce((res, i) => res + i.value, 0) / this.items.length
                }
            }
        }
    },
    open(e) {
        if (this.expanded) return;
        ODA.showDropdown('oda-progress-panel', { items: this.items, expanded: true }, {parent: this});
    }

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
        :host .value-block{
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
    <div ~if="value" class="value-block" ~style="{color: value === 1 ? '#00bb00' : 'gray' }">{{~~(100*value)}}</div>
    <slot name="label"><div>{{label}}</div></slot>
    `,
    value: 0,
    background: 'silver',
    fill: '#4c4c4c',
    label: '',
    iconSize: 32,
    observers: [
        function calcRing(value) {
            const ring = this.$refs.ring;
            const circumference = ring.r.baseVal.value * 2 * Math.PI;
            if (value) {
                ring.style.removeProperty('animation');
                ring.style.setProperty('stroke-dasharray', `${circumference * value} ${circumference * (1 - value)}`);
                ring.style.setProperty('stroke-dashoffset', `${circumference / 4}`);
            } else {
                ring.style.setProperty('animation', 'dash 3s linear infinite');
            }
        }
    ]
});
