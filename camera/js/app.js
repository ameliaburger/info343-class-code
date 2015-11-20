
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    navigator.getUserMedia = navigator.getUserMedia
                            || navigator.webkitGetUserMedia //chrome version
                            || navigator.mozGetUserMedia //older firefox version
                            || navigator.msGetUserMedia;

    var video = document.querySelector('video'); //use css selector to get refrence to elem
    var canvas = document.querySelector('canvas');
    var snapshot = document.querySelector('img');
    var ctx = canvas.getContext('2d');
    var videoStream;
    var mouseIsDown = false;

    navigator.getUserMedia({video: true}, function(stream) {
        videoStream = stream;
        video.src = window.URL.createObjectURL(stream);

    }, function(err) {
        console.error(err);
    });

    video.addEventListener('click', function() {
       if (videoStream) {
           canvas.width = video.clientWidth;
           canvas.height = video.clientHeight;
           ctx.drawImage(video, 0, 0);
       }
    });

    canvas.addEventListener('mousedown', function(evt) {
        var x = evt.clientX - canvas.offsetLeft; //x with respect to canvas
        var y = evt.clientY - canvas.offsetTop + window.scrollY;
        ctx.strokeStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(x, y);
        mouseIsDown = true;
    });

    canvas.addEventListener('mousemove', function(evt) {
        var x = evt.clientX - canvas.offsetLeft;
        var y = evt.clientY - canvas.offsetTop + window.scrollY;

        if (mouseIsDown) {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    });

    canvas.addEventListener('mouseup', function(evt) {
        mouseIsDown = false;
    });

    document.querySelector('#btnSnapshot').addEventListener('click', function(evt) {
        document.querySelector('img').src = canvas.toDataURL();
    })


});

