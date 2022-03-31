import '../../oda.js';

ODA({
    is: 'oda-register_licenses', imports: ['@oda/button'], template: /*html*/ `
    <style>
        table {max-width:900px; width:100%; margin:auto;border-collapse: collapse;border: 2px solid #25a0db;}
        th,td {border: 1px solid #25a0db; padding:2px 3px;}
        tr:nth-child(even) {background: #25a0db22}
        tr:nth-child(odd) {background: #25a0db33}
        .dat {min-width:85px}
    </style>
    <oda-button :label='tTab' @tap='tTab=(tTab+1)%3' ~show="0"></oda-button>
    <table>
        <tr><th>ID</th><th>{{_ownerName()}}</th><th ~show="!(tTab==2)" >Тип</th>
            <th class='dat'>Дата начала</th><th class='dat'>Дата конца</th></tr>
        <tr ~for="finrows">
            <td>{{item.id}}</td><td>{{item.name}}</td><td ~show="!(tTab==2)">{{item.type}}</td>
            <td>{{_hData(item.dateon)}}</td><td>{{_hData(item.dateof)}}</td> 
        </tr>
    </table>
    `,
    async attached() {
        let row = await this._dlRaw()
        let rows = row.$rows.map(o => {
            return { id: o.ID, name: o.OwnerLicense, type: o.Type, dateon: o.DateOn, dateof: o.DateOf }
        })
        this.raws = rows
        if (window.location.hash=='#1') this.tTab = 1
        if (window.location.hash=='#2') this.tTab = 2
    },
    observers: ['_obrRows(raws,tTab)'],

    props: {
        raws: {},
        tTab: 0, // 0 -- все, 1 -- организации, 2 -- люди
        finrows: {},

    },
    async _dlRaw() {
        const url = 'https://business.odant.org/api/' +
            'H:1CC832F557A4600/P:WORK/B:1D7472723D6F2CD/C:1D839FD8765DEDB/' +
            'I:table?dataset&loadmask=*&mask=*&from=0&length=500'
        const response = await fetch(url);
        const raw = await response.json();
        return raw
    },
    _hData(s) { return ('' + s).slice(0, 10) },
    _obrRows(raws, t) {
        let isP = (o) => o.type == 'FREE' || o.type == undefined
        if (t == 1) { raws = raws.filter(o => !isP(o)) }
        if (t == 2) { raws = raws.filter(isP) }
        this.finrows = raws
    },
    _ownerName() {
        let names = ['Владелец', 'Партнер', 'ФИО']
        return names[this.tTab]
    }



});