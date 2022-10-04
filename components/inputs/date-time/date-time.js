ODA({
    is: 'oda-date-time-input',
    template: `
        <style>
            input{
                outline: none;
                text-align: right;
                text-overflow: ellipsis;
                width: auto;
            }
        </style>
        <input type="text" :value="valueText" @keydown="onKeyDown"  @input="onValueChanged">
    `,
    get valueText(){
        var options = {timeZone: 'UTC', timeZoneName: 'long', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
        return this.value?.toLocaleString(this.locale, options) || ''
    },
    props:{
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