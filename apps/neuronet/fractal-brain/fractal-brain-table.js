ODA({is: 'oda-fractal-brain-table',
    template: `
            <style>
                :host{
                    padding: 4px;
                    @apply --vertical;
                    @apply --flex;
                    overflow-x: hidden;
                    overflow-y: auto;
                }
            </style>
            <oda-fractal-brain-table-segment ~for="brain?.segments" :segment="$for.item"></oda-fractal-brain-table-segment>
        `,
})
ODA({is: 'oda-fractal-brain-table-segment',
    template: `
            <style>
                :host{
                    margin: 4px;
                    @apply --vertical;
                }
            </style>
            
            <div class="horizontal">
                <oda-fractal-brain-table-neuron-sub-data :direction="0"></oda-fractal-brain-table-neuron-sub-data>
                <oda-fractal-brain-table-neuron-sub-data :direction="1"></oda-fractal-brain-table-neuron-sub-data>
            </div>
            <div class="horizontal">
                <oda-fractal-brain-table-zone ~for="segment.zones" :zone="$for.item"></oda-fractal-brain-table-zone>
            </div>
            
        `,
    $pdp:{
        segment: Object,
    }
})
ODA({is: 'oda-fractal-brain-table-zone',
    template: `
            <style>
                :host{
                    margin: 4px;
                    @apply --vertical;
                    @apply --flex;
                    @apply --border;
                    max-width: 50%;
                    min-width: 50%;
                }
            </style>
            <div class="horizontal">
                <oda-fractal-brain-table-neuron-sub-data  header :direction="0"></oda-fractal-brain-table-neuron-sub-data>
                <oda-fractal-brain-table-neuron-sub-data  header :direction="1"></oda-fractal-brain-table-neuron-sub-data>
            </div>
            <oda-fractal-brain-table-neuron  ~for="zone.neurons" :neuron="$for.item"></oda-fractal-brain-table-neuron>
        `,
    $pdp:{
        zone: Object,
        get curDirection() {
            return this.zone.curDirection;
        }
    }
})
ODA({is: 'oda-fractal-brain-table-neuron',
    template: `
            <style>
                :host{
                    @apply --horizontal;
                    @apply --flex;
                    font-size: x-small;
                }
                div{
                    outline: 1px solid silver;
                }
                span{
                    padding: 0px 2px;
                }
                .label{
                    width: 30px;
                    text-align: end;
                }

            </style>
            <oda-fractal-brain-table-neuron-data :focused="neuron === focusedNeuron"></oda-fractal-brain-table-neuron-data>
        `,
    get ins(){
        return this.neuron.data.$i
    },
    get outs(){
        return this.neuron.data.$o
    },
    get inValue(){
        return this.neuron?.inValue
    },
    get outValue(){
        return this.neuron?.outValue
    },
    $pdp:{
        neuron: Object,
    }
})
ODA({is:'oda-fractal-brain-table-neuron-data',
    template:`
            <style>
                :host{
                    @apply --horizontal;
                    @apply --flex;
                }
            </style>
            <oda-fractal-brain-table-neuron-sub-data :direction="0"></oda-fractal-brain-table-neuron-sub-data>
            <oda-fractal-brain-table-neuron-sub-data :direction="1"></oda-fractal-brain-table-neuron-sub-data>
        `
})
ODA({is:'oda-fractal-brain-table-neuron-sub-data',
    template:`
            <style>
                :host{
                    @apply --vertical;
                    @apply --flex;
                    outline: 1px solid silver;
                    max-width: 50%;
                    min-width: 50%;
                    font-size: xx-small;
                    overflow: hidden;
                }

            </style>
            {{data?.slice(1)}}
        `,
    direction: Number,
    get data(){
        return this.neuron.data[this.direction]
    },
    get value(){
        return this.data?.[0];
    },
    get weights(){
        return this.data?.slice(1);
    }
})