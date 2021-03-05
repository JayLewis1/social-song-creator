import React from 'react'
import { useLocation } from "react-router-dom";
import axios from "axios";
// GraphQL 
import { useMutation } from "@apollo/client";
import { DELETE_TAB , DELETE_LYRIC, DELETE_TRACK} from "../../graphql/mutations";
import { GET_TABS, GET_LYRICS, GET_TRACKS} from "../../graphql/queries";
// Redux 
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {
  workspace: {
    lyrics :{
      delete: boolean,
      id: number
    }
  }
  project: {
    currentProject : string
  }
}

const mapState = (state : ComponentProps) => ({
  lyrics: state.workspace.lyrics,
  currentProject: state.project.currentProject
})

const mapDispatch = {
  initLyricDeletion : (bool: boolean) => ({type: "DELETE_LYRIC", payload: bool}),
  initTabDeletion : (bool: boolean) => ({type: "DELETE_TAB", payload: bool}),
  initTrackDeletion: (payload: boolean) => ({ type: "DELETE_TRACK", payload: payload }),
  setLyricId : (id: number) => ({type: "SET_LYRIC_ID", payload: id})
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  wsType: string,
  itemId: number | string
}

const DeleteWSItem = ({wsType, itemId, initTabDeletion, initLyricDeletion, initTrackDeletion}: Props) => {
  const [deleteTab] = useMutation(DELETE_TAB);
  const [deleteLyric] = useMutation(DELETE_LYRIC);
  const [deleteTrack] = useMutation(DELETE_TRACK);
  // Get project id from the route pathname
  const location = useLocation();
  const params = location.pathname.split("/");
  const projectId = params[2]
 
  const deleteItem = async () => {
    if(wsType === "track") {
      await deleteTrack({
        variables: {
          projectId,
          trackId: itemId
        },
        update: (cache, { data: deleteTrack }) => {
          console.log(deleteTrack);
          cache.writeQuery({
           query: GET_TRACKS, 
            variables : {
              projectId
            }, 
            data: {
              tracks : deleteTrack
            }
          })
        }
      })
      try {
        initTrackDeletion(false)
  
        const fileId: string = itemId.toString();
        console.log(fileId)
        var newFormData = new FormData();
        newFormData.append("fileId", fileId);
        newFormData.append("projectId", projectId);

        axios({
          method: "post",
          url: 'http://localhost:4000/removeItem',
          data: newFormData,
          headers: { "Content-Type": "multipart/form-data" },
        })
          .then((res: any) => {
            //handle success
            console.log(res);
          })
          .catch((res: any) => {
            //handle error
            console.log(res);
          });
      }catch(err) {
        console.log(err)
      }
    }
    if(wsType === "tab") {
      await deleteTab({
        variables: {
          projectId,
          tabId: itemId
        },
        update: (cache, { data: deleteTab }) => {
          console.log(deleteTab);
          cache.writeQuery({
           query: GET_TABS, 
            variables : {
              projectId
            }, 
            data: {
              tabs : deleteTab
            }
          })
        }
      })
      try {
        initTabDeletion(false)
      }catch(err) {
        console.log(err)
      }
    }
    if(wsType === "lyric"){
      await deleteLyric({
        variables: {
          projectId,
          lyricId: itemId
        },
        update: (cache, { data: { deleteLyric } }) => {
          cache.writeQuery({
            query: GET_LYRICS,
            variables : {
              projectId
            },
            data : {
              lyrics: deleteLyric
            }
          })
        } 
      })
    }
  }

  const exitDeletionPanel = () => {
    if(wsType === "track") {
      initTrackDeletion(false)
    }
    if(wsType === "tab") {
      initTabDeletion(false)
    }
    if(wsType === "lyric") {
      initLyricDeletion(false)
    }
  }

  return (
    <div className="delete-popup">
      <p>Are you sure you want to delete this {wsType}?</p>
      <div className="delete-buttons-wrappers">
        <button className="delete-btn" onClick={() => deleteItem()}>Delete</button>
        <button onClick={() => exitDeletionPanel()}>Cancel</button>
      </div>
    </div>
  )
}

export default connector(DeleteWSItem);
