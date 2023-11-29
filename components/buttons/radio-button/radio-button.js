ODA({is: 'oda-radio-button',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
        }
    </style>
    <form @input="_input">
        <div ~for="items" class="horizontal">
            <input type="radio" :id="$for.item.value || $for.item" :value="$for.item.value || $for.item" name="input">
            <label :for="$for.item.value || $for.item">{{$for.item.label || $for.item.value || $for.item}}</label>
        </div>
    </form>
    `,
    $public: {
        value: {
            $def: '',
            set(v, o) {
                const form = this.$('form');
                if (!form) {
                    this['#value'] = o;
                    this.async(() => (this.value = v), 50);
                    return;
                }
                Array.from(form.input).find(input => (input.value === v)).checked = true;
                
                // if (this.$('form').value !== v)
                //     this.$('form').value = v;
            }
        },
        items: []
    },
    _input(e) {
        this.value = e.target.value
    }
})