import React, { useState } from 'react'
const MicRecorder = require('mic-recorder-to-mp3');

const RecorderComponent = () => {
  const [fileInfo, setFileInfo] = useState({});

// New instance
const recorder = new MicRecorder({
  bitRate: 128
});
 
// Start recording. Browser will request permission to use your microphone.
const startRecording =() => {
  recorder.start().then(() => {
  // something else
}).catch((e) => {
  console.error(e);
});
}
const stopRecording = () => {
  // Once you are done singing your best song, stop and get the mp3.
recorder
.stop()
.getMp3().then(([buffer, blob]) => {
  // do what ever you want with buffer and blob
  // Example: Create a mp3 file and play
  const file = new File(buffer, 'trackTesting.mp3', {
    type: blob.type,
    lastModified: Date.now()
  });

  setFileInfo(file);
  console.log(file)
 
  const player = new Audio(URL.createObjectURL(file));
  player.play();
 
}).catch((e) => {
  alert('We could not retrieve your message');
  console.log(e);
});
}

  return (
    <div className="recorder-container">
      
      <div className="center-wrapper">
        <button onClick={() => startRecording()} className="recording-btns" id="record">
          <img src="/assets/icons/workspace/record.svg" alt="Record"/>
        </button>

        <button onClick={() => stopRecording()}className="recording-btns" id="stop">
          <img src="/assets/icons/workspace/stop.svg" alt="Stop Recording"/>
        </button>
      </div>
      <br />
      <br />
      <br />

      <ul id="playlist"></ul>
    </div>
  )
}


export default RecorderComponent;
