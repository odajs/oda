import '../../oda.js';
    ODA({
        is: 'oda-price-calc',
        template: /*html*/ `
        <style>
            :host {max-width:900px; margin:0 auto; padding:20px;}
            
            #calc { display: grid; grid-template-columns: 1fr 1fr; grid-gap: 5px 15px; height:180px;}
            #calc .u {grid-column-start: 1;}
            #calc .s {grid-column-start: 2;}
            #calc input {}
            #calc .lab {background:#25a0db; color:#fff; font-size:24px; border-radius: 3px; text-align:center; padding:5px;}
            #calc .cost {color:#25a0db; font-size:20px; text-align:right;}
            #calc label b {margin-left:.5em;}

            #tab {margin-top:30px; padding:2px; display: grid; grid-template-columns: 1fr 2fr 1fr 1fr;  height:350px;
                    background:#25a0db; grid-gap: 1px; grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr; }
            #tab > b {background: #d3ecf8; display: flex; align-items: center; justify-content: center; padding: 2px 3px;}
            #tab > div {background:#e2f2fa; display: flex; align-items: center; padding: 2px 3px;}
            #tab .c3, #tab .c4 {color:green; text-align:center; font-weight:bold; justify-content: center;}
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
        <b>Название</b><b>Участник рынка</b><b>Пользователь</b><b>Сервер</b>
        <div class='c1'>Коммерческая Commercial</div>   <div class='c2'>Коммерческие организации</div>
            <div class='c3'>{{uCost(1)}}</div>   <div class='c4'> {{sCost(1)}} </div>
        <div class='c1'>Государственная Goverment</div> <div class='c2'>Компании с государственным участием</div> 
            <div class='c3'>{{uCost(.8)}}</div>  <div class='c4'> {{sCost(.8)}} </div> 
        <div class='c1'> Форвард Forward</div>          <div class='c2'> Любой участник </div>
            <div class='c3'>{{uCost(.7)}}</div>  <div class='c4'> {{sCost(.7)}} </div> 
        <div class='c1'>OEM</div>                            <div class='c2'>Партнеры </div> 
            <div class='c3'>{{uCost(.6)}}</div> <div class='c4'> {{sCost(.6)}} </div>   
        <div class='c1'> Академическая Academic </div class='c4'>  <div class='c2'>  Учебные заведений   </div>  
            <div class='c3'>{{uCost(.2)}}</div> <div class='c4'>  {{sCost(.2)}}  </div> 
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