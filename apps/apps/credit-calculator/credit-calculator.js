import '../../../components/buttons/button/button.js';
import '../../../components/viewers/chart/chart.js';

let _inf = (n) => {
    return new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 2 }).format((Number(n)).toFixed(2));
}
let _lds = (d) => {
    return d.toLocaleDateString("ru-RU", { year: 'numeric', month: 'long' });
}

ODA({ is: 'oda-credit-calulator',
    template: `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
            .container {
                display: flex;
                flex-direction: column;
                /* flex: 1; */
                margin: 2px;
                border: 1px solid transparent;
                overflow: hidden;
            }
            .input {
                display: flex;
                justify-content: space-between;
                margin: 1px;
            }
            input {
                text-align: right;
                margin-left: 4px;
                color: gray;
                font-family: Arial;
                width: 140px;
            }
            .res {
                padding: 2px;
            }
            .cell {
                padding: 8px;
                border: 1px solid lightgray;
                min-width: 90px;
                max-width: 90px;
                overflow: hidden;
            }
            .cell2 {
                flex: 1;
                padding: 8px;
                border: 1px solid lightgray;
                min-width: 80px;
            }
            .even {
                background: #f0f0f0;
            }
        </style>
        <div class="horizontal" style="height: 50%">
            <div class="container" style="min-width:340px;max-width:340px;margin:8px;font-size:large; overflow: auto">
                <div style="font-weight: 700;text-decoration:underline;margin-bottom:16px;text-align: center">Кредитный калькулятор</div>
                <div class="input"><span>Сумма кредита</span><input id="creditAmount" ::value="creditAmount" /></div>
                <div class="input"><span>Проценты (% за год)</span><input id="loanInterest" type="number" ::value="loanInterest" /></div>
                <div class="input"><span>Срок кредита (месяц)</span><input id="timeCredit" type="number" ::value="timeCredit" /></div>
                <div class="input"><span>Дата выдачи кредита</span><input id="date" type="date" ::value="date" /></div>
                <div class="input"><div class="flex"></div><oda-button icon="icons:refresh" @tap="_calc"></oda-button></div>
                <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;border:1px solid gray;margin:16px;padding:2px;background:#f0f0f0">
                    <div class="res">Ежемесячный платеж</div>
                    <div class="res" style="font-weight: 700">{{monthlyPayment}}</div>
                    <div class="res">Сумма кредита + Проценты</div>
                    <div class="res" style="font-weight: 700">{{result}}</div>
                    <div class="res">Итого общая сумма выплат</div>
                    <div class="res" style="font-weight: 700">{{resultCreditAmount}}</div>
                    <div class="res">Переплата</div>
                    <div class="res" style="font-weight: 700">{{resultPercent}} %</div>
                </div>
            </div>
            <oda-chart type="bar" :data="data" :options="options"></oda-chart>
        </div>
        <div class="container" style="overflow:auto;flex:1;font-size:small;">
            <div style="position:sticky;top:0;display:flex; justify-content: space-between;text-align:center;background:white;font-weight:600;z-index:1">
                <div class="cell" style="min-width:20px;max-width:20px">№</div>
                <div class="cell" style="min-width:100px;max-width:100px">Дата платежа</div>
                <div class="cell">Сумма платежа</div>
                <div class="cell">Основной долг</div>
                <div class="cell2">Основной долг / проценты</div>
                <div class="cell">Проценты</div>
                <div class="cell">Выплачено</div>
                <div class="cell">Остаток</div>
            </div>
            <div ~for="_dataMonth || []" ~class="$for.item.id % 2 ? 'odd' : 'even'" style="display:flex; justify-content: space-between;text-align:right">
                <div class="cell" style="min-width:20px;max-width:20px">{{$for.item.id}}</div>
                <div class="cell" style="min-width:100px;max-width:100px">{{$for.item.date}}</div>
                <div class="cell">{{$for.item.mp}}</div>
                <div class="cell">{{$for.item.mdb}}</div>
                <div class="cell2">
                    <div ~style="{background:'linear-gradient(to right, lightgreen ' + $for.item.mainDebt * 100 / ($for.item.mainDebt + $for.item.loanInterest) + '%, tomato ' + $for.item.mainDebt * 100 / ($for.item.mainDebt + $for.item.loanInterest) + '%)'}" style="border:1px solid gray;height: 13px;opacity:.5"></div>
                </div>
                <div class="cell">{{$for.item.int}}</div>
                <div class="cell">{{$for.item.sum}}</div>
                <div class="cell">{{$for.item.res}}</div>
            </div>
    </div>
    `,
    $public: {
        creditAmount: 1000000,
        loanInterest: 10,
        timeCredit: 60,
        date: Object,
        monthlyPayment: '',
        result: '',
        resultCreditAmount: '',
        resultPercent: '',
        data: Object,
        options: {
            title: {
                display: true,
                text: 'Платежи по годам'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            maintainAspectRatio: false,
            // scales: {
            //     xAxes: [{
            //         stacked: true,
            //     }],
            //     yAxes: [{
            //         stacked: true
            //     }]
            // }
        },
        _dataMonth: []
    },
    attached() {
        let d = new Date();
        this.date = new Date(d.getTime() - (d.getTimezoneOffset()) * 60 * 1000).toISOString().slice(0, -5).replace('T', ' ').split(' ')[0];
        this.async(() => this._calc(), 300);
    },
    _calc() {
        let S = this.creditAmount;
        let p = this.loanInterest / 12 / 100;
        let n = this.timeCredit = Number(this.$('#timeCredit').value);

        let mp = S * p / (1 - Math.pow(1 + p, -n));
        this.monthlyPayment = _inf(mp);
        this.result = _inf(S) + ' + ' + _inf(n * mp - S);
        this.resultCreditAmount = _inf(n * mp);
        this.resultPercent = _inf(n * mp * 100 / S - 100);

        this._dataYears = {};
        this._dataMonth = [];
        let prev = 0;
        let d = new Date(this.date) || new Date();
        this.date = d.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        for (let i = 0; i < n; i++) {
            let data = {};
            d.setDate(1);
            d.setMonth(d.getMonth() + 1);
            let year = d.getYear() + 1900;
            this._dataYears[year] = this._dataYears[year] || {};
            data.id = i + 1;
            data.date = _lds(d);
            if (this._dataMonth[i - 1] && this._dataMonth[i - 1].mainDebt)
                prev += Number(this._dataMonth[i - 1].mainDebt);
            let loanInterestSumMonth = (S - prev) * p;
            data.monthlyPayment = mp;
            data.mp = this.monthlyPayment;
            data.mainDebt = mp - loanInterestSumMonth;
            data.mdb = _inf(data.mainDebt);
            this._dataYears[year].mdb = (this._dataYears[year].mdb || 0) + data.mainDebt;
            this._dataYears[year]._mdb = this._dataYears[year].mdb.toFixed(2);
            data.loanInterest = loanInterestSumMonth;
            data.int = _inf(data.loanInterest);
            this._dataYears[year].int = (this._dataYears[year].int || 0) + data.loanInterest;
            this._dataYears[year]._int = this._dataYears[year].int.toFixed(2);
            data.residual = mp * n - mp * (i + 1);
            data.res = _inf(data.residual);
            data.sum = _inf(mp * n - data.residual);
            this._dataMonth.push(data);
        }
        this.data = {
            labels: [...Object.keys(this._dataYears)],
            datasets: [{
                label: 'Проценты',
                backgroundColor: 'tomato',
                data: Object.keys(this._dataYears).map(k => this._dataYears[k]._int)
            }, {
                label: 'Основной долг',
                backgroundColor: 'lightgreen',
                data: Object.keys(this._dataYears).map(k => this._dataYears[k]._mdb)
            }]
        }
        this.$render();
    }
})
