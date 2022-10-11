ODA({
    is: 'oda-date-time-input',
    template: `
        <style>
             :host{
                @apply --vertical;
                @apply --border;
            }
            input{
                outline: none;
                text-overflow: ellipsis;
                border: none;
                @apply --flex;
            }
        </style>
        <input tabindex="0" @focus="_focus" @blur="_focus" type="text" :value="valueText" @keydown="onKeyDown"  @input="onValueChanged">
    `,
    _focus(e){
        this.__focused = (e.type === 'focus');

    },
    set __focused(n){
        if (n){
            this.$next(()=>{
                this.input.selectionStart = 0;
                this.input.selectionEnd = 100000;
                this.setPos();
            })
        }
    },
    get valueText(){
        var options = {}
        if (this.hour12)
            options.hour12 = this.hour12;
        if (this.timeZone !== 'none')
            options.timeZone = this.timeZone;
        if (this.weekday !== 'none')
            options.weekday = this.weekday;
        if (this.timeZoneName !== 'none')
            options.timeZoneName = this.timeZoneName;

        if (this.era !== 'none')
            options.era = this.era;
        if (this.year !== 'none')
            options.year = this.year;
        if (this.month !== 'none')
            options.month = this.month;
        if (this.day !== 'none')
            options.day = this.day;
        if (this.hour !== 'none')
            options.hour = this.hour;
        if (this.minute !== 'none')
            options.minute = this.minute;
        if (this.second !== 'none')
            options.second = this.second;

        let locale = this.locale;
        if (this.calendar && this.calendar !== 'none'){
            locale += '-ca-'+this.calendar;
        }
        return this.value?.toLocaleString(locale, options) || ''
    },
    props:{
        iso:{
            get (){
                return this.value?.toISOString?.() || '';
            }
        },
        calendar:{
            default: 'none',
            list: ['none', "buddhist", "chinese", "coptic", "ethioaa", "ethiopic", "gregory", "hebrew", "indian", "islamic", "islamicc", "iso8601", "japanese", "persian", "roc"],
        },
        hour12: false,
        timeZone: {
            default: 'none',
            list: ['none', "UTC"],
            category: 'format',
        },
        timeZoneName:{
            default: 'none',
            list: ['none', "short", "long"],
            category: 'format',
        },
        weekday:{
            default: 'none',
            list: ['none', "narrow", "short" , "long"],
            category: 'format',
        },
        era:{
            default: 'none',
            list: ['none', "narrow", "short" , "long"],
            category: 'format',
        },
        year:{
            default: 'none',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        month: {
            default: 'none',
            list: ['none', "numeric", "2-digit", "narrow", "short", "long"],
            category: 'format',
        },
        day: {
            default: 'none',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        hour: {
            default: 'none',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        minute: {
            default: 'none',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        second: {
            default: 'none',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        locale: {
            default: 'ru-RU',
            get list(){
                return ODA.loadJSON("@tools/localization/locales.json").then(list =>{
                    const result = [];
                    for (let key in list){
                        result.push({label: key+': '+list[key], value: key})
                    }
                    return result.sort((a,b)=>{
                        return a.value>b.value?1:-1
                    });
                })
            }
        },
        value: {
            type: Date,
            readOnly: true,
            set(n){
                if (n === 0){
                    this.render();
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.endInt;
                    })
                }
            }
        },
    },
})