import './dist/chart.js';
import './adapters/dist/chartjs-adapter-date-fns.js';

ODA({
    is: 'oda-chartjs', template: `
    <canvas width="400" height="400"></canvas>
`,
    props: {
        xAxisKey: String,
        chartGroupBy: String,
        fields: Array,
    },
    items: [],
    GroupOptions: {
        Year: 'year',
        Month: 'month',
    },
    get canvas() {
        return this.$('canvas');
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
    getLabels() {
        if (this.chartGroupBy === this.GroupOptions.Year) {
            return Array.from(
                new Set(
                    this.items.map(i => new Date(i.date).getFullYear())
                )
            ).sort();
        }
        return this.items.map(i => i.date);
    },
    getDefaultItemList() {
        return this.items.map(i =>
            Object.fromEntries(
                Object.entries(i).filter(([field]) =>
                    !this.fields.length || this.fields.includes(field)
                )
            )
        );
    },
    getGroupedItems() {
        switch (this.chartGroupBy) {
            case this.GroupOptions.Year:
                return this.groupByYear();
            default:
                return this.getDefaultItemList();
        }
    },
    groupByYear() {
        const mapByYear = new Map();
        for (const item of this.items) {
            const year = new Date(item.date).getFullYear();
            if (mapByYear.has(year)) {
                const mapValue = mapByYear.get(year);
                mapByYear.set(year, [...mapValue, item]);
            } else {
                mapByYear.set(year, [item]);
            }
        }

        return Array.from(mapByYear).sort()
            .map(([year, data]) => this.sumObjectProperties(year, data));
    },
    getPreparedItems() {
        return this.getGroupedItems();
    },
    sumObjectProperties(year, list) {
        const result = {};
        let fields = this.fields;
        result.date = year;

        if (!fields.length) {
            list = this.filterArrayByField(list, this.xAxisKey);
            fields = this.getFields(list, this.xAxisKey);
        }

        for (const item of list) {
            for (const field of fields) {
                if (!result[field]) {
                    result[field] = 0;
                }
                result[field] += !!item[field] ? item[field] : 0;
            }
        }

        return result;
    },
    getDatasetsChartSettings(preparedItems) {
        const fields = this.fields.length ? this.fields : this.getFields(this.items, this.xAxisKey);
        const colorList = this.getColorList(fields.length);

        return fields.map((i, idx) => ({
            label: i,
            data: this.chartGroupBy && preparedItems || this.items,
            backgroundColor: `rgba(${colorList[idx]}, .5)`,
            borderColor: `rgba(${colorList[idx]})`,
            borderWidth: 1,
            parsing: {
                xAxisKey: this.xAxisKey,
                yAxisKey: i
            },
        }));
    },
    filterArrayByField(list, field) {
        return list.map(i =>
            Object.fromEntries(
                Object.entries(i).filter(([k]) => k !== field)
            )
        );
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
    attached() {
        const preparedItems = this.getPreparedItems();
        const chartSettings = this.getDatasetsChartSettings(preparedItems);

        new Chart(this.canvas, {
            type: 'bar',
            data: {
                labels: this.getLabels(),
                datasets: chartSettings,
            },
        });
    }
});
