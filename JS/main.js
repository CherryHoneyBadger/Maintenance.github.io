window.onload = init;

function init() {

    var view = new ol.View({
        center: [0, 0],
        zoom: 8,
        extent: [14269650.441621488, 4311713.3414360015, 14399732.3423705, 4450133.8576256605],
        constrainOnlyCenter: true
    })

    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'map',
        view: view
    })

    map.on('click', function(e) {
        console.log(e.coordinate);
    })
}