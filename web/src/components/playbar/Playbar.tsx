import React, { useState, useEffect } from 'react'

import PropTypes from "prop-types";

// Redux
import { connect, ConnectedProps } from "react-redux";
const MicRecorder = require('mic-recorder-to-mp3');
interface RouteState {
  playbar: {
    status: boolean,
    data : any
  }
}

const mapState = (state: RouteState) => ({
  status: state.playbar.status,
  data: state.playbar.data
})

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux


const Playbar = ({status, data} : Props) => {
  const [audio, setAudio] = useState(false);
  // TODO : UseQuery to fetch buffer from graphql
  // using the track id passed from redux
  // Then create audio with that buffer and assign
  // the properties to the playbar 
  // For example : timings, buffer, play and stop, 
  //               track names, creator name

  useEffect(() => {
    if(data) {
      setAudio(true)
    }
  },[data])

  // if(audio === true) {
  //   const player = new Audio(data.url);
  //   player.play()
  // }

  const playAudio = () => {
    console.log("Playing Audio")

    // if(data) {
    //     const file = new File(data, 'trackTesting.mp3', {
    //       type: "audio/mp3"
    //     });
    //     const player = new Audio(URL.createObjectURL(file));
    //     player.play()
    //   }
  }
  return (
    <div className="playbar-container" style={status === true ? { height: "90px" } : { height: "0" } }>  
      <div className="playbar-wrapper">
        { data ? <div className="project-details">
          <p className="project-name">{data.name}</p>
        </div> : <div className="project-details"> 
        <p className="project-name">Track Name goes here</p> </div>}
      
        <div className="playbar-controls">
          <button id="playbar-play" onClick={() => playAudio()}>
            <img src="/assets/icons/playbar/play.svg" alt="Play Project"/>
          </button>
        </div>
        <div className="playbar-scrub">
          <p className="time-played">0:27</p>
          <div className="scrub"></div>
          <p className="time-played">-4:35</p>
        </div>
      </div>
    </div>
  )
}

export default connector(Playbar);