import '../../oda.js';

ODA({
    is: 'oda-register_licenses', imports: ['@oda/icon'], template: /*html*/ `
    <style>
        table {max-width:900px; width:100%; margin:auto;border-collapse: collapse;border: 2px solid #25a0db;}
        th,td {border: 1px solid #25a0db; padding:2px 3px;}
        th {cursor: pointer;}
        th.act{background: #25a0db33}
        tr:nth-child(even) {background: #25a0db22}
        tr:nth-child(odd) {background: #25a0db33}
        th:nth-child(n+4),th:nth-child(n+5) {min-width:85px}
        #search {max-width:900px; width:100%; margin:0.5em auto; position: relative;}
        #search input {border: 2px solid #25a0db; padding:4px 5px 4px 30px; width:100%; border-radius:5px;}
        #search oda-icon {position: absolute; top:4px; left:5px}
    </style>
    <div id='search'> 
        <oda-icon icon="icons:search" icon-size="20"  ></oda-icon>
        <input placeholder="быстрый поиск..." type="search" ::value='search'>
        
    </div>
    <table>
        <tr><th ~class="(index==sortI)?'act':''" @tap="_chSort(index)" ~for="names">{{item}}</th></tr>
        <tr ~for="row in area"> <td ~for="row">{{item}}</td> </tr>
    </table>
    `,
    async attached() {
        this.names = this.tTab  ? ['№ сертификата', 'ФИО Слушателя', 'Компания Партнер',
                                    'Дата начала сертификата', 'Дата окончания сертификата']
                                : ['№ лицензии', 'Владелец Лицензии', 'Модель расчетаип', 'Тип лицензии',
                                    'Дата выдачи лицензии', 'Дата окончания лицензии']
        let row = await this._dlRaw()
        let rows = row.$rows.map(o => this.tTab
            ? [o.ID, o.OwnerLicense, o.Partner, o.DateOn ? this._hData(o.DateOn) : '', o.DateOf ? this._hData(o.DateOf) : '']
            : [o.ID, o.OwnerLicense, o.Calc, o.Type, o.DateOn ? this._hData(o.DateOn) : '', o.DateOf ? this._hData(o.DateOf) : '']
        )
        this.raws = rows
        this.search = ''
        this.sortI = this.names.length - 1
    },
    observers: ['_screenSet(sortI,search)'],
    props: {
        sortI:1,
        raws: [],
        tTab: 0, // 0 -- организации, 1 -- люди
        finrows: {},
        names: [],
        area:[],
        search: '0'
    },
    async _dlRaw() { // 1D839FFCCA3D6FF -- организации, 1D839FFD97FF621 -- люди
        const url = 'https://business.odant.org/api/H:1CC832F557A4600/P:WORK/B:1D7472723D6F2CD/C:' +
            (this.tTab ? '1D839FFD97FF621' : '1D839FFCCA3D6FF') + '/I:table?dataset'
        const raw = await (await fetch(url)).json();
        return raw
    },
    _hData(s) { return ('' + s).slice(0, 10) },
    _chSort(index) { this.sortI = index },
    _screenSet(sortI,search) {
        let area = this.raws.filter(r => r.join(' ').toLowerCase().includes(search.toLowerCase()))
        this.area = area.sort( (x,y) => x[sortI].localeCompare(y[sortI]) )
    }
});