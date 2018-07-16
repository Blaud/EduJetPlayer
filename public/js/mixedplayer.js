/**
 * Created by blaud on 18.12.2017.
 */
(function localFileVideoPlayer() {
    'use strict';
    var URL = window.URL || window.webkitURL;

    var displayMessage = function (message, isError) {
        var element = document.querySelector('#message');
        element.innerHTML = message;
        element.className = isError ? 'error' : 'info';
    };

    var displaySacedSub = function (trackText) {
        var element = document.querySelector('#savedTracks');
        element.innerHTML += trackText+"<br>";
        element.className = 'info';
    };

    var playSelectedFile = function (event) {
        var file = this.files[0];
        var type = file.type;
        var videoNode = document.querySelector('video');
        var canPlay = videoNode.canPlayType(type);
        if (canPlay === '') canPlay = 'no';
        var message = 'Can play type "' + type + '": ' + canPlay;
        var isError = canPlay === 'no';


        var textTracks = videoNode.textTracks; // one for each track element
        var textTrack = textTracks[0]; // corresponds to the first track

        // textTrack.oncuechange = function (){
        //     // "this" is a textTrack
        //     var cue = this.activeCues[0]; // assuming there is only one active cue
        //     // do something
        //     displaySacedSub(cue.text);
        // };


        document.addEventListener('keydown', function(event) {
            if (event.keyCode == 17) {
                // "this" is a textTrack
                var cue = videoNode.textTracks[0].activeCues[0]; // assuming there is only one active cue
                // do something
                displaySacedSub(cue.text + "   Time: "+cue.startTime);
            }
        }, true);



        displayMessage(message, isError);

        if (isError) {
            return
        }

        var fileURL = URL.createObjectURL(file);
        videoNode.src = fileURL


    }
    var inputNode = document.querySelector('input');
    inputNode.addEventListener('change', playSelectedFile, false)
})();