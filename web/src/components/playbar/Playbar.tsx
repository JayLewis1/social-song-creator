import React, { useState, useEffect } from 'react'
import axios from "axios";

// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentState {
  playbar: {
    status: boolean,
    data : any
  }
}

const mapState = (state: ComponentState) => ({
  status: state.playbar.status,
  data: state.playbar.data
})

const connector = connect(mapState)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux


const Playbar = ({status, data} : Props) => {
  const [audio, setAudio] = useState(false);
  const [buffer, setBuffer] = useState("");

  useEffect(() => {
    if(data.projectId) {
      setAudio(true)
      axios.get(`http://localhost:4000/get/${data.projectId}/${data.id}`)
      .then((res) => {
        const  file = Buffer.from(res.data.Body, 'binary')
        const base64 = file.toString('base64');
        var player = new Audio("data:audio/wav;base64," + base64);
        player.play()
        setBuffer(res.data.Body);
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function () {
        // always executed
      });  
    }
  },[data])

  const playAudio = () => {
    if(buffer !== "") {
      const  file = Buffer.from(buffer, 'binary')
      const base64 = file.toString('base64');
      var player = new Audio("data:audio/wav;base64," + base64);
    
      if(!player.paused) {
        player.pause();
      } else {
        player.play();
      }
    }
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