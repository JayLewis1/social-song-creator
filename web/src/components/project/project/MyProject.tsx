import React from 'react'
import { Link } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT } from "../../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
import ContributorPanel from "../contributors/ContributorPanel"
import ContributorAvatar from "../contributors/ContributorAvatar";
import FormatTimestamp from "../../formatTime/FormatTimestamp";
import Options from "../options/Options";
import ResultComponent from "../components/ResultComponent";
import Share from "../functions/Share";

interface ComponentProps {
  application : { 
    contributorsPanel: boolean
  }
  project : {
    options: string
    result: {
      toggle: boolean,
      type: string,
      currentId: string
    }
  }
}

const mapState = (state: ComponentProps) => ({
  options: state.project.options,
  contributorsPanel: state.application.contributorsPanel,
  result: state.project.result
})

const mapDispatch = {
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
  assignTrack : (payload: object) => ({type: "ASSIGN_TRACK", payload: payload}),
  toggleOptions: (projectId: string) => ({type: "PROJECT_OPTIONS", payload: projectId}),
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux &  {
  project: {
    id: string
    name: string
    creatorId: number
    creatorName: string
    mainTrack: string
    created: string
    postId: number
    isPublic: boolean
  }
};

const MyProject = ({ project, contributorsPanel, options, result, activatePlaybar, assignTrack, toggleOptions }:Props) => {
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);


  const openPlaybarAndAssignTrackId = (trackId: string, projectId: string, projectName: string) => {
    activatePlaybar(true);
    const dataObject = {
      id: trackId,
      projectId,
      trackName: ""
    }
    assignTrack(dataObject)
  }

  const toggleOptionsMenu = (id: string) => {
    if(options === "") {
      toggleOptions(id)
    } else {
      toggleOptions("")
    }
  }

    return (
        <li className="project" key={project.id}>
           <span className="top">
              <span className="project-details">
                <span>
                <Link to={`/workspace/${project.id}`} className="project-name">{project.name}</Link>
                { !meLoading && meData && meData.me.id !== project.creatorId &&
                   <Link to={`/profile/${project.creatorId}`} className="project-creator"> by <em>{project.creatorName}</em></Link>
                }
                </span>
                <FormatTimestamp timestamp={project.created} />
              </span>
              <span className="responsive-btns">
                <button className="post-buttons responsive-play"  onClick={() => openPlaybarAndAssignTrackId(project.mainTrack, project.id, project.name)}>
                  <img src="/assets/icons/post/play-blue.svg" alt="Play"/>
                </button>
                { project.postId === null &&  
                <Share projectId={project.id} location="project"/>
                }
                <button className="post-buttons" onClick={() => toggleOptionsMenu(project.id)}>
                  <img src="/assets/icons/post/options.svg" alt="Project options"/>
                </button>
              </span>
            </span>
            <div className="bottom">
            {project.isPublic === true ? 
              <p className="public">Public</p> :
              <p className="private">Private</p>
            }
              <span className="contributors">
                <ContributorAvatar projectId={project.id} />
              </span>  
            </div>
            {contributorsPanel === true && <ContributorPanel />}
            { options !== "" && <Options/>}
            { result.toggle && <ResultComponent /> }
        </li> 
    );
} 

export default connector(MyProject);

