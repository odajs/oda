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
        <input tabindex="0" :error @focus="_focus" @blur="_focus" type="text" :value="valueText" @keydown="onKeyDown" :title="valueText"  @input="onValueChanged">
    `,
    onValueChanged(e){
        try{
            console.log(e.target.value)
            console.log(Date.parse(e.target.value))
            this.value = new Date(Date.parse(e.target.value));
        }
        catch (e){
            console.log(e)
        }
    },
    onKeyDown(e){
    //     switch (e.key) {
    //         case '.':
    //         case ',':{
    //             e.preventDefault();
    //             for (let i  of this.startArray){
    //                 if (e.target.selectionStart<i){
    //                     e.target.selectionStart = i;
    //                     break;
    //                 }
    //             }
    //         } return;
    //     }
    //     switch (e.keyCode){
    //         case 188:
    //         case 190:{
    //             e.preventDefault();
    //             for (let i  of this.startArray){
    //                 if (e.target.selectionStart<i){
    //                     e.target.selectionStart = i;
    //                     break;
    //                 }
    //             }
    //         } return;
    //     }
    },
    get startArray(){
        let  arr = [this.startYear, this.startMonth, this.startDay, this.startHour, this.startMinute, this.startSecond];
        arr = arr.sort((a,b)=>{
            return a>b?1:-1
        })
        return  arr;
    },
    get startYear(){
        return this.testModel.indexOf('3333');
    },
    get startMonth(){
        return this.testModel.indexOf('11');
    },
    get startDay(){
        return this.testModel.indexOf('22');
    },
    get startHour(){
        return this.testModel.indexOf('13');
    },
    get startMinute(){
        return this.testModel.indexOf('42');
    },
    get startSecond(){
        return this.testModel.indexOf('43');
    },
    get testModel(){
        try{
            return this.testDate?.toLocaleString(this.locale, {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'}) || '';
        }
        catch (e){
            return e.message;
        }
    },
    created(){
        this.testDate = new Date(Date.parse('3333-11-22:13:42:43'));
    },
    testDate: null,

    get input(){
        return this.$('input')
    },
    error: '',
    _focus(e){
        this.__focused = (e.type === 'focus');
    },
    set __focused(n){
        if (n){
            this.input.type = 'date'
            // this.$next(()=>{
            //     this.input.selectionStart = this.startDay;
            //     this.input.selectionEnd = this.startDay+2;
            //     this.setPos();
            // },2)
        }
        else{
            this.input.type = 'text'
        }

    },
    setPos(){
        this.render();
    },
    get valueText(){
        return this.calcText(this.value, this.__focused);
    },
    calcText(value){
        try{
            this.error = '';
            let locale = this.locale;
            if (this.calendar && this.calendar !== 'none'){
                locale += '-ca-'+this.calendar;
            }
            let options = {};
            if (!this.__focused){
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
            }
            else{
                return this.value?.toISOString().substring(0,10);
                options = {day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'};
            }
            const res = this.value?.toLocaleString(locale, options) || '';
            if (res === 'Invalid Date')
                throw new Error('');
            return res;
        }
        catch (e){
            if (!this.__focused)
                return (this.error = e.message);
            const res = this.value.toString();
            if (res === 'Invalid Date')
                return '';
            return this.value?.toISOString().substring(0,10);
        }
    },
    props:{
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
            default: 'numeric',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        month: {
            default: '2-digit',
            list: ['none', "numeric", "2-digit", "narrow", "short", "long"],
            category: 'format',
        },
        day: {
            default: '2-digit',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        hour: {
            default: '2-digit',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        minute: {
            default: '2-digit',
            list: ['none', "numeric", "2-digit"],
            category: 'format',
        },
        second: {
            default: '2-digit',
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
function isDigit(ch){
    switch (ch){
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            return true;
    }
    return false;
}