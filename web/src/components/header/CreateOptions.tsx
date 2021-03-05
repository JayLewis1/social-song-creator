import React from 'react'
// Redux
import {connect, ConnectedProps} from "react-redux";
interface ComponentProps {
  application:  {
    postPanel : boolean,
    projectPanel: boolean,
  },
}

const mapStateToProps = (state: ComponentProps) => ({
  postPanel : state.application.postPanel,
  projectPanel: state.application.projectPanel,
})

const mapDispatch = {
  closePostPanel : (payload: boolean) => ({ type: "CLOSE_POST_PANEL", payload: payload }),
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),

}

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const CreateOptions = ({postPanel , projectPanel, closePostPanel, intialiseProject } : Props) => {
  const createProject = () => {
    if(projectPanel === false) {
      intialiseProject(true)
    } else {
      intialiseProject(false)
    }
  } 
  const createPost = () => {
    if(postPanel === false) {
      closePostPanel(true)
    } else {
      closePostPanel(false)
    }
  }
  return (
    <div className="create-options">
      <button onClick={() => createProject()}>
      <img src="/assets/icons/menu/create-projects.svg" alt="Create Post"/>
        <p>New Project</p></button>
      <button onClick={() => createPost()}>
      <img src="/assets/icons/menu/post.svg" alt="Create Post"/>
        <p>New Post</p>
      </button>
    </div>
  )
}

export default connector(CreateOptions);
