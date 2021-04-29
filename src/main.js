import mapboxgl from 'mapbox-gl';
import { RulerControl } from 'mapbox-gl-controls';
import { InspectControl } from 'mapbox-gl-controls';
import { StylesControl } from 'mapbox-gl-controls';


var version = "zanocujwlesie-20210429-2";
var bounds = [
    [14.1146491, 48.9940062], // Southwest coordinates
    [24.1687284, 54.9022727] // Northeast coordinates
];

const style = (useLayer) => {
    return {
        'version': 8,
        "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
        'sources': {
            'mapycz': {
                'type': 'raster',
                'tiles': [
                    'https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}'
                ],
                'tileSize': 256,
                'attribution':
                    'map data: © Seznam.cz, a.s., © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            'opentopo': {
                'type': 'raster',
                'tiles': [
                    'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
                    'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
                    'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution':
                    'map data: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            },
            'bushcraft': {
                type: 'vector',
                tiles: ['https://d18e1t1gwitcxb.cloudfront.net/' + version + '/VectorTileServer/{z}/{x}/{y}.pbf'],
                attribution: '<a href="https://www.bdl.lasy.gov.pl/">Bank Danych o Lasach</a>',
                'minzoom': 0,
                'maxzoom': 14
            }
        },
        'layers': [
            {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': useLayer,
                'minzoom': 0,
                'maxzoom': 20
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
                'minzoom': 0,
                'maxzoom': 24
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
                'minzoom': 0,
                'maxzoom': 24
            }
        ]
    };
};


var mapOpts = {
    container: 'map',
    style: style("mapycz"),
    attributionControl: false
};

var parsedHash = location.hash.match(/#(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)/);

if (parsedHash !== null) {
    var lat = parseFloat(parsedHash[1]);
    var lng = parseFloat(parsedHash[2]);
    var zoom = parseFloat(parsedHash[3]);
    mapOpts.center = [lng, lat];
    mapOpts.zoom = zoom;
} else {
    mapOpts.bounds = bounds;
}

function updateHash() {
    var c = map.getCenter();
    history.replaceState({}, window.title, "#" + c.lat.toFixed(6) + "/" + c.lng.toFixed(6) + "/" + map.getZoom().toFixed(2));
}


mapboxgl.accessToken = "pk.eyJ1Ijoia2ZpZ2llbGEiLCJhIjoiY2pucHZ0ZXN6MDJubTNrczQ2NXhxa21kaiJ9.dhBjkVRz_TUpsDZMN93wkQ";
var map = new mapboxgl.Map(mapOpts);
map.on('dragend', updateHash);
map.on('zoomend', updateHash);


map.addControl(new mapboxgl.AttributionControl({
    customAttribution: '<a href="https://www.bdl.lasy.gov.pl/">Bank Danych o Lasach</a>'
}));

map.addControl(new StylesControl({
    styles: [
        {
            label: 'Mapy.cz',
            styleName: 'Mapy.cz',
            styleUrl: style('mapycz')
        }, {
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
map.addControl(new InspectControl() , 'bottom-right');
