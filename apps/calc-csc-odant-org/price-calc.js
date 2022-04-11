import '../../oda.js';
    ODA({
        is: 'oda-price-calc',
        template: /*html*/ `
        <style>
            #calc {max-width:900px; margin:auto; display: grid;  grid-template-columns: 1fr 20px 1fr; grid-gap: 10px;}
            #calc .u {grid-column-start: 1;}
            #calc .s {grid-column-start: 3;}
            #calc input {display: block; width:100%;}
            #calc .lab {background:#25a0db; color:#fff; font-size:24px; border-radius: 3px; text-align:center; padding:5px;}
            #calc .cost {color:#25a0db; font-size:20px; text-align:right;}
            #calc label b {margin-left:.5em;}

            #cost-tab {max-width:900px; width:100%; margin:30px auto;border-collapse: collapse;border: 2px solid #25a0db;}
            th,td {border: 1px solid #25a0db; padding:2px 3px; height:40px;}
            tr:nth-child(even) {background: #25a0db22}
            tr:nth-child(odd) {background: #25a0db33}
            td:nth-child(n+3) {color:green; text-align:center; font-weight:bold;width:170px;  transition: .1s font-size;}
            tr:hover td:nth-child(n+3) {font-size:120%; }
        </style>
        <div id='calc'>
            <div class="u lab">модель "Пользователь"</div>
            <div class="s lab">модель "Сервер"</div>           
            <label for="u-ueser" class="u ueser"> Пользователей:
                <input type="number" id="u-ueser" name="u-ueser" min="1" ::value="uUser"></label>
            <label for="s-core" class="s core"> Ядер:
                <input type="number" id="s-core" name="s-core" min="1" ::value="sCore"></label>
            <label for="u-base" class="u base"> Баз:
                <input type="number" id="u-base" name="u-base" min="1" ::value="uBase"></label>

        </div>
        <table id='cost-tab'><tbody>
            <tr><th>Название</th><th>Участник рынка</th><th>Пользователь</th><th>Сервер</th></th>
            <tr><td>Коммерческая<br />Commercial</td>   <td>Коммерческие организации</td>
                <td>{{uCost(1)}}</td>   <td> {{sCost(1)}} </td> </tr>
            <tr><td>Государственная<br />Goverment</td> <td>Компании с государственным участием</td> 
                <td>{{uCost(.8)}}</td>  <td> {{sCost(.8)}} </td> </tr>
            <tr><td> Форвард<br />Forward</td>          <td> Любой участник </td>
                <td>{{uCost(.7)}}</td>  <td> {{sCost(.7)}} </td> </tr>
            <tr><td>OEM</td>                            <td>Партнеры </td> 
                <td>{{uCost(.6)}}</td> <td> {{sCost(.6)}} </td> </tr>  
            <tr><td> Академическая <br /> Academic </td>  <td>  Учебные заведений   </td>  
                <td>{{uCost(.2)}}<td> {{sCost(.2)}}  </td>    </tr>
        </tbody></table>
        `,
        props: {
            uUser: 10,
            uBase: 2,
            sCore: 8,
            baseCost: 10000,
        },
        uCost(k) { let cost = (this.uUser + this.uBase) * this.baseCost
            return (cost * k).toLocaleString() + ' ₽'  },
        sCost(k) { let cost =  0.5 * this.sCore * (this.sCore + 1) * this.baseCost
            return (cost * k).toLocaleString() + ' ₽'  }
    });