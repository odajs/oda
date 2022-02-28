ODA({is: 'oda-accordion',
    template: /*html*/`
    <style>
        :host{
            @apply --flex;
            @apply --vertical;
            @apply --header;
            overflow: hidden;
        }
        span{
            text-align: center;
        }
    </style>
    <slot></slot>
    `,
    props: { iconSize: 24 },
    ready() {
        // this.async(() => { if (this.children.length) this.children[0].expanded = true; });
        if (this.children.length) this.children[0].expanded = true;
    },
    listeners: {
        'expanded-changed'() {
            Array.from(this.children).forEach(el => el.expanded = false);
        }
    }
});

ODA({is: 'oda-accordion-item', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            @apply --no-flex;
            overflow: hidden;
        }
        :host([expanded]){
            @apply --flex;
            flex-basis: 100%;
        }
        :host([expanded])>.bar{
            font-weight: bold;
            font-size: larger;
        }
        .bar{
            align-items: center;
            cursor: pointer;
            min-height: 40px;
            margin: 1px 0px;
        }
        .more{
            padding: 4px;
            color: red;
        }
    </style>
    <div class="bar shadow no-flex header horizontal" @down="_expand">
        <oda-icon :icon-size :icon="icon" :hide-icon="!icon"></oda-icon>
        <span class="flex" ~style="{ fontSize: fontSize, textAlign: textAlign }">{{label}}</span>
        <slot name="accordion-item-bar" class="more vertical no-flex" ~if="expanded"></slot>
        <oda-icon :icon-size :icon="expanded?'icons:chevron-right:90':'icons:chevron-right'" style="opacity: .5"></oda-icon>
    </div>
    <div class="content vertical flex" ~if="expanded" style="overflow: hidden;">
        <slot></slot>
    </div>
    `,
    props: {
        label: '',
        icon: '',
        expanded: {
            type: Boolean,
            default: false,
            reflectToAttribute: true
        },
        fontSize: 'small',
        textAlign: 'center',
    },
    _expand() {
        this.parentElement.fire('expanded-changed');
        this.expanded = true;
    }
});
