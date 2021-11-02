ODA({is: 'oda-rating', imports: '@oda/icon', template: /*html*/`
     <style>
        :host {
            position: relative;
            @apply --horizontal;
            cursor: pointer;
        }
        oda-icon:hover{
            transform: scale(1.2);
        }
    </style>
    <oda-icon :fill="color" ~for="count" :icon-size :icon="getIcon(index)" @tap="setValue(index)"></oda-icon>
    `,
    props: {
        iconSize: 32,
        count: 5,
        color: 'gold',
        value: 0,
    },
    getIcon(index) {
        const v = (index + 1) / this.count;
        if (v <= this.value)
            return 'icons:star';
        if (Math.round(v * 10 - this.value * 10)/10< (1 / this.count))
            return 'icons:star-half';
        return 'icons:star-border';
    },
    setValue(idx){
        let val = (idx + 1) / this.count;
        this.value = (!idx && this.value === val)?0:val
    }
});