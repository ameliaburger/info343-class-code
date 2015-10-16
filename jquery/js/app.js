/*
    script for the index.html page
    dependencies: jquery

    open weather API: 
    http://api.openweathermap.org/data/2.5/weather?zip=98195,us&units=imperial&appid=bd82977b86bf27fb59a04b61b657fb6f
*/

// when the DOM content has been loaded...
$(function() {
    'use strict';
    $('a').attr('target', '_blank');
    $('article').hide().fadeIn(1000); // .hide() returns the same object that it took as a parameter (and so on) -> jQuery method chain
    $('#toggle-article').click(function() {
       $('article').fadeToggle();
    });

    var url = 'http://api.openweathermap.org/data/2.5/weather?zip=98195,us&units=imperial&appid=bd82977b86bf27fb59a04b61b657fb6f';
    $.getJSON(url).then(function(data) {  // when I call JSON the next line will execute before the data comes back from the server,
        console.log(data);                // once the data comes back, the .then function executes - it's a callback function,
        var temperature = data.main.temp; // it executes once it has been notified that the data has come back
        $('#temp').text(Math.round(temperature));
    });

    console.log('test');

});