import  './numjs.js'
import randn from './randn.js'

const dataMCRNN = ODA.regTool('dataMCRNN');
dataMCRNN._setData = function(d) {
    dataMCRNN.data = d
    dataMCRNN.dataArr = Array.from( d )
    dataMCRNN.chars = Array.from( new Set(d))
    dataMCRNN.data_size = d.length
    dataMCRNN.vocab_size = dataMCRNN.chars.length
    dataMCRNN.char_to_ix = dataMCRNN.chars.reduce((a, v, i) => ({ ...a, [v]: i}), {}) 
    dataMCRNN.ix_to_char = dataMCRNN.chars.reduce((a, v, i) => ({ ...a, [i]: v}), {}) 
}
fetch('tst/input.txt').then( rsp => rsp.text().then( text => dataMCRNN._setData(text) ));

ODA({    
    is: 'oda-min-char-rnn', imports: '@oda/button',
    template: /*html*/ `
        <style>
            #all {width:900px; margin:30px auto; display: grid; grid-template-columns: 1fr 1fr; grid-gap: 3em;}
            #top {grid-column: 1 / 3; display:flex; align-items: center; justify-content: space-between;}
            .spice {width: 100%;}
            #right { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 3px;}
            #right label {text-align:right}
            #left textarea {width:100%; height: 100%;}
            oda-button {border:1px solid #4682B4; background:#B0C4DE; border-radius:90px; margin-left:1em;}
            b {padding:4px;}
            #output { grid-column: 1 / 3;}
            #output textarea {width:100%; min-height:100px ;}
        </style>
        <div id='all'>
            <div id='top'>
                <!-- <label >Инициализация:</label><b >{{init}}</b> -->
                <div class='spice'></div>
                <oda-button @tap='_start()' icon='av:repeat' title="сброс"></oda-button>
                <oda-button :allow-toggle='1' ::toggled='play' :icon='play?"av:pause":"av:play-arrow"' :title='play?"пауза":"плей"' 
                            @tap='play?{}:_go(this.t)'  ></oda-button>
            </div>
            <div id='left'>
                <textarea type="text" cols="40"  placeholder="текст" ::value></textarea>
                <div>Текст имеет<b>{{dataMCRNN.data_size}}</b>символов, из них<b>{{dataMCRNN.vocab_size}}</b>уникальных.</div>
            </div>
            <div id='right'>                
                <label for="hidden_size">hidden_size:</label><input ::value='hidden_size'>
                <label for="seq_length">seq_length:</label><input ::value='seq_length'>
                <label for="learning_rate">learning_rate:</label><input ::value='learning_rate'>
                <label for="show_one_to">show_one_to:</label><input ::value='show_one_to'>
                <label for="n_sample">n_sample:</label><input ::value='n_sample'>
                <!-- -->
                <!-- <oda-button @tap='_go()'>go</oda-button> -->
            </div>
            <div id='output'>
                <textarea type="text" readonly cols="40"  placeholder="придумка" ::value="outtext"></textarea>
                <div>Поколений:<b>{{n}}</b>, Коэффициент потерь: <b>{{smooth_loss}}</b></div>
            </div>
        </div>        
    `,
    $public: {
        value: {get () { return  dataMCRNN.data },
                set (d) {dataMCRNN._setData(d); this._start();} },        
        dataMCRNN : {get () { return  dataMCRNN} },
        hidden_size: 100,
        seq_length: 25,
        learning_rate: 0.1,
        show_one_to: 50,
        n_sample:200,

        // Wxh: {type:Object}, Whh: {type:Object}, Why: {type:Object}, bh: {type:Object}, by: {type:Object},
        n:0 , p:0, smooth_loss: {type:Number}, t:{},
        // mWxh: {type:Object}, mWhh: {type:Object}, mWhy: {type:Object}, mbh: {type:Object}, mby: {type:Object},
        // hprev: {type:Object},
        outtext:'', //commentN:'0', commentL:'NaN',
        play: false,
    },
    attached() { this._start();    },
    detached() {console.log('detached')},
    _start() {
        console.log('start')

        this.t.Wxh = this._nj_random_randn_k(this.hidden_size, dataMCRNN.vocab_size, 0.01)
        this.t.Whh = this._nj_random_randn_k(this.hidden_size, this.hidden_size, 0.01)
        this.t.Why = this._nj_random_randn_k(dataMCRNN.vocab_size, this.hidden_size, 0.01)
        this.t.bh = nj.zeros([this.hidden_size,1])
        this.t.by = nj.zeros([dataMCRNN.vocab_size,1])

        this.t.mWxh = nj.zeros(this.t.Wxh.shape)
        this.t.mWhh = nj.zeros(this.t.Whh.shape)
        this.t.mWhy = nj.zeros(this.t.Why.shape)
        this.t.mbh = nj.zeros(this.t.bh.shape)
        this.t.mby = nj.zeros(this.t.by.shape)
        this.t.hprev = nj.zeros([this.hidden_size,1])

        this.n=0
        this.p=0

        this.smooth_loss = -Math.log(1.0/dataMCRNN.vocab_size)*this.seq_length

        this.outtext = ''

        return true
    },
    _nj_random_randn_k (a, b, k) { let arr = []
        for (let i=0;i<a*b;i++) arr.push(randn())
            return nj.array(arr.map(e => e*k) ).reshape(a,b)
    },
    _nj_random_chois_p (arr) { let rez = 0
        let r = Math.random()*arr.reduce((a,b)=>a+b)
        arr.forEach((e,i,as)=> (as.slice(0,i+1).reduce((a,b)=>a+b) < r)? rez++ : {}   )
        return rez
    },
    _lossFun (inputs, targets, hprev, tt) {
        let xs={}, hs={}, ys={}, ps={}, loss = 0
        hs[-1] = hprev.clone()        
        // # прямое распространение
        for (let t=0; t< inputs.length; t++ ) {
            xs[t] = nj.zeros([dataMCRNN.vocab_size, 1]) // nj.array([inputs.map((a,i) => i==t? 1:0), 1 ])
            xs[t].set(t,0,1) 
            // nj.clip(nJJ, -5, 5)
            hs[t] = nj.tanh( nj.clip((nj.dot(tt.Wxh, xs[t]).add(nj.dot(tt.Whh, hs[t-1])).add(tt.bh)),-20,20) )
            ys[t] = nj.dot(tt.Why, hs[t]).add(tt.by)
            ps[t] = nj.exp(ys[t]).divide( nj.sum(nj.exp(ys[t]))+ 1e-8)
            if (!ps[t].get(targets[t],0)) { console.log(  nj.sum(nj.exp(ys[t])) )}
            
            loss += -Math.log(ps[t].get(targets[t],0))
            
        }
        console.log(loss)
        let dWxh = nj.zeros(tt.Wxh.shape), dWhh = nj.zeros(tt.Whh.shape), dWhy =  nj.zeros(tt.Why.shape),
            dbh = nj.zeros(tt.bh.shape), dby = nj.zeros(tt.by.shape), dhnext = nj.zeros(hs[0].shape)
        
        for (let t=inputs.length-1; t>-1; t-- ) {
            let dy = ps[t].clone()
            dWhy = dWhy.add( nj.dot(dy, hs[t].T) )
            dby = dby.add(dy)
            let dh = nj.dot(tt.Why.T, dy).add(dhnext)
            let dhraw =  nj.ones(dh.shape).subtract( hs[t].multiply(hs[t]) ).multiply(dh)
            dbh = dbh.add(dhraw)
            dWxh = dWxh.add( nj.dot(dhraw, xs[t].T) )
            dWhh = dWhh.add(  nj.dot(dhraw, hs[t-1].T) )
            dhnext = nj.dot(tt.Whh.T, dhraw)
        }
        [dWxh, dWhh, dWhy, dbh, dby].forEach( nJJ => nJJ = nj.clip(nJJ, -5, 5) )
        return {loss:loss, dWxh:dWxh, dWhh:dWhh, dWhy:dWhy, dbh:dbh, dby:dby, hprev:hs[inputs.length -1]}
    },
    _sample (h, seed_ix, n, tt) {
        let x = nj.zeros([dataMCRNN.vocab_size, 1])
        x.set(seed_ix,0,1)
        let ixes = []
        for (let t=0; t<n; t++) {
            h = nj.tanh(  nj.dot(tt.Wxh, x).add(nj.dot(tt.Whh, h)).add(tt.bh)  )
            // console.log(tt.Why)
            let y = nj.dot(tt.Why, h).add(tt.by)
            let p = nj.exp(y).divide( nj.sum(nj.exp(y)))
            let ix = this._nj_random_chois_p (p.selection.data) 
            x = nj.zeros([dataMCRNN.vocab_size, 1])
            x.set(ix,0,1)
            ixes.push(ix)
        }
        return ixes
    },
    _go(t) {  
        // let hprev = {}
        if ((this.p+this.seq_length+1 >= dataMCRNN.data_size) || ( this.n == 0)) {
            t.hprev = nj.zeros([this.hidden_size,1])
            this.p = 0
        }
        let inputs = dataMCRNN.dataArr.slice(this.p,this.p+this.seq_length).map(ch => dataMCRNN.char_to_ix[ch])
        let targets = dataMCRNN.dataArr.slice(this.p+1,this.p+this.seq_length+1).map(ch => dataMCRNN.char_to_ix[ch])

        if (this.n % this.show_one_to == 0) {
            let sample_ix = this._sample(t.hprev, inputs[0], this.n_sample, t)   // ! почему 200
            let txt = sample_ix.map(i => dataMCRNN.ix_to_char[i]).join('')
            // console.log(txt)
            this.outtext = sample_ix.map(i => dataMCRNN.ix_to_char[i]).join('')
        }

        let lF = this._lossFun(inputs, targets, t.hprev, t) // {loss, dWxh, dWhh, dWhy, dbh, dby, hprev}
        // console.log(lF.loss)

        this.smooth_loss = this.smooth_loss * 0.999 + lF.loss * 0.001 // ! почему спуск 1 к 999

        // if (this.n % this.show_one_to == 0) {
        //     console.log('n=',this.n, '   loss=', this.smooth_loss)
        //     this.commentN = this.n; this.commentL = this.smooth_loss
        // }

        let tNew = {} 

        tNew.mWxh = t.mWxh.add(lF.dWxh.multiply(lF.dWxh))
        tNew.Wxh  = t.Wxh.add( lF.dWxh.multiply(-this.learning_rate).divide(  nj.sqrt(t.mWxh.add(1e-8) )  ) )

        tNew.mWhh = t.mWhh.add(lF.dWhh.multiply(lF.dWhh))
        tNew.Whh  = t.Whh.add( lF.dWhh.multiply(-this.learning_rate).divide(  nj.sqrt(t.mWhh.add(1e-8) )  ) )

        tNew.mWhy = t.mWhy.add(lF.dWhy.multiply(lF.dWhy))
        tNew.Why  = t.Why.add( lF.dWhy.multiply(-this.learning_rate).divide(  nj.sqrt(t.mWhy.add(1e-8) )  ) )

        tNew.mbh = t.mbh.add(lF.dbh.multiply(lF.dbh))
        tNew.bh  = t.bh.add( lF.dbh.multiply(-this.learning_rate).divide(  nj.sqrt(t.mbh.add(1e-8) )  ) )

        tNew.mby = t.mby.add(lF.dby.multiply(lF.dby))
        tNew.by  = t.by.add( lF.dby.multiply(-this.learning_rate).divide(  nj.sqrt(t.mby.add(1e-8) )  ) )

        tNew.hprev = t.hprev

        this.p += this.seq_length 
        this.n += 1

        this.t = tNew



        // this.async(() => { if (this.play) this._go(tNew) }, 0 )
        this.async(() => { if (this.n<5) this._go(tNew) }, 0 )

    }

})
