ODA({is: 'oda-embedding',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --dark;
                overflow: hidden;
                max-height: 300px;
            }
            span{
                padding: 4px;
                width: 150px;
                font-size: small;

            }
        </style>
        <div flex style="overflow-y: auto;">
            <div stadow ~for="tokenizer?.vocabulary" vertical>
                <div class="horizontal">
                    <span no-flex>{{$for.item.id}}: {{$for.key}}</span>
                    <div class="flex" ~style="getBackGradient($for.item.emb.data)"></div>
                    <span style="text-align: right;" no-flex>{{(+$for.item.error).toLocaleString('ru-RU', {style: 'percent',  minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
                </div>
            </div>
        </div>
        <div class="horizontal">
            <span>tokens: {{this.tokenizer?.size || 0}}</span>
            <span>error:  {{tokenizer?.error.toLocaleString('ru-RU', {style: 'percent',  minimumFractionDigits: 2, maximumFractionDigits: 2})}}</span>
        </div>


    `,
    tokenizer: null,
    get error(){
        return this.tokenizer?.error;
    },
    get size(){
        return this.tokenizer?.size;
    },
    getBackGradient(vector){
        return {background: `linear-gradient(to right, ${this.getColors(vector)})`}
    },
    getColors(items){
        const getColor = (val)=>{
            return Math.round(300 * val);
        }
        const length = items.length
        return  Array.from(items || []).map((val, idx, items)=>{
            return `hsl(${getColor(val)}, 100%, 50%) ${((idx+1)/length) * 100}%, hsl(${getColor(items[idx+1] || 0)}, 100%, 50%)  ${((idx+1)/length) * 100}%`;
        }).join(', ');
    },
})