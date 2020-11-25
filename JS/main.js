//PopUp 기능 추가
// 팝업 요소 정의
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var overlay = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    }
});

//PopUp closer 기능
closer.onclick = function() {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};



var view = new ol.View({
    //지도의 제약범위 설정, 지도 중앙 설정, 줌 거리 설정, 
    center: [14329735.536780592, 4378371.922890938],
    zoom: 8
        //3D 지도를 볼경우 제약 범위를 주석처리 해야함 
        //제약 범위를 성정해 놓으면 제약 범위가 작동하지 않는다
        //extent: [14269650.441621488, 4311713.3414360015, 14399732.3423705, 4450133.8576256605],
        //constrainOnlyCenter: true,
        //minZoom: 12,
        //maxZoom: 20
});


var map = new ol.Map({
    //지도 표시 OSM(OpenStreetMap)
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),


        /*

        //Vector Layer code
        new ol.layer.VectorImage({
            imageRatio: 2,
            source: new ol.source.Vector({
                url: './data/VectorData_1.geojson',
                format: new ol.format.GeoJSON(),
            }),
            style: function FeatureStyle(feature) {
                style.getText().setText(feature.get('name'));
                return style;
            }
        }),
        */
    ],
    overlays: [overlay],
    target: 'map',
    view: view
});

/*
//Vector Tile Style
var style = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.6)',
    }),
    stroke: new ol.style.Stroke({
        color: '#319FD3',
        width: 1
    }),
    text: new ol.style.Text()
});

//OpenLayers - Vector Tile Style
var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    stlye: new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 1,
            height: 100
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 0, 0.1)',
        }),
    }),
});

var highlight;

var displayFeatureInfo = function(pixel) {
    map.getLayers().item(0).getFeatures(pixel).then(function(features) {
        var feature = features.length > 0 ? features[0] : undefined;

        var info = document.getElementById('info');
        if (feature) {
            info.innerHTML = feature.getId() + ': ' + feature.get('name');
        } else {
            info.innerHTML = '&nbsp;';
        }

        if (feature !== highlight) {
            if (highlight) {
                featureOverlay.getSource().removeFeature(highlight);
            }
            if (feature) {
                featureOverlay.getSource().addFeature(feature);
            }
            highlight = feature;
        }
    });
};

*/

//2D 지도를 3D 지도로 바꿔주는 코드
var ol3d = new olcs.OLCesium({
    map: map
});

var scene = ol3d.getCesiumScene();
scene.terrainProvider = Cesium.createWorldTerrain();
//ol3d.setEnabled 안의 boolean 값이 true일 경우 3d 지도 표시 false 일 경우 2d 지도를 표시 한다
ol3d.setEnabled(false);

map.on('singleclick', function(evt) {
    var coordinate = evt.coordinate;
    var hdms = new ol.coordinate.toStringHDMS(coordinate);

    content.innerHTML = '<p>You clicked Here!</p><code>' + hdms + '</code>';
    overlay.setPosition(coordinate);
});




// 클릭시 브라우저 콘솔에 좌표 표시
/*
map.on('click', function(e) {
    console.log(e.coordinate);
})
*/