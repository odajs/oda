import '../../components/buttons/button/button.js';
import '../../components/viewers/chart/chart.js';

ODA({
    is: 'oda-valuta',
    template: `
        <style>
            :host {
                display: flex;
                height: 100%;
            }
            .container {
                display: flex;
                flex-direction: column;
                /* flex: 1; */
                margin: 2px;
                border: 1px solid transparent;
                max-width: 380px;
                min-width: 380px;
            }
            .cell {
                padding: 8px;
                border: 1px solid lightgray;
                overflow: hidden;
                font-family: Arial;
                font-size: x-small;
                cursor: pointer;
            }
            .row:hover {
                filter: invert(15%);
            }
            .even {
                background: #f0f0f0;
            }
            .odd {
                background: #fefefe;
            }
            .inf {
                display: flex;
                justify-content: space-between;
                padding-left: 6px;
                font-size: large;
                font-family: monospace;
            }
            .val {
                font-weight: 700;
            }
            .focused {
                box-shadow: inset 0 -2px 0 0  var(--focused-color)!important;
            }
            input {
                text-align: right;
                margin-left: 4px;
                color: gray;
                font-family: Arial;
                width: 140px;
                border: 1px solid lightgray;
            }
        </style>
        <div class="container flex" style="overflow:auto;flex:1;font-size:large;max-width:640px;min-width:640px;overflow:hidden;">
            <div class="vertical">
                <div style="font-weight: 700;text-decoration:underline;margin-bottom:16px;text-align: center;">Курсы валют</div>
                <div class="inf">Дата....... <span class="val">{{focusedDate?.x || ''}}</span><div class="flex"></div>Период с <input type="date" ::value="startDate" /></div>
                <div class="inf">Валюта..... <span class="val">{{focusedValute?.Name || ''}}</span><div class="flex"></div>по <input type="date" ::value="endDate" /></div>
                <div class="inf">Номинал.... <span class="val">{{focusedValute?.Nominal || ''}}</span><div class="flex"></div></div>
                <div class="inf">Курс(руб).. <span class="val">{{focusedDate?.y || focusedValute?.Value || ''}}</span><div class="flex"></div>
                    <span class="val">RUB <input type="number" ::value="valueRub" @change="_changedRub"/></span>
                    <span class="val">{{focusedValute?.CharCode}}  <input type="number" ::value="valueValute" @change="_changedValute"/></span>
                </div>
            </div>
            <div class="horizontal between" style="overflow: auto">
                <div class="vertical">
                    <div class="container" style="overflow:auto;flex:1;font-size:small;">
                        <div style="position:sticky;top:0;display:flex; justify-content: space-between;text-align:center;background:white;font-weight:600;z-index:1">
                            <div class="cell" style="flex:1">Код</div>
                            <div class="cell" style="flex:5">Валюта</div>
                            <div class="cell" style="flex:2">Номинал</div>
                            <div class="cell" style="flex:2">Курс</div>
                            <div class="cell" style="flex:1">+/</div>
                        </div>
                        <div ~for="o,i in arrValute()" ~class="{odd:!(i%2),even:i%2,focused:focusedValute?.CharCode===o.CharCode}" class="row" style="display:flex; justify-content: space-between;text-align:right"
                                @tap="_tapValute(o)">
                            <div class="cell" style="flex:1;text-align:left">{{o.CharCode}}</div>
                            <div class="cell" style="flex:5;text-align:left">{{o.Name}}</div>
                            <div class="cell" style="flex:2">{{o.Nominal}}</div>
                            <div class="cell" style="flex:2">{{o.Value}}</div>
                            <div class="cell" style="flex:1" ~style="{color:o._Def>=0?'blue':'red'}">{{o.Def}}</div>
                        </div>
                    </div>
                </div>
                <div class="container" style="overflow:auto;flex:1;font-size:small;max-width:240px;min-width:240px;">
                    <div style="position:sticky;top:0;display:flex; justify-content: space-between;text-align:center;background:white;font-weight:600;z-index:1">
                        <div class="cell" style="flex:2">Дата</div>
                        <div class="cell" style="flex:1">Номинал</div>
                        <div class="cell" style="flex:1">Курс</div>
                    </div>
                    <div ~for="o,i in arrPeriod() || []" ~class="{odd:!(i%2),even:i%2,focused:focusedDate?.x===o.x}" class="row" style="display:flex; justify-content: space-between;text-align:right"
                            @tap="_tapDate(o)">
                        <div class="cell" style="flex:2;text-align:center">{{o.x}}</div>
                        <div class="cell" style="flex:1">{{o.n}}</div>
                        <div class="cell" style="flex:1">{{o.y}}</div>
                    </div>
                </div>
            </div>
        </div>
        <oda-chart ~if="_isReady" type="line" :data="data" :options="options" style="flex:1;border: 1px solid lightgray;margin:8px;padding: 8px;"></oda-chart>
    `,
    props: {
        startValute: 'USD',
        data: Object,
        options: Object,
        focusedValute: Object,
        focusedDate: Object,
        selectionValute: [],
        startDate: {
            default: '',
            set(n) {
                if (n && this._isReady)
                    this.ready();
            }
        },
        endDate: {
            default: '',
            set(n) {
                if (n && this._isReady)
                    this.ready();
            }
        },
        valueRub: 0,
        valueValute: 0,
        _isReady: false
    },
    arrValute() {
        if (!this._rates) return [];
        const keys = Object.keys(this._rates?.Valute) || [];
        const arr = keys.map(k => {
            this._rates.Valute[k]._Def = this._rates.Valute[k].Value - this._rates.Valute[k].Previous;
            this._rates.Valute[k].Def = (this._rates.Valute[k].Value - this._rates.Valute[k].Previous).toFixed(2);
            return this._rates.Valute[k];
        })
        return arr;
    },
    arrPeriod() {
        const recs = this._period?.ValCurs?.Record || [];
        const arr = recs.map(o => {
            return { x: o['@attributes'].Date, y: o.Value, n: o.Nominal };
        })
        return arr;
    },
    async ready() {
        let date = new Date();
        this.endDate = this.endDate || date.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        date.setDate(1);
        date.setMonth(date.getMonth() - 1);
        this.startDate = this.startDate || date.toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
        let startDate = this.startDate.split('-').reverse().join('/');
        let endDate = this.endDate.split('-').reverse().join('/');

        // let json = await fetch(`https://cors.bridged.cc/https://www.cbr-xml-daily.ru/daily_json.js`);
        let json = await fetch(`https://www.cbr-xml-daily.ru/daily_json.js`);
        this._rates = await json.json();
        this.focusedValute = this.focusedValute || this._rates.Valute[this.startValute];

        // const res = await fetch(`https://cors.bridged.cc/https://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${startDate}&date_req2=${endDate}&VAL_NM_RQ=${this.focusedValute?.ID}`);
        const res = await fetch(`https://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${startDate}&date_req2=${endDate}&VAL_NM_RQ=${this.focusedValute?.ID}`);
        const xml = await res.text();
        const XmlNode = new DOMParser().parseFromString(xml, 'text/xml');
        this._period = xmlToJson(XmlNode);
        this.focusedDate = this.arrPeriod()[this.arrPeriod().length - 1];

        this.options = {
            title: {
                display: true,
                text: `Курсы валют за период с ${startDate.replaceAll('/', '.')} по ${endDate.replaceAll('/', '.')}`,
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'руб'
                    }
                }]
            }
        }
        this.data = {
            labels: (this.arrPeriod() || []).map(o => o.x),
            datasets: [{
                label: this.focusedValute.CharCode,
                fill: false,
                lineTension: 0,
                backgroundColor: 'lightblue',
                borderColor: 'lightblue',
                data: (this.arrPeriod() || []).map(o => o.y.replace(',', '.'))
            }]
        }
        this._isReady = true;
    },
    async _tapValute(e) {
        this.focusedValute = e;
        await this.ready();
        if (this._lastChangedRub)
            this._changedRub();
        else
            this._changedValute();
    },
    _tapDate(e) {
        this.focusedDate = e;
        if (this._lastChangedRub)
            this._changedRub();
        else
            this._changedValute();
    },
    _changedRub() {
        this._lastChangedRub = true;
        const val = this.focusedDate?.y || this.focusedValute?.Value;
        this.valueValute = (this.valueRub / val.replace(',', '.') * this.focusedValute.Nominal).toFixed(4);
    },
    _changedValute() {
        this._lastChangedRub = false;
        const val = this.focusedDate?.y || this.focusedValute?.Value;
        this.valueRub = (this.valueValute * val.replace(',', '.') / this.focusedValute.Nominal).toFixed(4);
    }
})

function xmlToJson(xml) {
    var obj = {};
    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        obj = xml.nodeValue;
    }
    var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
        return node.nodeType === 3;
    });
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
        obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
            return text + node.nodeValue;
        }, "");
    } else if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof obj[nodeName] == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof obj[nodeName].push == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}
