import React, { useState } from 'react'
// GraphQL 
import { useMutation } from "@apollo/client";
import { DELETE_LYRIC } from "../../../graphql/mutations";
import { GET_LYRICS } from "../../../graphql/queries";
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
  initLyricDeletion : (bool: boolean) => ({type: "INIT_LYRIC_DELETION", payload: bool}),
  setLyricId : (id: number) => ({type: "SET_LYRIC_ID", payload: id})
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const DeleteLyrics = ({initLyricDeletion, lyrics, currentProject, setLyricId}: Props) => {
  const [deleteLyric] = useMutation(DELETE_LYRIC);


  const deleteLyricById = async () => {
    const id = lyrics.id;
    await deleteLyric({
      variables: {
        projectId: currentProject,
        lyricId: id
      },
      update: (cache, { data: { deleteLyric } }) => {
        // const cacheLyrics: any = cache.readQuery({
        //   query: GET_LYRICS,
        //   variables : {
        //       projectId: currentProject
        //     },
        // });
        cache.writeQuery({
          query: GET_LYRICS,
          variables : {
            projectId: currentProject
          },
          data : {
            lyrics: deleteLyric
          }
        })
      } 
    })
  }
  const exitDeletionPanel = () => {
    initLyricDeletion(false)
    setLyricId(0);
  }

  return (
    <div className="delete-panel">
      Are you sure you want to delete this lyric?
      <div className="button-wrapper">
        <button className="delete-btn" onClick={() => deleteLyricById()}>Delete</button>
        <button onClick={() => exitDeletionPanel()}>Cancel</button>
      </div>
    </div>
  )
}

export default connector(DeleteLyrics);
