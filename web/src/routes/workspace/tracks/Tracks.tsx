import React, {useState, useEffect} from 'react'
import axios from "axios";
// GraphQL
import { useQuery, useMutation } from "@apollo/client"
import { MY_ACCOUNT, GET_TRACKS } from "../../../graphql/queries";
import { CREATE_TRACK } from "../../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";

// var ab2str = require('arraybuffer-to-string')
// var str2ab = require('string-to-arraybuffer')

const MicRecorder = require('mic-recorder-to-mp3');

interface ComponentProps {
  playbar: {
    data : object
  }
  project: {
    currentProject: string
  }
}

const mapState = (state: ComponentProps) => ({
  data: state.playbar.data,
  currentProject: state.project.currentProject
})

const mapDispatch = {
  assignTrack: (data: any) => ({type: "ASSIGN_TRACK", payload: data })
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

var counter: number;
// import RecorderComponent from "../RecorderComponent";
const Tracks  = ({assignTrack, currentProject} : Props) => {
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
  const { data: meData, loading:meLoading } = useQuery(MY_ACCOUNT);
  const { data, loading } = useQuery(GET_TRACKS, {
    variables : {
      projectId: currentProject
    }
  });
  const [ createTrack ] = useMutation(CREATE_TRACK);

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

const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Create Track name
  const trackName = trackForm.name;
  // Create New file
  const newAudioFile = new File(audioBuffer, trackName, {
    type: "audio/mp3",
    lastModified: Date.now(),
  });

  var newFormData = new FormData();
  newFormData.append("userId", meData.me.id);
  newFormData.append("users-audio", newAudioFile);
  newFormData.append("projectId", currentProject);

  const response = await createTrack({
    variables: {
      name: trackName,
      projectId: currentProject
  }})
  try {
    if(response.data.createTrack) {
      newFormData.append("trackId", response.data.createTrack.id);
      axios({
        method: "post",
        url: 'http://localhost:4000/upload',
        data: newFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response: any) {
          //handle success
          console.log(response);
        })
        .catch(function (response: any) {
          //handle error
          console.log(response);
        });
    }
  } catch(err) {
    console.log(err)
  }

  console.log(newAudioFile);
  // assignTrack(newFile);
  const date = Date.now();
  const newDate = new Date(date);
  const created = newDate.toDateString();
  
    // Create audio url with the new file
  // const audioUrl = URL.createObjectURL(newAudioFile);
  // const audioObject = {
  //   name: trackName,
  //   url: audioUrl,
  //   created
  // }
  // const player = new Audio(URL.createObjectURL(newAudioFile));
  // player.play()
  //     .then(() => console.log("Playing"))
  //     .catch(err => console.log(err))

    // Push to state
    // setTracks([...tracks, audioObject])

    setTrackForm({ name: ""});
    setForm(false);
}

const sendAudioData = (data: any) => {
  assignTrack(data);
}

  return (
    <div className="track-list-container">
    <div className="track-list-header">
      <p>Track Name</p>
      <br />
      <p>Options</p>
    </div>
    <div className="track-list-scroll">
      {
        !loading && data && data.tracks.length !== 0 ? data.tracks.map((track: any) =>
        <li key={track.id} className="track-container">
        <button className="play-audio" onClick={() => sendAudioData(track)}>  </button>
          <div className="track-details">
            <p className="track-name">{track.name}</p>
            <p className="track-date">{track.created}</p>
          </div>
          <div className="track-options">
            <button className="track-favourite">
              <img src="/assets/icons/workspace/favourite.svg" alt="Favourite the track"/>
            </button>
            <button className="track-delete">
              <img src="/assets/icons/workspace/delete.svg" alt="Delete the track"/>
            </button>
          </div>
      </li> 
        ): 
        <li className="track-container">
          <p>Record track</p>
          <button onClick={() =>  startRecording()} className="recording-btns" id="record">
            <img src="/assets/icons/workspace/record.svg" alt="Record"/>
          </button>
        </li> 
      }

      {/* <div className="track-container">
        <div className="track-details">
          <p className="track-name">Track One</p>
          <p className="track-date">Feb 1, 2019 at 4:23 PM</p>
        </div>
        <div className="track-options">
          <button className="track-favourite">
            <img src="/assets/icons/workspace/favourite.svg" alt="Favourite the track"/>
          </button>
          <button className="track-delete">
            <img src="/assets/icons/workspace/delete.svg" alt="Delete the track"/>
          </button>
        </div>
      </div> */}
      {/* { tracks && tracks.length > 1 ? tracks.map((track) => 
      { return track.url !== "" &&  (
      <li key={track.url}className="track-container">
      <button className="play-audio" onClick={() => sendAudioData(track)}>  </button>
        <div className="track-details">
          <p className="track-name">{track.name}</p>
          <p className="track-date">{track.created}</p>
        </div>
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
      )  : null } */}
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