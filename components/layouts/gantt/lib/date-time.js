class odaDateTime extends Date {
    static get FORMATS_DATE_ALIAS() {
        return {
            'date': ['datetime', 'date', 'дата', 'd'],
            'full': ['full', 'f'],
            'fulltime': ['fulltime', 'ft'],
            'short': ['shortdate', 'short', 'sh'],
            'month': ['month', 'месяц', 'mon'],
            'time': ['time', 'время', 't'],
        }
    }

    static get FORMATS_DATE_INTL() {
        return {
            // Internationalization
            'date': { year: 'numeric', month: '2-digit', day: '2-digit', inputType: 'date' },
            'full': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', inputType: 'date' },
            'fulltime': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', inputType: 'datetime-local' },
            'short': { weekday: 'short', year: '2-digit', month: 'numeric', day: 'numeric', inputType: 'date' },
            'month': { year: 'numeric', month: 'long', inputType: 'month' },
            'time': { hour: '2-digit', minute: '2-digit', second: '2-digit', inputType: 'time' },
        }
    }

    static get FORMATS_DATE_MASKS() {
        return {
            'FD': { mask: 'yyyy-mm-dd HH:MM:ss', inputType: 'datetime-local' },
            'default': { mask: 'ddd mmm dd yyyy HH:MM:ss', inputType: 'datetime-local' },
            'D': { mask: 'dddd, dd mmmm yyyy г.', inputType: 'date' },
            'm': { mask: 'yyyy-mm-dd"T"HH:MM', inputType: 'datetime-local' },
            's': { mask: 'yyyy-mm-dd"T"HH:MM:ss', inputType: 'datetime-local' },
            'S': { mask: 'yyyy-mm-dd"T"HH:MM:ss.l', inputType: 'datetime-local' },
            // ODA (FAT)
            'ShortDate': { mask: 'ddd dd.mm.yy', inputType: 'date' },
            'FullDateTimeMs': { mask: 'dd mmm yyyy HH:MM:ss.l', inputType: 'datetime-local' },
            'GeneralDateTime': { mask: 'dd.mm.yyyy HH:MM:ss', inputType: 'datetime-local' },
            //'FullDateTimeMs': { mask: 'ddd dd.mm.yy HH:MM:ss.l', inputType: 'datetime-local' },
            'LongDate': { mask: 'dd mmmm yyyy г.', inputType: 'date' },
            'ShortTime': { mask: 'H:MM', inputType: 'time' },
            'LongTime': { mask: 'H:MM:ss', inputType: 'time' },
            'FullDateTime': { mask: 'ddd dd.mm.yy H:MM:ss', inputType: 'datetime-local' },
            'MonthDay': { mask: 'mmmm, dd', inputType: 'date' },
            'YearMonth': { mask: 'yyyy mmmm', inputType: 'month' },
            'MonthYear': { mask: 'mmmm yyyy', inputType: 'month' },
            'SortableDateTime': { mask: 'yyyy-mm-dd"T"HH:MM:ss', inputType: 'datetime-local' },
            'UniversalDateTime': { mask: 'ddd dd.mm.yy H:MM:ss', inputType: 'datetime-local' },
            // ISO
            'isoDate': { mask: 'yyyy-mm-dd', inputType: 'date' },
            'isoTime': { mask: 'HH:MM:ss', inputType: 'time' },
            'isoDateTime': { mask: 'yyyy-mm-dd"T"HH:MM:ss', inputType: 'datetime-local' },
            'isoUtcDateTime': { mask: 'UTC:yyyy-mm-dd"T"HH:MM:ss"Z"', inputType: 'datetime-local' },
        }
    }

    static monthNames(locale = 'ru-RU', format = 'long') {
        let arr = [];
        for (let i = 0; i < 12; i++) {
            let w = new Date('2019', i).toLocaleString(locale, { month: format });
            arr.push(w);
        }
        return arr;
    }

    static weekdaysNames(locale = 'ru-RU', format = 'long', firstDaySunday = false) {
        let arr = [];
        let month = firstDaySunday ? '08' : '06';
        for (let i = 1; i <= 7; i++) {
            let w = new Date('2019', month, i).toLocaleString(locale, { weekday: format })
            arr.push(w);
        }
        return arr;
    }

    static getMaskedValue(value, args) {
        args.separator = args.separator || '_';
        let mask = this.getCorrectMask(args.mask);
        this.countSymbol = -1;
        let maskedValue = '';
        let arrChar = mask.split('');
        arrChar.map((symb) => {
            maskedValue += this._getSymbol(value, symb, args.separator);
        });
        return maskedValue;
    }

    static getCorrectMask(mask) {
        if (!mask) return 'dd / mm / yyyy';
        mask = mask.toLowerCase();
        mask = mask.replace(/(h+)(.)m+/g, '$1$2M');
        let arr = ['d', 'm', 'y', 'h', 'M', 's', 'l'];
        for (let i = 0; i < arr.length; i++) {
            let el = arr[i];
            el = (el === 'y' ? 'yyyy' : el === 'l' ? 'lll' : el + el);
            const reg = new RegExp(arr[i] + '+');
            mask = mask.replace(reg, el);
        }
        return mask;
    }

    static _getSymbol(value, symb, separator) {
        if (/[^dmyhMsl]/.test(symb)) return symb;
        this.countSymbol += 1;
        if (value && value[this.countSymbol]) return this.checkSymbol(symb, value[this.countSymbol], separator);
        return separator;
    }

    static checkSymbol(symb, val, separator) {
        if (/[dmyhMsl]/.test(symb)) return (/\d/.test(val)) ? val : separator;
    }

    static getFormattedValue(value, args) {
        if (!value) return undefined;
        if (typeof args === 'string') args = { format: args };
        args.locale = args.locale || 'ru-RU';
        args.format = args.format || 'date';
        if (Object.keys(odaDateTime.FORMATS_DATE_MASKS).find(key => key === args.format))
            return this._getDateFormattedValueMask(value, args.format, args.locale);
        let frmt = Object.keys(odaDateTime.FORMATS_DATE_ALIAS).find(key => odaDateTime.FORMATS_DATE_ALIAS[key].includes(args.format.toLowerCase()));
        if (!frmt)
            return this._getDateFormattedValueMask(value, args.format, args.locale);
        const options = odaDateTime.FORMATS_DATE_INTL[frmt] || {};
        try {
            return new Intl.DateTimeFormat(args.locale, options).format(value);
        } catch (error) {
            return value;
        }
    }

    static _getDateFormattedValueMask(date, mask, locale, utc) {
        let token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

        locale = locale || 'ru-RU';
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }
        date = date || new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");
        mask = String(odaDateTime.FORMATS_DATE_MASKS[mask] && odaDateTime.FORMATS_DATE_MASKS[mask].mask || mask || odaDateTime.FORMATS_DATE_MASKS["default"].mask);
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }
        let _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: new Date(y, m, d).toLocaleString(locale, { weekday: "short" }),
                dddd: new Date(y, m, d).toLocaleString(locale, { weekday: "long" }),
                m: m + 1,
                mm: pad(m + 1),
                mmm: new Date(y, m).toLocaleString(locale, { month: "short" }),
                mmmm: new Date(y, m).toLocaleString(locale, { month: "long" }),
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };
        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    }
}

if (!Date['masks']) {
    Object.defineProperty(Date, 'masks', {
        get() {
            return [
                'dd.mm.yyyy hh:MM:ss.lll',
                'dd.mm.yyyy hh:MM:ss',
                'dd.mm.yyyy hh:MM',
                'yyyy-mm-dd hh:MM:ss',
                'dd.mm.yyyy',
                'dd / mm / yyyy',
                'yyyy-mm-dd',
                'mm.yyyy',
                'hh:MM:ss',
                'hh:MM'
            ];
        }
    })
}

if (!Date['formats']) {
    Object.defineProperty(Date, 'formats', {
        get() {
            return [...Object.keys(odaDateTime.FORMATS_DATE_ALIAS), ...Object.keys(odaDateTime.FORMATS_DATE_MASKS), ...['dddd, dd mmmm yyyy г.'], ...Date.masks];
        }
    })
}

if (!Date['locales']) {
    Object.defineProperty(Date, 'locales', {
        get() {
            return ['ru-RU', 'en-US', 'ua-UA', 'ar-EG', 'zh-Hans-CN-u-nu-hanidec', 'th-TH-u-nu-thai'];
        }
    })
}

if (!Date['getFormattedValue']) {
    Object.defineProperty(Date.prototype, 'getFormattedValue', { enumerable: false, value: function (format, locale) {
        let args = typeof format === 'string' ? { format, locale } : format || {};
        return odaDateTime.getFormattedValue(this, args);
    }});
}

if (!Date['addHours']) {
    Object.defineProperty(Date.prototype, 'addHours', { enumerable: false, value: function (h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
    }});
}

if (!Date['addDays']) {
    Object.defineProperty(Date.prototype, 'addDays', { enumerable: false, value: function (days) {
        this.setDate(this.getDate() + days);
        return this;
    }});
}

if (!Date['getDaysInMonth']) {
    Object.defineProperty(Date.prototype, 'getDaysInMonth', { enumerable: false, value: function () {
        const d = new Date(this.getFullYear(), this.getMonth() + 1, 0);
        return d.getDate();
    }});
}

if (!Date['isLeapYear']) {
    Object.defineProperty(Date.prototype, 'isLeapYear', { enumerable: false, value: function (year) {
        return new Date(year, 1, 29).getDate() === 29;
    }});
}

export default odaDateTime;