ODA({is: 'oda-basic-input',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --flex;
            box-sizing: border-box;
            font-family: inherit;
            background-color: transparent;
            text-align: start;
            border-radius: 1px;
            position: relative;
            padding-top: {{hideLabel ? 'unset' : '8px'}};
            pointer-events: {{readOnly ? 'none' : 'initial'}};
        }
        :host label {
            display: {{hideLabel ? 'none !important' : 'initial'}};
        }
        :host > input {
            border: none;
            background-color: inherit;
            /*color: inherit;*/
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            padding: 4px;
            font-family: inherit;
            font-size: inherit;
            text-align: inherit;
            font-weight: inherit;
        }
        :host > input:not([type=color])[readonly] {
            opacity: 0.7;
        }
        :host > input[type="number"]{
            text-align: end;
        }
        :host > input:focus {
            outline: none;
        }
        :host(:focus-within) {
            box-shadow: 0px -1px 0px 0px inset var(--focus, blue);
        }
        ::-webkit-input-placeholder {
            opacity: 0.5;
            text-align: start;
        }
        ::-moz-placeholder {
            opacity: 0.5;
            text-align: start;
        }
        :-moz-placeholder {
            opacity: 0.5;
            text-align: start;
        }
        :-ms-input-placeholder {
            opacity: 0.5;
            text-align: start;
        }
        :host(:not([placeholder])) .placeholder{
            display: none;
        }
        :host .placeholder {
            position: absolute;
            display: inline-block;
            bottom: 2px;
            transform: translate3d(0px, 0px, 0px);
            transition: all 0.25s;
            opacity: 0.25;
            margin-left: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: calc(100% - 8px);
            font-size: normal;
        }
        
        :host input:focus ~ .placeholder,
        :host input.up ~ .placeholder {
            bottom: unset;
            font-size: 75%;
            opacity: 0.5;
            transform: translate3d(0px, -75%, 0px);
        }
    </style>
    <input ref="input" id="input" :type="_type" :min :max :maxlength :minlength :step :accept :autocomplete autofocus :pattern
    @focus.stop="_focus" @blur.stop="_blur" :list="list?.length?'datalist':''" @input.stop="_input" @change.stop="_input" ~style="{height: _type === 'checkbox' ? \`\${iconSize}px\` : 'unset'}" :read-only="disabled" :value="focused ? _value : value" :checked="_type === 'checkbox' ? value : false" :placeholder="hideLabel ? placeholder : ''" ~class="{'up': String(value) || ['checkbox', 'date'].includes(type)}">
    <label for="input" ~text="placeholder" class="placeholder"></label>
    <oda-button ~if="showClear" ~style="{opacity: $refs.input.value ? '0.8' : '0.25'}" icon="icons:clear" @tap.stop="$refs.input.value = '';$refs.input.dispatchEvent(new Event('change'))"></oda-button>
    <datalist ~if="list?.length" id="datalist">
        <option ~for="i in list" :value="i">{{i}}</option>
    </datalist>
    `,
    props: {
        value: {
            type: [String, Boolean, Number, Object],
        },
        _value: {
            set(value) {
                if (this.readOnly) return;
                this.value = value;
                this.fire('value-changed', value, { bubbles: false });
            }
        },
        type: 'text',
        _type() {
            let type = this.type?.toLowerCase() || typeof this.value;
            type = type === 'undefined' ? 'string' : type;
            switch (type) {
                case 'boolean': return 'checkbox';
                case 'number':
                case 'date':
                case 'color': return type;
                case 'string':
                default: return 'text';
            }
        },
        label: {
            set(v) {
                this.placeholder = v;
            }
        },
        placeholder: {
            type: String,
            default: '',
        },
        min: '',
        max: '',
        maxlength: '',
        minlength: '',
        step: '',
        accept: '',
        autocomplete: '',
        pattern: '',
        list: Array,
        focused: false,
        iconSize: 24,
        disabled: false,
        readOnly: {
            type: Boolean,
            set(v) {
                this.disabled = v;
            },
        },
        showClear: false,
        hideLabel: false,
        selectionStart: {
            type: Number,
            get() {
                return this.$refs.input.selectionStart;
            },
            set(v) {
                this.$refs.input.selectionStart = v;
            },
        },
        selectionEnd: {
            type: Number,
            get() {
                return this.$refs.input.selectionEnd;
            },
            set(v) {
                this.$refs.input.selectionEnd = v;
            },
        },
        selectionDirection: {
            type: String,
            get() {
                return this.$refs.input.selectionDirection;
            },
            set(v) {
                this.$refs.input.selectionDirection = v;
            },
        }
    },
    observers: [
        function setValue(value) {
            if (value) {
                this.$refs.input.setAttribute('value', value);
            } else {
                this.$refs.input.removeAttribute('value');
            }
            this['#_value'] = undefined;
        }
    ],
    listeners: {
        focus() {
            if (this.focused) return;
            this.focused = true;
            this.focus();
        },
    },
    _focus(e) {
        if (this.focused) return;
        this.focused = true;
        this.fire('focus', { sourceEvent: e });
    },
    _blur(e) {
        if (!this.focused) return;
        this.focused = false;
        this.fire('blur', { sourceEvent: e });
    },
    focus() {
        this.$refs.input.focus();
    },
    blur() {
        this.$refs.input.blur();
    },
    select() {
        this.$refs.input.select();
    },
    setSelectionRange(...args) {
        this.$refs.input.setSelectionRange(...args);
    },
    _input() {
        const type = this._type?.toLowerCase();
        const v = this.$refs.input.value;
        switch (type) {
            case 'number': this._value = parseFloat(v) ?? 0; break;
            case 'color':
                this.focused = true;
                this.async(() => {
                    this._value = this.$refs.input.value;
                    this.focused = false;
                }, 10);
                break;
            case 'checkbox':
                this._value = this.$refs.input.checked;
                break;
            case 'date':
            default: this._value = v; break;
        }
    },
});