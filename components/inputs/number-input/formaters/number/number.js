var odaNumber = odaNumber || class odaNumber extends Number {
    static get FORMATS_NUMBER() {
        return {
            'integer': ['integer', 'целое', 'целый', 'int'],
            'decimal': ['decimal', 'десятичное', 'дробное', 'с плавающей запятой', 'float'],
            'percent': ['percent', 'percentage', 'процентное', 'процентный', 'процент', 'percent', '%'],
            'currency': ['currency', 'currency-rub', 'currencyrub','валютный', 'денежный', 'денежное', 'деньги', 'финансовое', 'fiscal', 'financial', 'rub'],
            'currency-eur': ['currency-eur', 'currencyeur', 'eur'],
            'currency-usd': ['currency-usd', 'currencyusd', 'usd'],
            'bank': ['bank', 'банковское', 'банковский', 'банк'],
            'exponential': ['exponential', 'scientific', 'научный', 'научное', 'инженерное', 'engineering', 'exp'],
            'text': ['text', 'текстовый', 'txt'],
        }
    }

    static get FORMATS_NUMBER_INTL() {
        return {
            'integer': { locale: 'ru-RU', style: 'decimal', minimumFractionDigits: '0', maximumFractionDigits: '0' },
            'decimal': { locale: 'ru-RU', style: 'decimal', minimumFractionDigits: '2', maximumFractionDigits: '2' },
            'percent': { locale: 'ru-RU', style: 'percent', minimumFractionDigits: '2', maximumFractionDigits: '2' },
            'currency': { locale: 'ru-RU', style: 'currency', currency: 'RUB', currencyDisplay: 'symbol', minimumFractionDigits: '2', maximumFractionDigits: '2' },
            'currency-eur': { locale: 'de-DE', style: 'currency', currency: 'EUR', currencyDisplay: 'symbol', minimumFractionDigits: '2', maximumFractionDigits: '2' },
            'currency-usd': { locale: 'en-US', style: 'currency', currency: 'USD', currencyDisplay: 'symbol', minimumFractionDigits: '2', maximumFractionDigits: '2' },
            'bank': { locale: 'ru-RU', style: 'decimal', minimumFractionDigits: '2', maximumFractionDigits: '2' },
            'exponential': { locale: 'ru-RU', style: 'decimal', minimumFractionDigits: '2', maximumFractionDigits: '2' },
            'text': { locale: 'ru-RU', style: 'decimal', minimumFractionDigits: '2', maximumFractionDigits: '2' },
        }
    }

    static getFormattedValue(value, args) {
        let val = this.valueChecked(value);
        if (args && !args.showZero && val === 0) return '';
        let opts = this.getOpts(args);
        let numberString = '';
        if (opts.format.includes('exp')) {
            numberString = parseFloat(val).toExponential(opts.minimumFractionDigits);
        } else if (opts.format.includes('text')) {
            let locales = opts.locale.slice(0, 2);
            if (locales === 'en') numberString = new MoneyToStr(Currency.USD, Language.ENG, Pennies.Number);
            else if (locales === 'ua') numberString = new MoneyToStr(Currency.UAH, Language.UKR, Pennies.Number);
            else numberString = new MoneyToStr(Currency.RUR, Language.RUS, Pennies.Number);
            numberString = numberString.convertValue(parseFloat(val));
        } else {
            try {
                numberString = new Intl.NumberFormat(opts.locale, opts).format(val);
            } catch (error) {
                numberString = new Intl.NumberFormat('ru-RU', opts).format(val);
            }
            if (opts.format.includes('bank')) numberString = numberString.replace(numberString.replace(/\d+$/g, '').slice(-1), '-')
        }
        return (args.prefix || '') + numberString + (args.postfix || '');
    };

    static getEditValue(value, args) {
        let val = this.valueChecked(value);
        let opts = this.getOpts(args);
        let numberString = '';
        try {
            numberString = new Intl.NumberFormat(opts.locale, opts).format(val);
        } catch (error) {
            numberString = new Intl.NumberFormat('ru-RU', opts).format(val);
        }
        return this.isNegative(val) + numberString.replace(/(^\D+)|(\D+$)/g, '');
    };

    static getOpts(args) {
        let frmt = this._getValidFormat(args.format);
        let opts = odaNumber.FORMATS_NUMBER_INTL[frmt] ? odaNumber.FORMATS_NUMBER_INTL[frmt] : odaNumber.FORMATS_NUMBER_INTL['decimal'];
        opts.format = frmt;
        opts.locale = args.locale || 'ru-RU';
        let pl = args.places ? parseInt(args.places) : '';
        pl = (pl >= 0 && pl <= 20) ? pl : '';
        if (pl || pl === 0) opts.minimumFractionDigits = opts.maximumFractionDigits = pl;
        opts.isInteger = frmt.includes('integer');
        opts.isPercent = frmt.includes('percent');
        return opts;
    };

    static isNegative(value) {
        return this.valueChecked(value) < 0 ? '-' : '';
    };

    static getSeparator(args) {
        let opts = this.getOpts(args);
        let results = {};
        let regex1 = /(^\D+)|(\D+$)/g;
        let regex2 = /\d/g;
        try {
            results.decimalSeparator = (new Intl.NumberFormat(opts.locale, opts).format(1.11)).replace(regex1, '').replace(regex2, '')[0] || '.';
            results.groupSeparator = (new Intl.NumberFormat(opts.locale, opts).format(1000)).replace(regex1, '').replace(regex2, '')[0] || ' ';
        } catch (error) {
            results.decimalSeparator = (new Intl.NumberFormat('ru-RU', opts).format(1.11)).replace(regex1, '').replace(regex2, '')[0] || '.';
            results.groupSeparator = (new Intl.NumberFormat('ru-RU', opts).format(1000)).replace(regex1, '').replace(regex2, '')[0] || ' ';
        }
        return results;
    };

    static valueChecked(value) {
        return !value || isNaN(value) ? 0 : value;
    };

    static _getValidFormat(format) {
        const frmt = (format && typeof format === 'string') ? format.trim().toLowerCase() : 'decimal'
        const validFormat = Object.keys(odaNumber.FORMATS_NUMBER).find(key => odaNumber.FORMATS_NUMBER[key].includes(frmt));
        return validFormat ? validFormat : 'decimal';
    };
}

if (!Number['formats']) {
    Object.defineProperty(Number, 'formats', {
        get() {
            return Object.keys(odaNumber.FORMATS_NUMBER);
        }
    })
}

if (!Number['getFormattedValue']) {
    Object.defineProperty(Number.prototype, 'getFormattedValue', { enumerable: false, value: function (format, places = '', locale = '', prefix = '', postfix = '') {
        let args = typeof format === 'string' ? { format, places, locale, prefix, postfix } : format || {};
        return odaNumber.getFormattedValue(this.valueOf(), args);
    }});
}