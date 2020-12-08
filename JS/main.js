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

function createStyle(src, img) {
    return new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 0.96],
            crossOrigin: 'anonymous',
            src: src,
            img: img,
            imgSize: img ? [img, width, img.height] : undefined,
        }),
    });

}

var iconFeature = new ol.Feature(new ol.geom.Point([14329735.536780592, 4378371.922890938]));
iconFeature.set('style', createStyle('data/Icon.png', undefined));

var view = new ol.View({
    //지도의 제약범위 설정, 지도 중앙 설정, 줌 거리 설정, 
    center: [14329735.536780592, 4378371.922890938],
    zoom: 8

});


var map = new ol.Map({
    //지도 표시 OSM(OpenStreetMap)
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
            style: function(feature) {
                return feature.get('style');
            },
            source: new ol.source.Vector({ features: [iconFeature] }),
        })
    ],
    overlays: [overlay],
    target: document.getElementById('map'),
    view: view
});

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