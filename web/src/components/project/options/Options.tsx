import React from 'react'
import { withRouter } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT, CURRENT_PROJECT } from "../../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components 
import Share from "../functions/Share";

interface ComponentProps {
  application : { 
    contributorsPanel: boolean
  }
  project : {
    deleteProject: boolean
    deleteId: string
    options: string
  }
}

const mapState = (state: ComponentProps) => ({
  deleteProject: state.project.deleteProject,
  deleteId : state.project.deleteId,
  options: state.project.options,
  contributorsPanel: state.application.contributorsPanel
})
type resultData =  {
  toggle: boolean
  type: string
  selectedId: string
}

const mapDispatch = {
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
  assignTrack : (payload: object) => ({type: "ASSIGN_TRACK", payload: payload}),
  setSelectedProject: (id: string) => ({ type: "SELECTED_PROJECT_ID", payload: id}),
  toggleContributors : (payload: boolean) => ({type: "TOGGLE__CONTRIBUTORS", payload: payload}),
  toggleOptions: (projectId: string) => ({type: "PROJECT_OPTIONS", payload: projectId}),
  toggleProjectResult: (payload: resultData) => ({type: "PROJECT_RESULT", payload}) 
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux &  {
  history: any
};
const Options = ({ options, toggleOptions, toggleProjectResult, setSelectedProject, toggleContributors} : Props) => {
  const { data, loading } = useQuery(CURRENT_PROJECT, {
    variables: {
      projectId: options
    }
  });
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT)

  const setDeleteProject = () => {
    setSelectedProject(options)
    const resultData = {
      toggle: true,
      type: "delete",
      selectedId: options
    }
    toggleProjectResult(resultData);
    toggleOptions("");
  }

  const removeAsContributor = () => {
    const resultData = {
      toggle: true,
      type: "remove",
      selectedId: options
    }
    toggleProjectResult(resultData);
    toggleOptions("");
  }

  const addContributorFunc = () => {
    toggleContributors(true)
    setSelectedProject(options)
    toggleOptions("");
  }
  return (
    <div className="options-container">
        <div className="options">
          { !loading && data && data.currentProject && data.currentProject.postId === null &&
            <Share projectId={data.currentProject.id} location="options"/>
          }
          <button className="add-btn" onClick={() => addContributorFunc()}>Edit Contributors</button>
          { !meLoading && !loading && meData.me.id === data.currentProject.creatorId ?
           <button className="delete-btn" onClick={() => setDeleteProject()}>Delete</button>
           :
           <button className="delete-btn" onClick={() => removeAsContributor()}>Remove as contributor</button>
           }
          <button onClick={() => toggleOptions("")}>Cancel</button>
        </div>  
    </div>
  )
}

export default withRouter(connector(Options));