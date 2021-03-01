import React, {useState, useEffect} from 'react'
// GraphQL
import { useMutation } from "@apollo/client";
// import {  } from "../../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";

var ab2str = require('arraybuffer-to-string')
var str2ab = require('string-to-arraybuffer')

const MicRecorder = require('mic-recorder-to-mp3');

interface ComponentProps {
  playbar: {
    data : object
  }
}

const mapState = (state: ComponentProps) => ({
  data: state.playbar.data
})

const mapDispatch = {
  assignTrack: (data: any) => ({type: "ASSIGN_TRACK", payload: data })
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

var counter: number;
// import RecorderComponent from "../RecorderComponent";
const Tracks  = ({assignTrack} : Props) => {
  const [trackForm, setTrackForm] = useState({
    name: ""
  })
  const [initForm, setForm] = useState(false);
  const [audioBuffer, storeBuffer] = useState([]);
  const [tracks, setTracks] = useState([{
    name: "",
    url : "",
    created: "",
  }])
  // const [src, setSrc] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if(seconds === 60) {
          setMinutes(minutes => minutes + 1);
          setSeconds(0);
        }else {
          setSeconds(seconds => seconds + 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive,seconds])


//New instance
const recorder = new MicRecorder({
  bitRate: 128
});
// Start recording. Browser will request permission to use your microphone.
const startRecording =() => {
  console.log("recording...")
  if(counter === 0 || counter === undefined) {
    recorder.start().then(() => {
      // something else
      }).catch((e: any) => {
        console.error(e);
      });
      return counter = 1;
  } else if(counter === 1) {
      // setIsActive(false);
  console.log("stop recording") 
  // Stop recording
  recorder
  .stop()
  .getMp3().then(([buffer, blob]: any) => {
    // Store buffer in component state
    storeBuffer(buffer);
    // Open Form pop up
    setForm(true);
}).catch((e: any) => {
  alert('We could not retrieve your message');
  console.log(e);
});
return counter = 0;
  }
}

const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
  setTrackForm({...trackForm, [e.target.name] : e.target.value })
}

const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Create Track name
  const trackName = trackForm.name;
  // Create New file
  const newFile = new File(audioBuffer, trackName, {
    type: "audio/mp3",
    lastModified: Date.now()
  });
  console.log(newFile);
  assignTrack(newFile);
  const date = Date.now();
  const newDate = new Date(date);
  const created = newDate.toDateString();
  
    // Create audio url with the new file
    const audioUrl = URL.createObjectURL(newFile);
  const audioObject = {
    name: trackName,
    url: audioUrl,
    created
  }
    // Push to state
    setTracks([...tracks, audioObject])
    // Handle Buffer with redux



    // const decode = (str: any):string => Buffer.from(str, 'base64').toString('binary');
    // const encode = (str: any):string => Buffer.from(str, 'binary').toString('base64');

    // const baseString = encode(audioBuffer)
    // console.log(baseString)
   var newArray: any = [];
   var arrayBuffer: any = audioBuffer;

    for(var x = 0; x < arrayBuffer.length; x ++) {
      // newArray.push(ab2str(arrayBuffer[x])) //
      newArray.push(arrayBuffer[x].toString())
    }
    var newBuffer: any = [];
    var intArray: any =[];
    for(var i = 0; i < newArray.length; i ++) {

      var splitArray = newArray[i].split(",")
      for(var j = 0 ; j <  newArray[i].length; j++) {
        var num = parseInt(splitArray[j]);
        intArray.push(num)
      }
      var arr = new Int8Array(intArray);
      newBuffer.push(arr)
    }
    console.log(audioBuffer)
    console.log(newBuffer)

     var blob: any = new Blob(newBuffer, {
      type: "audio/ogg; codecs=opus"
    });
    console.log(blob)
    
    const player = new Audio(URL.createObjectURL(blob));
    player.play()
      .then(() => console.log("Playing"))
      .catch(err => console.log(err))
    // var int8Array: any = [];
    // for(var n = 0 ; n <  intArray.length; n++) {
    //   // console.log(intArray)
    //    var arr = new Int8Array(intArray);
    //    int8Array.push(arr)
    // }
    // console.log(int8Array);
  //  console.log(newBuffer);
  
    // var blob: any = new Blob(newBuffer, {
    //   type: "audio/ogg; codecs=opus"
    // });

    // const player = new Audio(URL.createObjectURL(blob));
    // player.play()

    // assignTrack(audioBuffer);
    setTrackForm({ name: ""});
    setForm(false);
}

const sendAudioData = (data: any) => {
  console.log(data);
  assignTrack(data);
}

  return (
    <div className="track-list-container">
    <div className="track-list-header">
      <p>Track Name</p>
      <p>Track Length</p>
      <p>Options</p>
    </div>
    <div className="track-list-scroll">
      <div className="track-container">
        <div className="track-details">
          <p className="track-name">Track One</p>
          <p className="track-date">Feb 1, 2019 at 4:23 PM</p>
        </div>
        {/* <div className="track-scrub">
          <div className="scrub"></div>
          <p className="track-time">3:46</p>
        </div> */}
        <div className="track-options">
          <button className="track-favourite">
            <img src="/assets/icons/workspace/favourite.svg" alt="Favourite the track"/>
          </button>
          <button className="track-delete">
            <img src="/assets/icons/workspace/delete.svg" alt="Delete the track"/>
          </button>
        </div>
      </div>
      { tracks && tracks.length > 1 ? tracks.map((track) => 
      { return track.url !== "" &&  (
      <li key={track.url}className="track-container">
      <button className="play-audio" onClick={() => sendAudioData(track)}>  </button>
        <div className="track-details">
          <p className="track-name">{track.name}</p>
          <p className="track-date">{track.created}</p>
        </div>
        {/* <div className="track-scrub">
          <div className="scrub"></div>
          <p className="track-time">3:46</p>
        </div> */}
        <div className="track-options">
          <button className="track-favourite">
            <img src="/assets/icons/workspace/favourite.svg" alt="Favourite the track"/>
          </button>
          <button className="track-delete">
            <img src="/assets/icons/workspace/delete.svg" alt="Delete the track"/>
          </button>
        </div>
        <audio controls>
          <source src={track.url} type="audio/mp3" />
        </audio>
    </li> )
    }
      )  : null }
    </div> 
   <div className="recorder-container">
      <div className="center-wrapper">
        <button onClick={() =>  startRecording()} className="recording-btns" id="record">
          <img src="/assets/icons/workspace/record.svg" alt="Record"/>
        </button>
        {/* <button onClick={() => stopRecording()} className="recording-btns" id="stop">
          <img src="/assets/icons/workspace/stop.svg" alt="Stop Recording"/>
        </button> */}
          {/* <p>{ seconds < 10 ?  minutes + " : 0" + seconds : minutes + " : "+ seconds}</p> */}
      </div>
      {  initForm ===  true &&
    <div className="track-popup">
      <form onSubmit={(e) => onSubmit(e)}>
        <span>
          <label htmlFor="trackName">Name your track</label>
          <input type="text" name="name" id="trackName" value={trackForm.name} placeholder="Enter a track name." onChange={(e) => onChange(e)}/>
        </span>
        <input type="submit" value="Save Track"/>
      </form>
    </div>
    }
    </div>
  </div>
  )
}

export default connector(Tracks);