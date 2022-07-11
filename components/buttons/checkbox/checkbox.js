ODA({is: "oda-checkbox", extends: 'oda-icon',
    imports: ['@oda/icon'],
    attached(){ // todo: временное решение
        this.icon = this.icons[this.state];
    },
    props: {
        // icon(){
        //     return this.icons[this.state];
        // },
        value: {
            type: Boolean,
            set(n) {
                if (!this.threeStates)
                    this.state = n ? 'checked' : 'unchecked';
            }
        },
        state: {
            list: ['unchecked', 'checked', 'indeterminate'],
            default: 'unchecked',
            set(n){
                this.value = n === 'checked';
                this.icon = this.icons[n]; // todo: временное решение
            }
        },
        threeStates: {
            default: false,
            set(n, o){
                if (o && this.state === 'indeterminate')
                    this.state = 'unchecked';
            }
        },
    },
    get states(){
        return this.props.state.list;
    },
    icons:{
        checked: 'icons:check-box',
        unchecked: 'icons:check-box-outline-blank',
        indeterminate: 'icons:check-box-indeterminate'
    },
    listeners: {
        tap(e) {
            // e.stopPropagation();
            if (this.threeStates) {
                let newStateIndex = (this.states.indexOf(this.state) + 1) % 3;
                this.state = this.states[newStateIndex];
            } else
                this.value = !this.value;
        }
    }
});
