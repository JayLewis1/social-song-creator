import React, { Fragment, useState , useEffect} from 'react'

import { useLocation } from "react-router-dom";

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


const ComponentHeader = ({postPanel, projectPanel,  intialiseProject, closePostPanel} : Props) => {
  const [locationName , setLocationName] = useState("");

  const location = useLocation();

  useEffect(() => {
   const locationName = location.pathname.split("/")
   setLocationName(locationName[1])

  }, [location])
  
  const createPost = () => {
    if(postPanel === false) {
      closePostPanel(true)
    } else {
      closePostPanel(false)
    }
  }
  const createProject = () => {
    if(projectPanel === false) {
      intialiseProject(true)
    } else {
      intialiseProject(false)
    }
  } 

  return (
    <Fragment>
    <div className="component-header">
      <h3 className="feed-title">Your {locationName}</h3>
      <div className="create-buttons-container">
        <button onClick={() => createProject()}><img src="/assets/icons/create/project.svg" alt="Create Project"/></button>
        <button onClick={() => createPost()}><img src="/assets/icons/create/post.svg" alt="Create Post"/></button>
      </div>
    </div>
    </Fragment>
  )
}

export default connector(ComponentHeader);