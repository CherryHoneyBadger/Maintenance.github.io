//PopUp 기능 추가
// 팝업 요소 정의
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


//View Animation var
var london = new ol.proj.fromLonLat([-0.12755, 51.507222]);
var moscow = new ol.proj.fromLonLat([37.6178, 55.7517]);
var istanbul = new ol.proj.fromLonLat([28.9744, 41.0128]);
var rome = new ol.proj.fromLonLat([12.5, 41.9]);
var bern = new ol.proj.fromLonLat([7.4458, 46, 95]);


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
    controls: new ol.control.defaults().extend([
        new ol.control.FullScreen({
            source: 'fullscreen',
        })
    ]),
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

//View Animation Functions

function bounce(t) {
    var s = 7.5625;
    var p = 2.75;
    var l;
    if (t < 1 / p) {
        l = s * t * t;
    } else {
        if (t < 2 / p) {
            t -= 1.5 / p;
            l = s * t * t + 0.75;
        } else {
            if (t < 2.5 / p) {
                t -= 2.25 / p;
                l = s * t * t + 0.9375;
            } else {
                t -= 2.625 / p;
                l = s * t * t + 0.984375;
            }
        }
    }
    return l;
}

// An elastic easing method (from https://github.com/DmitryBaranovskiy/raphael).
function elastic(t) {
    return (
        Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1
    );
}

function onClick(id, callback) {
    document.getElementById(id).addEventListener('click', callback);
}

onClick('rotate-left', function() {
    view.animate({
        rotation: view.getRotation() + Math.PI / 2,
    });
});

onClick('rotate-right', function() {
    view.animate({
        rotation: view.getRotation() - Math.PI / 2,
    });
});

onClick('pan-to-london', function() {
    view.animate({
        center: london,
        duration: 2000,
    });
});

onClick('elastic-to-moscow', function() {
    view.animate({
        center: moscow,
        duration: 2000,
        easing: elastic,
    });
});

onClick('bounce-to-istanbul', function() {
    view.animate({
        center: istanbul,
        duration: 2000,
        easing: bounce,
    });
});

function flyTo(location, done) {
    var duration = 2000;
    var zoom = view.getZoom();
    var parts = 2;
    var called = false;

    function callback(complete) {
        --parts;
        if (called) {
            return;
        }
        if (parts === 0 || !complete) {
            called = true;
            done(complete);
        }
    }
    view.animate({
            center: location,
            duration: duration,
        },
        callback
    );
    view.animate({
            zoom: zoom - 1,
            duration: duration / 2,
        }, {
            zoom: zoom,
            duration: duration / 2,
        },
        callback
    );
}

onClick('fly-to-bern', function() {
    flyTo(bern, function() {});
});

function tour() {
    var locations = [london, bern, rome, moscow, istanbul];
    var index = -1;

    function next(more) {
        if (more) {
            ++index;
            if (index < locations.length) {
                var delay = index === 0 ? 0 : 750;
                setTimeout(function() {
                    flyTo(locations[index], next);
                }, delay);
            } else {
                alert('Tour complete');
            }
        } else {
            alert('Tour cancelled');
        }
    }
    next(true);
}

onClick('tour', tour);