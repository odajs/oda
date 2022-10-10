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
            }
        </style>
        <input type="text" :value="valueText" @keydown="onKeyDown"  @input="onValueChanged">
    `,
    get valueText(){
        var options = {}
        if (this.hour12){
            options.hour12 = this.hour12;
        }
        if (this.timeZone !== 'none'){
            options.timeZone = this.timeZone;
        }
        switch (this.weekday){
            case 'narrow':
            case 'short':
            case 'long':{
                options.weekday = this.weekday;
            } break;
        }
        switch (this.era){
            case 'narrow':
            case 'short':
            case 'long':{
                options.era = this.era;
            } break;
        }
        switch (this.year){
            case 'numeric':
            case '2-digit':{
                options.year = this.year;
            } break;
        }
        switch (this.month){
            case  "numeric":
            case "2-digit":
            case "narrow":
            case "short":
            case "long":{
                options.month = this.month;
            } break;
        }
        switch (this.day){
            case 'numeric':
            case '2-digit':{
                options.day = this.day;
            } break;
        }
        switch (this.hour){
            case 'numeric':
            case '2-digit':{
                options.hour = this.hour;
            } break;
        }
        switch (this.minute){
            case 'numeric':
            case '2-digit':{
                options.minute = this.minute;
            } break;
        }
        switch (this.second){
            case 'numeric':
            case '2-digit':{
                options.second = this.second;
            } break;
        }
        switch (this.timeZoneName){
            case 'short':
            case 'long':{
                options.timeZoneName = this.timeZoneName;
            } break;
        }
        return this.value?.toLocaleString(this.locale, options) || ''
    },
    props:{
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