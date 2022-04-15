ODA({is: 'oda-number-input', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
        }
        :host([read-only]) {
            opacity: .7;
            pointer-events: none;
        }
        input {
            border: none;
            background-color: transparent;
            text-align: right;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            padding: 4px;
            margin-left: 2px;
            margin-right: 2px;
        }
        input[readonly] {
            outline: none;
            pointer-events: none;
        }
    </style>
    <input ref="input" :value="_focused?valueEdit:valueFormatted" :readonly="readOnly" :style="{color: _color}" @input.stop="_input" @focus="_focused = true" @blur="_focused = false" @keydown.stop="_keydown">
    <oda-button icon="enterprise:calculator" ~if="!readOnly && showCalculator" @tap="_showCalculator"></oda-button>
    `,
    props: {
        focused: {
            type: Boolean,
            default: false,
            set(n) {
                if (this._focused !== n) this._focused = n;
            }
        },
        readOnly: false,
        showCalculator: false,
        value: Number,
        valueFormatted: {
            type: String,
            get() { return this.value; }
            //get() { return odaNumber.getFormattedValue(this.value, this.args); }
        },
        valueEdit: {
            type: String,
        },
        format: {
            type: String,
            //enum: Object.keys(odaNumber.FORMATS_NUMBER),
            set(n) { this.args.format = n }
        },
        min: {
            type: Number,
            set(n) { this.args.min = n }
        },
        max: {
            type: Number,
            set(n) { this.args.max = n }
        },
        useMinMax: {
            type: Boolean,
            set(n) { this.args.useMinMax = n }
        },
        places: {
            type: String,
            set(n) { this.args.places = n }
        },
        locale: {
            type: String,
            enum: ['ru-RU', 'en-US', 'ua-UA', 'ar-EG', 'zh-Hans-CN-u-nu-hanidec', 'th-TH-u-nu-thai'],
            set(n) { this.args.locale = n }
        },
        args: {
            type: Object,
            default: {
                label: 'Calculator',
                format: '', places: '', locale: '',
                min: 0, max: 0, useMinMax: false,
                prefix: '', postfix: '',
                zeroColor: 'hsla(0, 0%, 50%, .4)', minusColor: 'red', plusColor: '',
                showZero: true
            }
        },
        dataRoot: {
            type: Object,
            default: undefined
        },
        $field: {
            type: Object,
            default: undefined
        },
        _color: {
            type: String,
            get() {
                if (this.value === 0 && !this.focused) return this.args.zeroColor;
                if (this.value >= 0) return this.args.plusColor;
                if (this.value < 0) return this.args.minusColor;
            }
        },
        _focused: {
            type: Boolean,
            default: false,
            set(n) {
                if (n && !this.readOnly) {
                    this.valueEdit = this.value || '';
                    this.$refs.input.focus();
                    if (!this.focused) this.focused = true;
                } else {
                    this.$refs.input.blur();
                    if (this.focused) this.focused = false;
                }
            }
        }
    },
    listeners: {
        focus(e) {
            e.stopPropagation(); // This prevents the crazy fields focusing
            if (!this.readOnly) this._focused = true;
        }
    },
    _keydown(e) {
        const key = e.key.toLowerCase();
        if (!(e.ctrlKey || e.shiftKey) && !/[0-9\-\,\.]|backspace|delete|arrowleft|arrowright|home|tab/.test(key)) {
            e.preventDefault();
            this.$refs.input.value = this.valueEdit;
        }
        switch (e.key.toLowerCase()) {
            case '-':
                e.preventDefault();
                this.valueEdit = isNaN(this.valueEdit) ? 0 : -(parseFloat(this.valueEdit))
                this.value = isNaN(this.valueEdit) ? undefined : this.valueEdit;
                break;
            case '.':
            case ',':
                //const validFormat = this.args && this.args.format && odaNumber._getValidFormat(this.args.format);
                const validFormat = this.args && this.args.format;
                if (validFormat && validFormat === 'integer') {
                    e.stopPropagation();
                    e.preventDefault();
                } else {
                    const stringValue = this.$refs.input.value;
                    if (stringValue.includes('.') || stringValue.includes(',')) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
                break;
        }
    },
    _input() {
        let val = this.$refs.input.value.replace(/,/g, '.');
        val = isNaN(val) ? '0' : val;
        this.valueEdit = val;
        this.value = isNaN(this.valueEdit) ? undefined : this.valueEdit;
    },
    async _showCalculator() {
        if (!this._list) {
            this._list = document.createElement('oda-calculator');
            this._list.value = this.valueEdit;
            this.async(() => {
                this.$('input')?.focus();
            })
            const item = (await ODA.showDropdown(this._list, {}, { parent: this, useParentWidth: true })).focusedItem;
            this.valueEdit = item?.value;
            this._list = undefined;
        }
        else {
            this._list.value = this.valueEdit;
            return;
        }
        // try {
        //     let val = await ODA.showCalculator(this.valueEdit);
        //     this.valueEdit = val;
        // }
        // catch (e) { }
    }
})