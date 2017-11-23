var RTCPeerConnection = null;
var getUserMedia = null;
var connectStreamToSrc = null;
var onMessage = null ;
var detectedBrowser = null;

if (navigator.getUserMedia) {
    // WebRTC standard
    RTCPeerConnection = RTCPeerConnection;
    getUserMedia = navigator.getUserMedia.bind(navigator);
} else if (navigator.mozGetUserMedia) {
    // early Firefox
    detectedBrowser = "Firefox" ;
    RTCPeerConnection = mozRTCPeerConnection;
    RTCSessionDescription = mozRTCSessionDescription;
    RTCIceCandidate = mozRTCIceCandidate;
    getUserMedia = navigator.mozGetUserMedia.bind(navigator);
    /*onMessage = function (event) {
        var t_msg = time() ;
        var blob = event.data; // Firefox allows sending blobs directly
        if( typeof blob === "object" )
        {
            var reader = new window.FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (event) {
                var fileDataURL = event.target.result; // it is Data URL...can be saved to disk
                saveToDisk(fileDataURL, 'fake fileName');
            };
        }
        else
        {
            appendDIV(event.data);
            log("Text message received at " + t_msg.toString() ) ;
        }
    };*/
}
else if (navigator.webkitGetUserMedia) {
    detectedBrowser = "Chrome" ;
    RTCPeerConnection = webkitRTCPeerConnection;
    getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
} else {
    alert("WebRTC is not supported.");
}
var videoSourceId = null ;
var audioSourceId = null ;
function gotSources(sourceInfos) {
    for (var i = 0; i != sourceInfos.length; ++i) {
        var sourceInfo = sourceInfos[i];
        if (sourceInfo.kind === 'audio') {
            //log('Audio ' + sourceInfo.label ) ;
            if( audioSourceId == null )
                audioSourceId = sourceInfo.id ;
        } else if (sourceInfo.kind === 'video') {
            //log('Video source found: ' + sourceInfo.label ) ;
            //if( sourceInfo.label.indexOf("facing back") != -1 )
            //{
                //videoSourceId  = sourceInfo.id ;
                //log("Found " + videoSourceId ) ;
            //}
        } else {
            log('Some other kind of source: ', sourceInfo);
        }
    }
}
if (detectedBrowser == "Chrome") {
    MediaStreamTrack.getSources(gotSources);
}
var server = {
    "iceServers": [
    //{url:"stun:stun.services.mozilla.com"}//,
    //{url:"stun:23.21.150.121"},
    {url:"stun:stun.l.google.com:19302"}]
};
