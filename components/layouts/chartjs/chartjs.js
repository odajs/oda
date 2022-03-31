import './dist/chart.js';
import './adapters/dist/chartjs-adapter-date-fns.js';

ODA({
    is: 'oda-chartjs',
    template: `
        <canvas></canvas>
    `,
    props: {
        xAxisKey: {
            default: 'date',
            type: String,
        },
        groupBy: String,
        orderBy: {
            default: 'ascending',
            list: ['ascending', 'descending']
        },
        xAxisType: {
            default: 'date',
            list: ['date', 'other']
        },
        aggregate: {
            default: 'sum',
            list: ['sum', 'count', 'average', 'min', 'max']
        },
        items: {
            type: Array,
            set(n, o) {
            }
        }
    },
    fields: [],
    items: [],
    chart: undefined,
    colorList: [],
    KeyType: {
        Date: 'date',
        Other: 'other'
    },
    GroupOptions: {
        Year: 'year',
        Month: 'month',
        Quarter: 'quarter',
        AxisKey: 'xAxisKey'
    },
    SortType: {
        Ascending: 'ascending',
        Descending: 'descending'
    },
    AggregateType: {
        Sum: 'sum',
        Average: 'average',
        Count: 'count',
        Min: 'min',
        Max: 'max'
    },
    quarter: {
        1: [1, 2, 3],
        2: [4, 5, 6],
        3: [7, 8, 9],
        4: [10, 11, 12]
    },
    observers: [
        function itemsChanged(items) {
            this.changeChartData();
        }
    ],
    get canvas() {
        return this.$('canvas');
    },
    attached() {
        const {chartLabels, chartDatasets} = this.getChartSettings();
        this.chart = this.createChart(chartLabels, chartDatasets);
    },
    getChartSettings() {
        const sortedItemsByDate = this.getSortedItems(this.items);
        const preparedItems = this.getPreparedItems(sortedItemsByDate);

        const chartLabels = this.getLabels(sortedItemsByDate);
        const chartDatasets = this.getDatasetsChartSettings(preparedItems);

        return {chartLabels, chartDatasets};
    },
    changeChartData() {
        if (!this.chart) {
            return;
        }
        const {chartLabels, chartDatasets} = this.getChartSettings();

        this.chart.data.labels = chartLabels;
        this.chart.data.datasets = chartDatasets;
        this.chart.update();
    },
    getSortedItems(items) {
        switch (this.xAxisType) {
            case this.KeyType.Other:
                return items;
            case this.KeyType.Date:
            default:
                return this.sortByDate(items);
        }
    },
    sortByDate(items) {
        switch (this.orderBy) {
            case this.SortType.Descending:
                return items.slice().sort((a, b) => new Date(b[this.xAxisKey]) - new Date(a[this.xAxisKey]));
            case this.SortType.Ascending:
            default:
                return items.slice().sort((a, b) => new Date(a[this.xAxisKey]) - new Date(b[this.xAxisKey]));
        }
    },
    getPreparedItems(items) {
        return this.getGroupedItems(items);
    },
    getLabels(items) {
        const labels = callback => Array.from(new Set(items.map(callback.bind(this))))

        switch (this.groupBy) {
            case this.GroupOptions.Year:
                return labels(this.getYear);
            case this.GroupOptions.Month:
                return labels(this.getMonthYearString);
            case this.GroupOptions.Quarter:
                return labels(this.getQuarterString);
            case this.GroupOptions.AxisKey:
                return labels(this.getAxisKey);
            default:
                return items.map(i => i[this.xAxisKey]);
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
        switch (this.groupBy) {
            case this.GroupOptions.Year:
                return this.group(items, this.getYear.bind(this));
            case this.GroupOptions.Month:
                return this.group(items, this.getMonthYearString.bind(this));
            case this.GroupOptions.Quarter:
                return this.group(items, this.getQuarterString.bind(this));
            case this.GroupOptions.AxisKey:
                return this.group(items, this.getAxisKey.bind(this));
            default:
                return this.getDefaultItemList(items);
        }
    },
    getAxisKey(item) {
        return item[this.xAxisKey];
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

        let fields = !!this.fields.length ? this.fields.slice() : this.getFields(this.items, this.xAxisKey);

        switch (this.aggregate) {
            case this.AggregateType.Average:
            case this.AggregateType.Count:
                return this.aggregateByAverageOrCount(map, fields);
            case this.AggregateType.Max:
            case this.AggregateType.Min:
                return this.aggregateByMaxMinValues(map, fields);
            case this.AggregateType.Sum:
            default:
                return this.aggregateBySum(map, fields);
        }
    },
    aggregateBySum(itemsMap, fields) {
        return Array.from(itemsMap).map(([key, data]) => this.sumObjectProperties(key, data, fields));
    },
    aggregateByAverageOrCount(itemsMap, fields) {
        return Array.from(itemsMap).map(([key, data]) => this.averageOrCountObjectPropertiesValues(key, data, fields));
    },
    aggregateByMaxMinValues(itemsMap, fields) {
        return Array.from(itemsMap).map(([key, data]) => this.getMaxMinValues(key, data, fields));
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
    sumObjectProperties(key, items, fields) {
        const result = {};
        result[this.xAxisKey] = key;

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
    averageOrCountObjectPropertiesValues(key, items, fields) {
        const result = {};
        let elementCount = new Map();
        result[this.xAxisKey] = key;

        for (const item of items) {
            for (const field of fields) {
                if (!result[field]) {
                    result[field] = 0;
                }
                result[field] += !!item[field] ? item[field] : 0;
            }
        }

        for (const item of items) {
            Object.entries(item)
                .filter(([k]) => k !== this.xAxisKey)
                .forEach(([k, v]) => {
                    if (!elementCount.has(k) && !!v) {
                        elementCount.set(k, 1);
                        return;
                    }
                    let value = elementCount.get(k);
                    elementCount.set(k, ++value);
                });
        }

        elementCount = Object.fromEntries(elementCount);
        for (const item in result) {
            if (item !== this.xAxisKey) {
                if (this.aggregate === this.AggregateType.Average) {
                    result[item] = +(result[item] / elementCount[item]).toFixed(1);
                } else if (this.aggregate === this.AggregateType.Count) {
                    result[item] = elementCount[item];
                }
            }
        }

        return result;
    },
    getMaxMinValues(key, items, fields) {
        const result = {};
        let elementCount = new Map();
        result[this.xAxisKey] = key;

        for (const item of items) {
            for (const field of fields) {
                if (!result[field]) {
                    result[field] = 0;
                }
                result[field] += !!item[field] ? item[field] : 0;
            }
        }

        for (const item of items) {
            Object.entries(item)
                .filter(([k]) => k !== this.xAxisKey)
                .forEach(([k, v]) => {
                    if (!elementCount.has(k) && !!v) {
                        elementCount.set(k, v);
                        return;
                    }
                    let value = elementCount.get(k);
                    if (this.aggregate === this.AggregateType.Max && v > value) {
                        elementCount.set(k, v);
                    } else if (this.aggregate === this.AggregateType.Min && v < value) {
                        elementCount.set(k, v);
                    }
                });
        }

        elementCount = Object.fromEntries(elementCount);
        for (const item in result) {
            if (item !== this.xAxisKey) {
                result[item] = elementCount[item];
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
        return new Date(item[this.xAxisKey]).getFullYear();
    },
    getMonthYearString(item) {
        const date = new Date(item[this.xAxisKey]);
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
        const date = new Date(item[this.xAxisKey]);
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
        let count = listLength;
        if (this.colorList.length) {
            if (listLength > this.colorList.length) {
                count = listLength - this.colorList.length;
                for (let i = 0; i < count; i++) {
                    this.colorList.push(this.getRandomRgbaColorCode());
                }
            }
            return this.colorList;
        }

        const colorList = [];
        for (let i = 0; i < listLength; i++) {
            colorList.push(this.getRandomRgbaColorCode());
        }

        this.colorList = colorList;
        return colorList;
    },

    createChart(labels, datasets) {
        return new Chart(this.canvas, {
            type: 'line',
            data: {labels, datasets},
        });
    },
});
