import '../../oda.js';
    ODA({
        is: 'oda-price-calc',
        template: /*html*/ `
        <style>
            :host {max-width:900px; margin:0 auto; padding:20px;}
            
            #calc { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 5px 15px; height:180px;}
            #calc .u {grid-column: 1;}
            #calc .s {grid-column: 2;}
            #calc .lab {background:#25a0db; color:#fff; font-size:24px; border-radius: 3px; padding:5px; 
                        display: flex; align-items: center; justify-content: center; }
            #calc .cost {color:#25a0db; font-size:20px; text-align:right;}
            #calc label { display: flex; align-items: end;  }

            #tab {margin-top:30px; padding:2px; display: grid; grid-template-columns: 1fr 2fr 1fr 1fr;  height:520px;
                    background:#25a0db; grid-gap: 1px; grid-template-rows: repeat(6, 1fr); }
            #tab > b {background: #d3ecf8; display: flex; align-items: center; justify-content: center; padding: 2px 3px;}
            #tab > div {background:#e2f2fa; display: flex; align-items: center; padding: 2px 3px;}
            #tab div.c3, #tab div.c4 {color:green; text-align:center; font-weight:bold; justify-content: center;}
            #tab > div.r2, #tab > div.r4 {background: #d3ecf8 !important;}

            @media (max-width: 600px) { 
                #calc .lab {grid-column: 1 / 3;}
                #calc label {grid-column: 1 !important; justify-content: end;}
                #calc input {grid-column: 2 !important; }
                #calc .lab.s {grid-row:5}
                #calc label.s.core, #calc input.s.core {grid-row:6}

                #tab { grid-template-columns: 2fr 1fr;  grid-template-rows: repeat(12, 1fr); }
                #tab .c1, #tab .c2 {grid-column: 1 !important;}
                #tab .c3, #tab .c4 {grid-column: 2 !important;}
                #tab b.c3 {grid-row:1}
                #tab .c3.r1 {grid-row:3}
                #tab .c3.r2 {grid-row:5}
                #tab .c3.r3 {grid-row:7}
                #tab .c3.r4 {grid-row:9}
                #tab .c3.r5 {grid-row:11}
             }

             @media (max-width: 380px) {
                :host {padding:2px;}
             } 


        </style>
        <div id='calc'>
            <div class="u lab">модель "Пользователь"</div>
            <div class="s lab">модель "Сервер"</div>           
            <label for="u-ueser" class="u ueser"> Пользователей:</label>
            <label for="s-core" class="s core"> Ядер:</label>
            <input class="u ueser" type="number" id="u-ueser" name="u-ueser" min="1" ::value="uUser">
            <input class="s core" type="number" id="s-core" name="s-core" min="1" ::value="sCore">
            <label for="u-base" class="u base"> Баз:</label>
            <input class="u base" type="number" id="u-base" name="u-base" min="1" ::value="uBase">

        </div>

        <div id='tab'>
        <b class='c1'>Название</b><b class='c2'>Участник рынка</b><b class='c3'>Пользователь</b><b class='c4'>Сервер</b>
        <div class='c1 r1'>Коммерческая Commercial</div>   <div class='c2 r1'>Коммерческие организации</div>
            <div class='c3 r1'>{{uCost(1)}}</div>   <div class='c4 r1'> {{sCost(1)}} </div>
        <div class='c1 r2'>Государственная Goverment</div> <div class='c2 r2'>Компании с государственным участием</div> 
            <div class='c3 r2'>{{uCost(.8)}}</div>  <div class='c4 r2'> {{sCost(.8)}} </div> 
        <div class='c1 r3'> Форвард Forward</div>          <div class='c2 r3'> Любой участник </div>
            <div class='c3 r3'>{{uCost(.7)}}</div>  <div class='c4 r3'> {{sCost(.7)}} </div> 
        <div class='c1 r4'>OEM</div>                            <div class='c2 r4'>Партнеры </div> 
            <div class='c3 r4'>{{uCost(.6)}}</div> <div class='c4 r4'> {{sCost(.6)}} </div>   
        <div class='c1 r5'> Академическая Academic </div>  <div class='c2 r5'>  Учебные заведений   </div>  
            <div class='c3 r5'>{{uCost(.2)}}</div> <div class='c4 r5'>  {{sCost(.2)}}  </div> 
        </div>
        `,

        uUser: 10,
        uBase: 2,
        sCore: 8,
        baseCost: 10000,

        uCost(k) { let cost = (this.uUser + this.uBase) * this.baseCost
            return (cost * k).toLocaleString() + ' ₽'  },
        sCost(k) { let cost =  0.5 * this.sCore * (this.sCore + 1) * this.baseCost
            return (cost * k).toLocaleString() + ' ₽'  }
    });