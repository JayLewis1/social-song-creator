import React, { useState } from 'react'
// GraphQL 
import { useMutation } from "@apollo/client";
import { CREATE_LYRIC } from "../../../graphql/mutations";
import { GET_LYRICS } from "../../../graphql/queries";
// Redux 
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {
  project: {
    currentProject : string
  }
}

const mapState = (state : ComponentProps) => ({
  currentProject: state.project.currentProject
})

const mapDispatch = {
  initLyricCreation : (bool: boolean) => ({type: "INIT_AND_EXIT_LYRIC_CREATION", payload: bool}),
  createTabAndAddToProject: (lyricData: object) => ({type: "CREATE_LYRIC", payload: lyricData})
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const CreateLyric = ({initLyricCreation, createTabAndAddToProject, currentProject}: Props) => {
  const [formData, setFormData] = useState({  
    timestamp: 0,
    option: "Verse",
    lyric : ""});
  const [createLyric] = useMutation(CREATE_LYRIC);
  const setSection = (e: any) => {
      setFormData({...formData, option : e.target.value})
  }

  const onChange = (e: any) => {
    setFormData({...formData, [e.target.name] : e.target.value})
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const { option , lyric } = formData;
    
     await createLyric({
      variables: {
        projectId: currentProject,
        option,
        lyric
      },
      update: (cache, { data: { createLyric } }) => {
        const cacheLyrics: any = cache.readQuery({
          query: GET_LYRICS,
          variables : {
              projectId: currentProject
            },
        });
        const updateCache = [...cacheLyrics.lyrics, createLyric ];
        cache.writeQuery({
          query: GET_LYRICS,
          variables : {
            projectId: currentProject
          },
          data : {
            lyrics: updateCache
          }
        })
      } 
    })

    try {
      initLyricCreation(false);
      // Clear state
      setFormData({   
        timestamp: 0,
        option: "",
        lyric : ""});
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="create-container workspace-create">
      <span className="panel-top">
        <h4>Create Lyric</h4>
        <button onClick={() => initLyricCreation(false)} className="exit-btn">
          <img src="/assets/icons/plus/exit-dark.svg" alt="Exit panel"/>
        </button>
      </span>
      <form className="create-form" onSubmit={(e) => onSubmit(e)}>
       <div className="button-wrapper">
          <input 
            type="button" 
            className="form-btns" 
            value="Verse" 
            onClick={(e) => setSection(e)} 
            style={formData.option === "Verse" ? {backgroundColor: "#2767fa"} : {backgroundColor: "#3e424e"}}/>
          <input 
            type="button" 
            className="form-btns" 
            value="Chorus" 
            onClick={(e) => setSection(e)} 
            style={formData.option === "Chorus" ? {backgroundColor: "#2767fa"} : {backgroundColor: "#3e424e"}}/>
         <input 
            type="button" 
            className="form-btns" 
            value="Bridge" 
            onClick={(e) => setSection(e)} 
            style={formData.option === "Bridge" ? {backgroundColor: "#2767fa"} : {backgroundColor: "#3e424e"}}/>
          <input 
            type="button" 
            className="form-btns" 
            value="Intro" 
            onClick={(e) => setSection(e)} 
            style={formData.option === "Intro" ? {backgroundColor: "#2767fa"} : {backgroundColor: "#3e424e"}}/>
          <input 
            type="button" 
            className="form-btns" 
            value="Outro" 
            onClick={(e) => setSection(e)} 
            style={formData.option === "Outro" ? {backgroundColor: "#2767fa"} : {backgroundColor: "#3e424e"}}/>
          <input 
            type="button" 
            className="form-btns" 
            value="Solo" 
            onClick={(e) => setSection(e)} 
            style={formData.option === "Solo" ? {backgroundColor: "#2767fa"} : {backgroundColor: "#3e424e"}}/>
       </div>
       <span className="input-wrapper">
          <label htmlFor="lyric">Write some lyrics</label>
          <textarea 
            name="lyric" 
            id="lyric"
            placeholder="Enter lyrics here" 
            onChange={(e) => onChange(e)} value={formData.lyric} />
       </span>
       <input type="submit" className="create-submit" id="submit-lyric" value="Create Lyric" disabled={!formData.lyric}/>
      </form>
    </div>
  )
}

export default connector(CreateLyric);
