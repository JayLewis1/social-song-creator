import React, { Fragment } from 'react'
import { Link , useLocation} from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import {USERS_PROJECTS} from "../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
import DeleteProject from "./DeleteProject";

interface ComponentProps {

}

const mapState = (state: ComponentProps) => ({

})

const mapDispatch = {
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux;

const UsersProjects = ({ activatePlaybar }:Props) => {
  const location: any = useLocation();
  const params = location.pathname.split("/")
  const userId = parseInt(params[2]);
  const { data, loading } = useQuery(USERS_PROJECTS, {
    variables : {
      userId : userId
    }
  });

  if(loading) {
    return <div>Loading...</div>
  }

  if(!loading && data) {
    console.log(data.usersProjects)
  }
  const openPlaybarAndAssignTrackId = () => {
    activatePlaybar(true);
  }
  
    return (
     <Fragment>
      {!loading && data && data.usersProjects.length !== 0  ?
      data.usersProjects.map((project: any) => 
        <li className="project" key={project.id}>
          <Link to={`/workspace/${project.id}`}> </Link>
            <span className="top">
              <span className="project-details">
                <p className="project-name">{project.name}</p>
                <p className="project-date">8 January 2020</p>
              </span>
              <span className="btn-wrapper">
                <button className="post-buttons" onClick={() => openPlaybarAndAssignTrackId()}>
                  <img src="/assets/icons/post/play.svg" alt="Play post"/>
                </button>
              </span>
            </span>
        </li> 
       ) : <div className="project"><p>User has no projects.</p></div> }
    </Fragment>
    );
}

export default connector(UsersProjects);