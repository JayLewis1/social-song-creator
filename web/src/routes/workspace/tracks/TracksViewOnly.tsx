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
const TracksViewOnly  = ({assignTrack} : Props) => {
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
      </div>
      { tracks && tracks.length > 1 ? tracks.map((track) => 
      { return track.url !== "" &&  (
      <li key={track.url}className="track-container">
      <button className="play-audio" onClick={() => sendAudioData(track)}>  </button>
        <div className="track-details">
          <p className="track-name">{track.name}</p>
          <p className="track-date">{track.created}</p>
        </div>
    </li> )
    }
      )  : null }
    </div> 
  </div>
  )
}

export default connector(TracksViewOnly);