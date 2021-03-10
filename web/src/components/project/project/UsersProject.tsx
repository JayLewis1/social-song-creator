import React from 'react'
import { Link } from "react-router-dom";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
import ContributorPanel from "../contributors/ContributorPanel"
import ContributorAvatar from "../contributors/ContributorAvatar";
import FormatTimestamp from "../../formatTime/FormatTimestamp";
interface ComponentProps {
  application : { 
    contributorsPanel: boolean
  }
}

const mapState = (state: ComponentProps) => ({
  contributorsPanel: state.application.contributorsPanel,
})

const mapDispatch = {
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
  assignTrack : (payload: object) => ({type: "ASSIGN_TRACK", payload: payload})
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux &  {
  userId: number
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

const UserProject = ({ userId, project, contributorsPanel, activatePlaybar, assignTrack }:Props) => {
  const openPlaybarAndAssignTrackId = (trackId: string, projectId: string, projectName: string) => {
    activatePlaybar(true);
    const dataObject = {
      id: trackId,
      projectId,
      trackName: ""
    }
    assignTrack(dataObject)
  }

    return (
        <li className="project" key={project.id}>
           <span className="top">
              <span className="project-details">
                <span>
                <Link to={`/workspace/${project.id}`} className="project-name">{project.name}</Link>
                { userId !== project.creatorId &&
                   <Link to={`/profile/${project.creatorId}`} className="project-creator"> by <em>{project.creatorName}</em></Link>
                }
                </span>
                <FormatTimestamp timestamp={project.created} />
              </span>
              <span className="responsive-btns">
                <button className="post-buttons responsive-play"  onClick={() => openPlaybarAndAssignTrackId(project.mainTrack, project.id, project.name)}>
                  <img src="/assets/icons/post/play-blue.svg" alt="Play"/>
                </button>
              </span>
            </span>
            <div className="bottom">
              <span className="contributors">
                <ContributorAvatar projectId={project.id} />
              </span>  
            </div>
            {contributorsPanel === true && <ContributorPanel />}
        </li> 
    );
} 

export default connector(UserProject);

