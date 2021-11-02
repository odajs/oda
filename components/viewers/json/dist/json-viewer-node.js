ODA({
    is: 'oda-json-viewer-node',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                _margin-left: 10px;
            }
            .expander {
                box-sizing: border-box;
                width: 20px;
                height: 20px;
                margin-left: 5px;
                border: 1px solid #d2d0d0;
                text-align: center;
                font-weight: bolder;
                color: #d2d0d0;
            }
            .expander-empty {
                border: 0px solid #d2d0d0;
            }
            .node {
                @apply --horizontal;
            }
            .node * {
                vertical-align: top;
                font-family: monospace;
            }
            .key {
                font-weight: 600;
                color: rgb(85,85,85);
                margin-left: {{5 * level + 'px;'}}
            }
            .value {
                margin-left: 5px;
                color: #008e86;
            }
        </style>
        <div ~if="_value" class="node">
            <div :class="_type === 'simple' ? 'expander expander-empty' : 'expander'" ~text="_type === 'simple' ? '' : expanded ? '-' : '+'" @click="_expanderClick"></div>
            <div class="key" ~if="key" ~text="'&#34;' + key + '&#34;:'"></div>
            <div class="value">
                <div ~if="_type === 'simple'" ~text="'&#34;' + _value + '&#34;' + (notEnd ? ',' : '')"></div>
                <div ~else>
                    <div style="display: inline-block;">
                        <span ~text="_type === 'array' ? '[' : '{'"></span>
                        <div ~if="expanded" ~for="entity,i in _value">
                            <oda-json-viewer-node :key="entity.key" :value="entity.value" :level="entity.level" :not-end="i < _value.length - 1"></oda-json-viewer-node>
                        </div>
                        <span ~if="!expanded">...</span>
                        <span ~text="_type === 'array' ? ']' : '}'"></span>
                        <span ~if="notEnd" style="vertical-align: bottom;">,</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: {
        key: '',
        value : {
            type: Object,
            set(value) {
                if (value) {
                    if (Array.isArray(value)) {
                        this._type = 'array';
                        this._value = value.map(v => {
                            return { value: v, level: this.level + 1 }
                        });
                    } else if (typeof value === 'object') {
                        this._type = 'object';
                        this._value = Object.keys(value).map(key => {
                                return {
                                    key: key,
                                    value: value[key],
                                    level: this.level + 1
                                }
                            });
                    } else {
                        this._type = 'simple';
                        this._value = value;
                    }
               }
            }
        },
        expanded: true,
        level: 0,
        notEnd: false,

        _value: {
            type: [String, Array, Object],
        },
        _type: ''
    },
    _expand(e) {
        const f = () => {
            this.expanded = true;
        };
        f();
    },
    _collapse(e) {
        const f = () => {
            this.expanded = false;
        };
        f();
    },
    _expanderClick(e) {
        const f = (e) => {
            this.expanded ? this._collapse(e) : this._expand(e);
        };
        f(e);
    }
});