import mapboxgl from 'mapbox-gl';
import { RulerControl } from 'mapbox-gl-controls';
import { StylesControl } from 'mapbox-gl-controls';


var version = "zanocujwlesie-20220723";
var bounds = [
    [14.1146491, 48.9940062], // Southwest coordinates
    [24.1687284, 54.9022727] // Northeast coordinates
];

const style = (useLayer) => {
    return {
        'version': 8,
        "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        'sources': {
            'opentopo': {
                'type': 'raster',
                'tiles': [
                    'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
                    'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
                    'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution':
                    '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a>, <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            },
            'bushcraft': {
                'type': 'vector',
                'tiles': [`https://d18e1t1gwitcxb.cloudfront.net/${version}/VectorTileServer/{z}/{x}/{y}.pbf`],
                'attribution': '<a href="https://www.bdl.lasy.gov.pl/">Bank Danych o Lasach</a>',
                'minzoom': 0,
                'maxzoom': 14
            }
        },
        'layers': [
            {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': useLayer,
                'minzoom': 2,
                'maxzoom': 18
            },
            {
                'id': 'bushcraft',
                'type': 'fill',
                'source': 'bushcraft',
                'source-layer': version,
                'layout': {},
                'paint': {
                    'fill-color': 'rgba(0, 0, 128, 0.1)'
                },
                'minzoom': 2,
                'maxzoom': 18
            },
            {
                'id': 'bushcraft-line',
                'type': 'line',
                'source': 'bushcraft',
                'source-layer': version,
                'layout': {},
                'paint': {

                    'line-color': 'rgba(0, 0, 128, 0.8)',
                    'line-width': 2
                },
                'minZoom': 2,
                'maxZoom': 18
            }
        ]
    };
};

mapboxgl.accessToken = "pk.eyJ1Ijoia2ZpZ2llbGEiLCJhIjoiY2pucHZ0ZXN6MDJubTNrczQ2NXhxa21kaiJ9.dhBjkVRz_TUpsDZMN93wkQ";
var map = new mapboxgl.Map({
    container: 'map',
    style: style("mapycz-turist"),
    attributionControl: true,
    minZoom: 2,
    maxZoom: 17,
    bounds: bounds,
    maxPitch: 0
});

const updateHash = () => {
    var c = map.getCenter();
    history.replaceState({}, window.title, "#" + c.lat.toFixed(6) + "/" + c.lng.toFixed(6) + "/" + map.getZoom().toFixed(2));
}
map.on('dragend', updateHash);
map.on('zoomend', updateHash);

map.addControl(new StylesControl({
    styles: [
        {
            label: 'OpenTopoMap',
            styleName: 'OpenTopoMap',
            styleUrl: style('opentopo')
        },
    ]
}), 'bottom-right');

map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    }), 'bottom-right'
);

map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
map.addControl(new RulerControl(), 'bottom-right');

map.on('click', 'bushcraft', (e) => {
    const coordinates = e.lngLat;
    const props = e.features[0].properties;
    const description = `Nadleśnictwo <b>${props.nadl}</b><br>Leśnictwo <b>${props.les}</b>`;
    new mapboxgl.Popup()
    .setLngLat(coordinates)
    .setHTML(description)
    .addTo(map);
});

// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'bushcraft', function () {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'bushcraft', function () {
    map.getCanvas().style.cursor = '';
});


const hashChanged = () => {
    const parsedHash = location.hash.match(/#(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)/);

    if (parsedHash !== null) {
        const lat = parseFloat(parsedHash[1]);
        const lng = parseFloat(parsedHash[2]);
        const zoom = parseFloat(parsedHash[3]);
        map.jumpTo({center: [lng, lat], zoom});
        console.log(`Hash changed ${lat} ${lng} ${zoom}`);
    }
}

window.addEventListener("hashchange", hashChanged, false);
hashChanged();
