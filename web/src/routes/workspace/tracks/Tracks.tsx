import React, {useState} from 'react'
// GraphQL
import { useMutation, useQuery } from "@apollo/client"
import { GET_TRACKS, CURRENT_PROJECT } from "../../../graphql/queries";
import { ASSIGN_MAIN_TRACK_TO_PROJECT } from "../../../graphql/mutations"
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
// import Recording from "./Recording";
import DeleteWSItem from "../DeleteWSItem";

interface ComponentProps {
  playbar: {
    data : object
  }
  project: {
    currentProject: string
  }

  workspace: {
    tracks: {
      delete: boolean
    }
   }
}

const mapState = (state: ComponentProps) => ({
  data: state.playbar.data,
  currentProject: state.project.currentProject,
  tracks: state.workspace.tracks
})

const mapDispatch = {
  assignTrack: (data: any) => ({type: "ASSIGN_TRACK", payload: data }),
  initTrackDeletion: (payload: boolean) => ({ type: "DELETE_TRACK", payload: payload })
}
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const Tracks  = ({tracks, currentProject, assignTrack, initTrackDeletion} : Props) => {
  const [currentTrack ,setCurrentTrack] = useState("");
  const { data, loading } = useQuery(GET_TRACKS, {
    variables : {
      projectId: currentProject
    }
  });
  const { data: projectData, loading: projectLoading } = useQuery(CURRENT_PROJECT,
     { variables: {
      projectId: currentProject
     }})

  const [assignTrackToProject] = useMutation(ASSIGN_MAIN_TRACK_TO_PROJECT);

  const sendAudioData = (data: any) => {
    assignTrack(data);
  }

  const deleteTrackPanel = (id: string) => {
    setCurrentTrack(id);
    initTrackDeletion(true);
  }

  const favouriteTrack = (id: string ) => {
    assignTrackToProject({ variables : {
      projectId: currentProject,
      trackId: id
    }, update: (cache , { data: {assignTrackToProject} }) => {
        cache.writeQuery({
          query : CURRENT_PROJECT, 
          variables : {
            projectId: currentProject
        }, 
        data: {
          currentProject : assignTrackToProject
        }})
    }})
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
            <button className="track-favourite" onClick={() => favouriteTrack(track.id)}>
            {!projectLoading && projectData && projectData.currentProject.mainTrack === track.id ?  <img src="/assets/icons/workspace/favourited.svg" alt="The favourite track"/> :  <img src="/assets/icons/workspace/favourite.svg" alt="Favourite the track"/> }
             
            </button>
            <button className="track-delete" onClick={() => deleteTrackPanel(track.id)}>
              <img src="/assets/icons/workspace/delete.svg" alt="Delete the track"/>
            </button>
          </div>
          {tracks.delete && currentTrack === track.id && 
            <DeleteWSItem wsType="track" itemId={track.id}/>
          }
      </li> 
        ): 
        <li className="track-container">
          <p className="no-tracks-p">No tracks have been recorded within this project</p>
        </li> 
      }  
    </div> 
    {/* <Recording /> */}
  </div>
  )
}

export default connector(Tracks);