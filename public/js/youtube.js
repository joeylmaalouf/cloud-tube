// Scripts to control and integrate with youtube player

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady () {
  player = new YT.Player("player", { // Inject player into div with id "player"
    height: "390",
    width: "640",
    videoId: "M7lc1UVf-VE",
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
var done = false;
function onPlayerStateChange (event) {
  console.log("Current time", getPos());
}

function stopVideo () {
  player.stopVideo();
}

// Return the time since the video started playing;
// Accounts for seeking within the video
function getPos () {
  return player.getCurrentTime();
}
