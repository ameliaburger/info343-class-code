/*
    app.js
    main script file for this mapping application
    source data URL: https://data.seattle.gov/resource/65fc-btcc.json
*/

// when the DOM content has been loaded...
$(function() {
    'use strict';

    // load the traffic camera data
    var url = 'https://data.seattle.gov/resource/65fc-btcc.json';
    $.getJSON(url).then(function(data) {

        // initialize the map
        var map = L.map('map').setView([47.6097, -122.3331], 12);

        // initialize all cameras on the map
        addCameras(data);

        // create a filter for traffic camera names
        var cameraFilter = document.getElementById('traffic-filter-field');
        cameraFilter.addEventListener('keyup', function() {
            var filter = this.value.toLowerCase();
            var filteredCameras = data.filter(function(camera) {
                return camera.cameralabel.toLowerCase().indexOf(filter) >= 0; // if filter val exists inside camera name, then return true
            });
            addCameras(filteredCameras);
        });

        function addMapLayer() {
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiYWJ1cmdlciIsImEiOiJjaWZ4ZWVpdnI0MDdhdDVseTV6OHI5bW9jIn0.deO1IA40XW-pW_1GQh10wA'
            }).addTo(map);
        }

        // add markers for each traffic camera in the (possibly filtered) list to the map
        function addCameras(cameraList) {

            // remove all layers that may have been added previously
            map.eachLayer(function (layer) {
                map.removeLayer(layer);
            });

            // add the base map layer
            addMapLayer();

            // keep track of how many of each camera type are being shown
            var sdotCount = 0;
            var wsdotCount = 0;

            cameraList.forEach(function(camera) {

                // determine the color for each marker
                var dotColor;
                var dotFill;
                if (camera.ownershipcd == 'SDOT') {
                    dotColor = 'green';
                    dotFill = 'green';
                    sdotCount = sdotCount + 1;
                } else {
                    dotColor = 'red';
                    dotFill = 'red';
                    wsdotCount = wsdotCount + 1;
                }

                // add markers for all traffic cameras in cameraList to the map
                var marker = L.circle([camera.location.latitude, camera.location.longitude], 100, {
                    color: dotColor,
                    fillColor: dotFill,
                    fillOpacity: 0.5
                }).addTo(map);

                // add the traffic camera label and image to the marker popup
                var popupHTML = '<h2>' + camera.cameralabel + '</h2><img src="' + camera.imageurl.url + '">';
                marker.bindPopup(popupHTML);
            });

            // display to the user how many of each camera type are being shown
            $('#sdot').text(sdotCount);
            $('#wsdot').text(wsdotCount);

        };
    });
});