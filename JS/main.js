window.onload = init;

function init() {

    var view = new ol.View({
        //지도의 제약범위 설정, 지도 중앙 설정, 줌 거리 설정, 
        center: [14329735.536780592, 4378371.922890938],
        zoom: 8,
        //3D 지도를 볼경우 제약 범위를 주석처리 해야함 
        //제약 범위를 성정해 놓으면 제약 범위가 작동하지 않는다
        //extent: [14269650.441621488, 4311713.3414360015, 14399732.3423705, 4450133.8576256605],
        //constrainOnlyCenter: true,
        //minZoom: 12,
        //maxZoom: 20
    })

    var map = new ol.Map({
        //지도 표시 OSM(OpenStreetMap)
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: 'map',
        view: view
    })

    //2D 지도를 3D 지도로 바꿔주는 코드
    var ol3d = new olcs.OLCesium({
        map: map
    })

    var scene = ol3d.getCesiumScene();
    scene.terrainProvider = Cesium.createWorldTerrain();
    //ol3d.setEnabled 안의 boolean 값이 true일 경우 3d 지도 표시 false 일 경우 2d 지도를 표시 한다
    ol3d.setEnabled(false);


    // 클릭시 브라우저 콘솔에 좌표 표시
    /*
    map.on('click', function(e) {
        console.log(e.coordinate);
    })
    */
}