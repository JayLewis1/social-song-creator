import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useLocation } from "react-router-dom";
import axios from "axios";
import AudioPlayer from 'react-h5-audio-player';
// GraphQL 
import { useQuery } from "@apollo/client";
import { CURRENT_PROJECT } from "../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentState {
  playbar: {
    status: boolean,
    data :  {
      id: string,
      projectId: string,
      trackName: string
    }
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
  const [buffer, setBuffer] = useState("");
  const [trackDuration, setTrackDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentProjectId, setProjectId] = useState("")
  const { data: projectData , loading} = useQuery(CURRENT_PROJECT, {
    variables : {
      projectId : data.projectId
    }
  });
  const player = useRef(null);
  const location = useLocation()
  const path = location.pathname;
  const params = path.split("/");
  
  useEffect(() => {
    if(params[1] === "workspace"){
      setProjectId(params[2])
    }
    if(data.projectId) {
      setProjectId(data.projectId)

      axios.get(`http://localhost:4000/get/${data.projectId}/${data.id}`)
      .then((res) => {
        // Make binary buffer from the response data
        const file = Buffer.from(res.data.Body, 'binary')
        // Convert buffer into base64 
        const base64 = file.toString('base64');
        // Store base 64 in comonent state
        setBuffer(base64);
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        // always executed
      });  
    }
  },[data, buffer, params])

  const playAudio = () => {
    const audio = player.current as any;
    setTrackDuration(audio.audio.current.duration)
    // If player is paused then button calls play function else pause
    if(audio.audio.current.paused) {
      audio.audio.current.play();
    } else  {
      audio.audio.current.pause();
    }
  }
  return (
    <div className="playbar-container" style={status === true ? { height: "90px" } : { height: "0" } }>  
      <div className="playbar-wrapper">
      <div className="project-details">
          {
            !loading && projectData && projectData.currentProject && 
            <Fragment>
              <p className="track-name">{data && data.trackName ? data.trackName : projectData.currentProject.name}</p> 
              <p className="project-name">{projectData.currentProject.name}</p>
            </Fragment>
          }
      </div>
      <div className="controls-wrapper">
          <div className="playbar-controls">
          <button id="playbar-play" onClick={() => playAudio()} disabled={buffer === ""}>
            { isPlaying ?  
            <img src="/assets/icons/playbar/pause.svg" id="pause" alt="Pause"/> :  
            <img src="/assets/icons/playbar/play.svg" alt="Play"/>
            }           
            </button>
          </div>

          <div className="playbar-scrub">
          <AudioPlayer
            autoPlay
            autoPlayAfterSrcChange={false}
            src={`data:audio/wav;base64, ${buffer}`}
            onPlay={() => setIsPlaying(true)}
            ref={player}
            defaultCurrentTime="0:00"
            defaultDuration="0:00"
          />
          </div>
        </div>
      </div>
    </div>
  )
}

export default connector(Playbar);