import * as L from './lib/leaflet-src.esm.js';

const iconRetinaUrl = '/web/oda/components/viewers/leaflet/lib/images/marker-icon-2x.png';
const iconUrl = '/web/oda/components/viewers/leaflet/lib/images/marker-icon.png';
const shadowUrl = '/web/oda/components/viewers/leaflet/lib/images/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl, iconUrl, shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

ODA({ is: 'oda-leaflet', template: `
        <style>
            :host {
                display:block;
                height: 100%;
            }
        </style>
        <link rel="stylesheet" href="/web/oda/components/viewers/leaflet/lib/leaflet.css">
        <div id="mapid" style="height: 100%"></div>
    `,
    props: {
        latitude: { type: Number },
        longitude: { type: Number },
        zoom: 13,
        minZoom: 3,
        markers: [],
        polygons: [],
        circles: [],
        polylines: []
    },
    attached() {
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
    observers: [
        function _observers(latitude, longitude, zoom) {
            this._map.setView([latitude, longitude], zoom);
        }
    ]
})
