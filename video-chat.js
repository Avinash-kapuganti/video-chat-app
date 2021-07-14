let mute = false;
let video = false;
let mystream;

// client creation
let client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

// initialized the client
client.init("ff7227d7c2bc4cb0b93e0b6b5472322c");

// creating the channel
client.join(
  "006ff7227d7c2bc4cb0b93e0b6b5472322cIACs8jAhvIw7kjjXs13QtFbEnwfvw5X1c2rk+fEczZAF16DfQtYAAAAAEAAHiSHUPnTuYAEAAQBUdO5g",
  "demo",
  null,
  (uid) => {
    // Create a local stream
    let localStream = AgoraRTC.createStream({
      audio: true,
      video: true,
    });
    localStream.init(() => {
      mystream = localStream;
      localStream.play("local");
      client.publish(localStream);
    });
  }
);
//remote stream
client.on("stream-added", function (evt) {
  client.subscribe(evt.stream);
});

client.on("stream-subscribed", function (evt) {
  let stream = evt.stream;
  let streamId = String(stream.getId());
  let right = document.getElementById("remote");
  let div = document.createElement("div");
  div.id = streamId;
  right.appendChild(div);
  stream.play(streamId);
});
// Remove the video stream from the container.
function removeVideoStream(elementId) {
  let remoteDiv = document.getElementById(elementId);
  if (remoteDiv) remoteDiv.parentNode.removeChild(remoteDiv);
};
// Remove the corresponding view when a remote user unpublishes.
client.on("stream-removed", function(evt){
  let stream = evt.stream;
  let streamId = String(stream.getId());
  stream.close();
  removeVideoStream(streamId);
});

function muteAudio() {
  mystream.muteAudio();
}

function unmuteAudio() {
  mystream.unmuteAudio();
}

function enableVideo() {
  mystream.enableVideo();
}
function disableVideo() {
  mystream.disableVideo();
}

// Remove the corresponding view when a remote user leaves the channel.
client.on("peer-leave", function(evt){
  let stream = evt.stream;
  let streamId = String(stream.getId());
  stream.close();
  removeVideoStream(streamId);
});

async function leave(){
await client.leave();
}
