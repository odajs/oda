ODA({is: 'oda-stable-diffusion', imports: '@oda/app-layout, @tools/property-grid, @tools/router', extends: 'oda-app-layout',
    template:/*html*/`
        <!-- <oda-stable-diffusion-settings bar-opened slot="left-panel" class='vertical'></oda-stable-diffusion-settings>
        <oda-stable-diffusion-history slot="right-panel" ></oda-stable-diffusion-history >
        <oda-property-grid :inspected-object="ppp" slot="right-panel"></oda-property-grid>  
        <oda-stable-diffusion-preview  slot="main"></oda-stable-diffusion-preview>
        <oda-stable-diffusion-log :last  slot="footer"></oda-stable-diffusion-log> -->
        <oda-button label='test' slot="header" @tap='_test()'></da-button>
    `,
    attached() {

    },
    urlSDapi:'http://45.136.145.37:7860/sdapi/v1/txt2img',
    _test(){
        console.log('test start')
        let payload = {
            "prompt": "maltese puppy",
            "steps": 5
        }
        
        // let response = requests.post(url=f`{url}/sdapi/v1/txt2img`, json=payload)
        // console.log(response)

        fetch( this.urlSDapi, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(response => console.log(response))
    },
    // get ppp(){
    //     return new odaStableDiffusion();
    // },
    // $public:{      
    //     hash:{},
    //     $pdp: true,
    //     wss:{},        
    //     id:'',
    //     param:{},
    //     isGenerate:true,
    //     logSD: [],
    //     _newID(n=19, pref='t2i') { // 19
    //         let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', rez = '';
    //         for (let i = 4; i < n; i++) { rez += alphabet[Math.floor(Math.random() * alphabet.length)] }
    //         return pref + '-' + rez 
    //     },
    //     history:[],
    //     last:{},
    //     wait: false,
    // },


})