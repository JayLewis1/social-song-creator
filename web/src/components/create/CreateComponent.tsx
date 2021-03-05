import React, { useEffect , useState} from 'react'
import { Link, useLocation } from "react-router-dom"
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT } from "../../graphql/queries";
// Redux 
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {
 application : {
   postPanel : boolean,
   projectPanel: boolean
 }
}

const mapState = (state: ComponentProps) => ({
  postPanel : state.application.postPanel,
  projectPanel: state.application.projectPanel
})

const mapDispatch = {
  closePostPanel : (payload: boolean) => ({ type: "CLOSE_POST_PANEL", payload: payload }),
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
const CreateComponent = ({projectPanel, postPanel ,closePostPanel , intialiseProject} : Props) => {
  
  const togglePostPanel = () => {
    if(postPanel === true) {
      closePostPanel(false)
    } else {
      closePostPanel(true)
    }
  }

  const toggleProjectPanel = () => {
    if(projectPanel === true) {
      intialiseProject(false)
    } else {
      intialiseProject(true)
    }
  }


  return (
    <div className="create-component">
      <button onClick={() => toggleProjectPanel()} className="create-project"> 
        <img src="/assets/icons/create/project-create.svg" alt="Create Project" />
        <p>Create Project</p>
      </button>

      <button onClick={() => togglePostPanel()}  className="create-post"> 
        <img src="/assets/icons/create/post-colour.svg" alt="Create Post" />
        <p>Create Post</p>
      </button>
    </div>
  )
}
export default connector(CreateComponent);