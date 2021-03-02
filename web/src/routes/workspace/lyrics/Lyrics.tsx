import React, { useState } from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import { GET_LYRICS } from "../../../graphql/queries";
// Redux
import { connect , ConnectedProps } from "react-redux";
// Components
import CreateLyrics from "./CreatLyrics";
import DeleteWSItem from "../DeleteWSItem";

interface ComponentProps {
  workspace: {
    lyrics: {
      create: boolean,
      delete: boolean,
      id: number
    }
  }
  project: {
    currentProject: string
  }
}

const mapState = (state : ComponentProps) => ({
  lyrics: state.workspace.lyrics,
  currentProject: state.project.currentProject
})

const mapDispatch = {
  initLyricCreation : (bool: boolean) => ({type: "INIT_AND_EXIT_LYRIC_CREATION", payload: bool}),
  initLyricDeletion : (bool: boolean) => ({type: "DELETE_LYRIC", payload: bool}),
  setLyricId : (id: number) => ({type: "SET_LYRIC_ID", payload: id})
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

function Lyrics({ initLyricCreation, initLyricDeletion, setLyricId , lyrics , currentProject}: Props) {
  const [currentLyric , setCurrentLyric] = useState(-1);
  const { data, loading } = useQuery(GET_LYRICS , {
    variables: {
      projectId: currentProject
    }
  });

  const setDelete = (id:number) => {
    console.log("Clicked")
    setCurrentLyric(id)
    initLyricDeletion(true);
  }
  
  return (
    <div className="lyrics-container">
    <div className="lyric-tab-header">
      <h5>Lyrics</h5>
      {/* <button className="add-btn" onClick={() => initLyricCreation(true)}>
        <img src="/assets/icons/workspace/add.svg" alt="Add Lyric"/>
      </button> */}
    </div>
    { 
    lyrics.create === true ?  <CreateLyrics />: null
    }
    <div className="lyric-tab-scroll-container">
      { !loading && data && data.lyrics && data.lyrics.length !== 0 ? data.lyrics.map((lyric:any)=> 
        <div className="lyric-tab-container" key={lyric.id}> 
          <div className="lyric-tab-top">
            <p>{lyric.option}</p>
            <div className="button-container">
              <button onClick={() => setDelete(lyric.id)}>
                <img src="/assets/icons/workspace/delete.svg" alt="Delete Lyric"/>
              </button>
              <button className="edit-btn">
                <img src="/assets/icons/workspace/edit.svg" alt="Edit Lyric"/>
              </button>
            </div> 
           
          </div>
          <div className="lyric-content">
            <p>{lyric.lyric}</p>
          </div>
      
               {lyrics.delete && currentLyric === lyric.id && <DeleteWSItem wsType="lyric" itemId={lyric.id}/>}
       </div>
      )
       : <li className="default-workspace">
       <p>Add a some lyrics</p>
       <button onClick={() => initLyricCreation(true)}>Create</button>
      </li>
    }
      </div>
  </div>
  )
}

export default connector(Lyrics);
