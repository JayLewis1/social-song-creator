import React, {useState, Fragment} from 'react'
import axios from "axios";
// GraphQL
import { useQuery, useMutation } from "@apollo/client"
import { MY_ACCOUNT, GET_TRACKS } from "../../../graphql/queries";
import { CREATE_TRACK, DELETE_TRACK } from "../../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";

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
const Recording  = ({currentProject} : Props) => {
  const [trackForm, setTrackForm] = useState({
    name: ""
  })
  const [initForm, setForm] = useState(false);
  const [audioBuffer, storeBuffer] = useState([]);
  const [loadingSave, setLoadingSave] = useState(false);
  const [recording, setRecording] = useState(false);
  const { data: meData } = useQuery(MY_ACCOUNT);
  const [ createTrack ] = useMutation(CREATE_TRACK);
  const [deleteTrack] = useMutation(DELETE_TRACK);
  //New instance
const recorder = new MicRecorder({
  bitRate: 128
});

// Start recording. Browser will request permission to use your microphone.
const startRecording = () => {
  if(counter === 0 || counter === undefined) {
      recorder.start().then(() => {
      }).catch((e: any) => {
        console.error(e);
      });
      return counter = 1;
  } else if(counter === 1) {
  // Stop recording
  recorder
  .stop()
  .getMp3().then(([buffer, blob]: any) => {
    // Store buffer in component state
    storeBuffer(buffer);
    // Open Form pop up
    setForm(true);
}).catch((err: any) => {
  alert('We could not retrieve your message');
  console.log(err);
});
return counter = 0;
  }
}

const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
  setTrackForm({...trackForm, [e.target.name] : e.target.value })
}

const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoadingSave(true);
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
  }, update : (cache , { data: { createTrack }}) => {
      const cacheTracks: any = cache.readQuery({
        query: GET_TRACKS,
        variables : {
            projectId: currentProject
          },
      });
      if(cacheTracks.tracks !== null) {
        let modifyCache = [...cacheTracks.tracks, createTrack]
        cache.writeQuery({
          query: GET_TRACKS,
          variables : {
              projectId: currentProject
            },
            data: {
              tracks : modifyCache
            }
        })
      }
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
        .then((_res: any) => {
          //handle success
          setLoadingSave(false);
          setTrackForm({ name: ""});
          setForm(false);
        })
        .catch(async (res: any) => {
          //handle error
          console.log(res);
          // If there is an error sending the file to S3
          // Remove the correlated track data with GraphQL
          await deleteTrack({
            variables: {
              projectId: currentProject,
              trackId: response.data.createTrack.id
            },
            update: (cache, { data: deleteTrack }) => {
              cache.writeQuery({
               query: GET_TRACKS, 
                variables : {
                  projectId : currentProject
                }, 
                data: {
                  tracks : deleteTrack
                }
              })
            }
          })
        });
    }
  } catch(err) {
    console.log(err)
  }
}
  return (
    <Fragment>
          <button onClick={() => startRecording()} className="create-btns" id="record">
          { recording ? <img src="/assets/icons/workspace/recording.svg" alt="Recording"/>:    
          <img src="/assets/icons/workspace/record.svg" alt="Record"/> }
        </button>
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
      {loadingSave ? <div className="loading-save">Loading...</div> : null }
      </Fragment>
  )
}

export default connector(Recording);