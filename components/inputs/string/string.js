ODA({ is: 'oda-string-input', template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
        }

        input {
            border: none;
            background-color: transparent;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            padding: 4px;
            margin-left: 2px;
            margin-right: 2px;
        }

        :host([read-only]) > input:focus {
            outline: none;
        }

        :host([read-only]) {
            opacity: .7;
            pointer-events: none;
        }

        ::-webkit-input-placeholder {
            opacity: 0.5;
        }

        ::-moz-placeholder {
            opacity: 0.5;
        }

        :-moz-placeholder {
            opacity: 0.5;
        }

        :-ms-input-placeholder {
            opacity: 0.5;
        }
    </style>
    <input ~if="_showInput()" ref="input" type="text" :value="focused?valueEdit:valueFormatted"
        :placeholder="_placeholder" :readonly="readOnly || !!args.mask" :title="_title" @input.stop="_input"
        @keydown="_keydown" @focus="_focus" @blur="focused=false">
    `,
    props: {
        focused: {
            type: Boolean,
            default: false,
            set(n) {
                if (n) this.$refs.input.focus();
                else this.$refs.input.blur();
            }
        },
        readOnly: false,
        value: String,
        valueFormatted: {
            type: String,
            get() {
                if (!this.value) return '';
                return this.value.getFormattedValue(this.args);
            }
        },
        valueEdit: {
            type: String,
            get() {
                if (!this._value) return '';
                if (this.args.mask) return this._value.getFormattedValue(this.args);
                return this._value;
            }
        },
        _value: '',
        args: {
            type: Object,
            default: {
                format: '',
                mask: '',
                placeholder: '',
                title: '',
                separator: '',
            }
        },
        _placeholder: {
            type: String,
            get() {
                if (this.readOnly) return '';
                //if (this.focused && this.args.mask) return odaString.getMaskedValue('', this.args);
                return this.args.placeholder;
            }
        },
        _title: {
            type: String,
            get() {
                if (this.readOnly || this.value) return '';
                return this.args.title;
            }
        },
        dataRoot: {
            type: Object,
            default: undefined
        },
        $field: {
            type: Object,
            default: undefined
        }
    },
    listeners: {
        focus(e) {
            if (!this.readOnly) {
                this.$refs.input.focus();
            }
        }
    },
    observers: [
        function _doStringArgs(dataRoot, $field) {
            //if ($field) { Object.assign(this.args, $field.getArgs()); }
        },
        function _valueUpdate(value){
            if(!this.focused) this._value = this.value;
        }
    ],
    _showInput() {
        return true;
    },
    _focus() {
        if (this.readOnly || this.disabled) return;
        this._oldValue = this.value;
        this.focused = true;
    },
    _input(e) {
        if (!this.args.mask){
            this.value = e.currentTarget.value;
            this._value = e.currentTarget.value;
        }
        this.fire('input', e.currentTarget.value);
    },
    _keydown(e) {
        const key = e.key;
        switch (key.toLowerCase()) {
            case 'escape':
                if (this.args.mask) this.value = this._oldValue;
                else this.$refs.input.value = this._oldValue;
                return;
            case 'delete':
                this.value = '';
                return;
            case 'backspace':
                if (this.args.mask && this.value) this.value = this.value.slice(0, -1);
                return;
        }
        if (this.args.mask && key.length === 1) {
            const i = this.$refs.input;
            const isAllSelection = (i.selectionStart === 0 && i.selectionEnd === i.value.length);
            let val = (!this.value || isAllSelection) ? '' : this.value;
            let symb = this._getClearMask(this.args.mask)[val ? val.length : 0];
            symb = odaString.checkSymbol(symb, key, '')
            if (symb) {
                this.value = (val += symb);
            } else {
                e.preventDefault();
            }
        }
    },
    _getClearMask(mask) {
        mask = mask.replace(/`0|`a|`A|`b|`B|`~|`>|`<|`#/g, '');
        return mask.replace(/[^0aAbB~><#]/g, '');
    }
})