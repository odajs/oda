const url = import.meta.url.toString().split('/').slice(0, -1).join('/');

const iconRetinaUrl = `${url}/lib/images/marker-icon-2x.png`;
const iconUrl = `${url}/lib/images/marker-icon.png`;
const shadowUrl = `${url}/lib/images/marker-shadow.png`;

ODA({ is: 'oda-leaflet',
    template: `
        <style>
            :host {
                display:block;
                height: 100%;
            }
        </style>
        <link rel="stylesheet" :href="styleHref">
        <div id="mapid" style="height: 100%"></div>
    `,
    get styleHref() {
        return url + '/lib/leaflet.css';
    },
    $public: {
        latitude: { type: Number },
        longitude: { type: Number },
        zoom: 13,
        minZoom: 3,
        markers: [],
        polygons: [],
        circles: [],
        polylines: []
    },
    async attached() {

        const L = (await import(`${url}/lib/leaflet-src.esm.js`));
        const iconDefault = L.icon({
            iconRetinaUrl, iconUrl, shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });
        L.Marker.prototype.options.icon = iconDefault;
        this._map = L.map(this.$('#mapid'));
        this._map.setView([this.latitude, this.longitude], this.zoom);
        let urlTemplate = 'https://{s}.tile.osm.org/{z}/{x}/{y}.png';
        this._map.addLayer(L.tileLayer(urlTemplate, { minZoom: this.minZoom }));
        this.markers.forEach(i => {
            if (i.latitude && i.longitude) {
                let el = L.marker([i.latitude, i.longitude]).addTo(this._map);
                if (i.bindPopup) el.bindPopup(i.bindPopup);
            }
        });
        this.polygons.forEach(i => {
            if (i.polygons?.length) {
                let el = L.polygon([i.polygons], { ...i.args }).addTo(this._map);
                if (i.bindPopup) el.bindPopup(i.bindPopup);
            }
        });
        this.circles.forEach(i => {
            if (i.latitude && i.longitude) {
                let el = L.circle([i.latitude, i.longitude], { ...i.args }).addTo(this._map);
                if (i.bindPopup) el.bindPopup(i.bindPopup);
            }
        });
        this.polylines.forEach(i => {
            if (i.polylines?.length) {
                let el = L.polyline([i.polylines], { ...i.args }).addTo(this._map);
                if (i.bindPopup) el.bindPopup(i.bindPopup);
            }
        });
    },
    $observers: [
        function _observers(latitude, longitude, zoom) {
            this._map?.setView([latitude, longitude], zoom);
        }
    ]
})
