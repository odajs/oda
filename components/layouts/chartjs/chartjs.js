import './dist/chart.js';
import './adapters/dist/chartjs-adapter-date-fns.js';

ODA({
    is: 'oda-chartjs', template: `
    <canvas></canvas>
`,
    props: {
        xAxisKey: String,
        chartGroupBy: String,
        orderBy: {
            default: 'ascending',
            list: ['ascending', 'descending']
        },
    },
    fields: [],
    items: [],
    quarter: {
        1: [1, 2, 3],
        2: [4, 5, 6],
        3: [7, 8, 9],
        4: [10, 11, 12]
    },
    GroupOptions: {
        Year: 'year',
        Month: 'month',
        Quarter: 'quarter'
    },
    SortType: {
        Ascending: 'ascending',
        Descending: 'descending'
    },
    get canvas() {
        return this.$('canvas');
    },
    attached() {
        const sortedItemsByDate = this.sortByDate(this.items, this.orderBy);
        const preparedItems = this.getPreparedItems(sortedItemsByDate);

        const chartLabels = this.getLabels(sortedItemsByDate);
        const chartDatasets = this.getDatasetsChartSettings(preparedItems);

        this.createChart(chartLabels, chartDatasets);
    },
    sortByDate(items, orderBy) {
        switch (orderBy) {
            case this.SortType.Descending:
                return items.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
            case this.SortType.Ascending:
            default:
                return items.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
        }
    },
    getPreparedItems(items) {
        return this.getGroupedItems(items);
    },
    getLabels(items) {
        const labels = callback => Array.from(new Set(items.map(callback.bind(this))));
        switch (this.chartGroupBy) {
            case this.GroupOptions.Year:
                return labels(this.getYear);
            case this.GroupOptions.Month:
                return labels(this.getMonthYearString);
            case this.GroupOptions.Quarter:
                return labels(this.getQuarterString);
            default:
                return items.map(i => i.date);
        }
    },
    getDatasetsChartSettings(preparedItems) {
        let fields = this.fields.length ? this.fields.slice() : this.getFields(this.items, this.xAxisKey);
        const colorList = this.getColorList(fields.length);

        return fields.map((i, idx) => ({
            label: i,
            data: preparedItems,
            backgroundColor: `rgba(${colorList[idx]}, .6)`,
            borderColor: `rgba(${colorList[idx]})`,
            borderWidth: 1,
            parsing: {
                xAxisKey: this.xAxisKey,
                yAxisKey: i
            },
        }));
    },
    getFields(list, without = '') {
        return Array.from(new Set(list.map(i =>
                Object.entries(i)
                    .filter(([k]) => k !== without)
                    .map(([k]) => k)
            )
                .reduce((prev, current) => [...prev, ...current], [])
        ));
    },
    getGroupedItems(items) {
        switch (this.chartGroupBy) {
            case this.GroupOptions.Year:
                return this.group(items, this.getYear.bind(this));
            case this.GroupOptions.Month:
                return this.group(items, this.getMonthYearString.bind(this));
            case this.GroupOptions.Quarter:
                return this.group(items, this.getQuarterString.bind(this));
            default:
                return this.getDefaultItemList(items);
        }
    },
    group(items, keyCallback) {
        const map = new Map();
        for (const item of items) {
            const key = keyCallback(item);
            if (map.has(key)) {
                const value = map.get(key);
                map.set(key, [...value, item]);
            } else {
                map.set(key, [item]);
            }
        }
        return Array.from(map).map(([year, data]) => this.sumObjectProperties(year, data));
    },
    getDefaultItemList(items) {
        return items.map(i =>
            Object.fromEntries(
                Object.entries(i).filter(([field]) =>
                    !this.fields.length || this.fields.includes(field) || field === this.xAxisKey
                )
            )
        );
    },
    sumObjectProperties(year, items) {
        const result = {};
        let fields = !!this.fields.length ? this.fields.slice() : this.getFields(this.items, this.xAxisKey);
        result.date = year;

        if (!fields.length) {
            items = this.filterArrayByField(items, this.xAxisKey);
            fields = this.getFields(items, this.xAxisKey);
        }

        for (const item of items) {
            for (const field of fields) {
                if (!result[field]) {
                    result[field] = 0;
                }
                result[field] += !!item[field] ? item[field] : 0;
            }
        }

        return result;
    },
    filterArrayByField(list, field) {
        return list.map(i =>
            Object.fromEntries(
                Object.entries(i).filter(([k]) => k !== field)
            )
        );
    },

    getYear(item) {
        return new Date(item.date).getFullYear();
    },
    getMonthYearString(item) {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', {month: 'long'});
        return month[0].toUpperCase() + month.slice(1) + ' ' + year;
    },
    getQuarterByMonthNumber(monthNumber) {
        return Object.entries(this.quarter)
            .map(([k, v]) => v.includes(monthNumber) ? k : '')
            .filter(i => !!i)[0];
    },
    getQuarterString(item) {
        const date = new Date(item.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const quarter = this.getQuarterByMonthNumber(month);
        return quarter + ' quarter ' + year;
    },

    getRandomRgbaColorCode() {
        const getRgbaNumber = () => Math.ceil(Math.random() * 255);
        return `${getRgbaNumber()}, ${getRgbaNumber()}, ${getRgbaNumber()}`;
    },
    getColorList(listLength) {
        const colorList = [];
        for (let i = 0; i < listLength; i++) {
            colorList.push(this.getRandomRgbaColorCode());
        }
        return colorList;
    },

    createChart(labels, datasets) {
        return new Chart(this.canvas, {
            type: 'bar',
            data: {labels, datasets},
        });
    },
});
