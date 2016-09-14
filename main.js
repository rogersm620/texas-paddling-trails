(function() {
    
    var baseLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.{ext}', {
        attribution: 'This map was created by <a href="http://campfiremapping.com">Ryan Rogers</a>, 2016...Tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        minZoom: 0,
        maxZoom: 18,
        ext: 'png',
        maxBounds: L.latLngBounds([28.02, -100.52], [33.86, -94.32])
    });

    var map = L.map('map', {
        scrollWheelZoom: false,
        zoomControl: false,
        dragging: true,
        touchZoom: true,
        center: [31.62, -96.49],
        zoom: 6
    });

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    map.addLayer(baseLayer);

    var trails = {
        user_name: 'rogersm620',
        type: 'cartodb',
        sublayers: [
            {
                sql: "SELECT * FROM trails_wgs84",
                cartocss: $("#trails2").text()
            }
        ]
    }
    cartodb.createLayer(map, trails, {
            https: true
        }).addTo(map)
        .on('done', function (layer) {

            var sublayer = layer.getSubLayer(0);

            sublayer.setInteraction(true);
            cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['trails', 'distance', 'address'], {
                infowindowTemplate: $('#trails').html(),
                templateType: 'mustache'
            });
        })


    var accessPoints = {
        user_name: 'rogersm620',
        type: 'cartodb',
        sublayers: [
            {
                sql: "SELECT * FROM access_points",
                cartocss: $("#accessPoints").text()
            }
        ]
    }
    cartodb.createLayer(map, accessPoints, {
            https: true
        }).addTo(map)
        .on('done', function (layer) {

            var sublayer = layer.getSubLayer(0);
            sublayer.setInteraction(true);
            cartodb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['trail', 'accesspoin', 'type', 'lat', 'lng'], {
                infowindowTemplate: $('#access').html(),
                templateType: 'mustache'
            });
        })


    var sourcesLayers = { //formatting for layer selector
        "<b style='color:#801515'>Paddling Trails</>": trails,
        "<b style='color:#d46a6a'>Access Points</>": accessPoints
    }
    
    $('#locateButton').on('click', function() {
        findUserLoc();
    })


    function mapUserLoc(position) {

        lon = position.coords.longitude;
        lat = position.coords.latitude;

        map.setView(new L.LatLng(lat, lon), 8);

        L.circleMarker([lat, lon], {
            radius: 8
        }).addTo(map);

        findClosest([lat,lon])
    }

    function findUserLoc() {
        if (navigator.geolocation) {

            var timeoutVal = 10000000;  // ?

            navigator.geolocation.watchPosition(
                mapUserLoc,
                alertError, {
                    enableHighAccuracy: true,
                    timeout: timeoutVal,
                    maximumAge: 0
                }
            );
        } else {
            alert("Geolocation is not supported by your browser :(");
        }

    }

    function findClosest(loc) {

        console.log(loc)
    }

    function alertError(error) {

        var errors = {
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
        alert("Error: " + errors[error.code]);
    }

    // L.control.layers(null, sourcesLayers, { collapsed:false, position:'bottomright' }).addTo(map);      //add layer selector box
    
})(); // end main