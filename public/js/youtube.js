// Scripts to control and integrate with YouTube player

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady () {
  player = new YT.Player("player", { // Inject player into div with id "player"
    height: "480",
    width: "854",
    videoId: "dQw4w9WgXcQ", // default
    events: {
      "onReady": onPlayerReady,
      "onStateChange": onPlayerStateChange
    }
  });
}

// The API will call this function when the video player is ready.
function onPlayerReady (event) {
  event.target.playVideo();
}

// The API calls this function when the player's state changes.
function onPlayerStateChange (event) {
  // console.log("Current time: " + player.getCurrentTime());
}
