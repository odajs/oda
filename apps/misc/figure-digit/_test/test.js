ODA({is:'oda-test', imports: ['@oda/button'], template: /*html*/`
    <style>
        :host {display: flex;align-items: center; }

    </style>
    <input ::value='a' type='number'>
    <input ::value='b' type='number'>
    <oda-button  :label style='flex' @tap='_tap'></oda-button>
    <div id='result'><b>{{result}}</b></div>
`,
    attached () {
        this.myWorker = new Worker('w.js');
        this.myWorker.onmessage = (e) => {
            this.result = e.data;
            console.log('Message received from worker',e);
          }
    },
    props: {
        label: 'sum',
        a: 5,
        b: 6,
        result:'Result: ???',
    },
    _tap () {
        console.log ('sum')
        // this.label = this.a + this.b
        this.myWorker.postMessage([this.a, this.b]);
    },
})