import React , { Fragment, useState } from 'react'
import { NavLink } from "react-router-dom";

import { connect, ConnectedProps } from "react-redux";

import { useQuery } from "@apollo/client";
import { MY_PROJECTS, MY_ACCOUNT } from "../../graphql/queries";
 
interface ComponentProps {
  application: {
    projectPanel: boolean
  }
}

const mapState = (state: ComponentProps) => ({
  projectPanel: state.application.projectPanel
})

const mapDispatch = {
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux


const DropDown = ({projectPanel, intialiseProject} : Props) => {
  const { data, loading } = useQuery(MY_PROJECTS); 
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT); 

  const toggleCreatePanel = () => {
    if(projectPanel === false) {
      intialiseProject(true)
    } else {
      intialiseProject(false)
    }
  }
  return (
      <div 
        className="drop-down-wrapper">
      <div className="main-menu">
        <nav className="menu-navigation">
          <ul> 
            { !meLoading && meData && meData.me &&    
              <li>

                <NavLink exact activeClassName="navlink-active" to="/profile/me">
                <span className="menu-icons">
                  <img src={meData.me.avatar} alt="Profile Avatar" className="avatar"/>
                </span>
                  <p>{meData.me.firstName + " " + meData.me.lastName}</p></NavLink></li>
           } 
            <li>
              <NavLink exact activeClassName="navlink-active" to="/feed">
              <span className="menu-icons">
               <img src="/assets/icons/menu/feed.svg" alt="Feed"/>
              </span>
              <p>Feed</p>
             </NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="navlink-active" to="/discover">
              <span className="menu-icons">
               <img src="/assets/icons/menu/discover.svg" alt="Discover"/>
              </span>
              <p>Discover</p>
             </NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="navlink-active" to="/projects">
              <span className="menu-icons">
                <img src="/assets/icons/menu/projects.svg" alt="Project"/>
              </span>
              <p>Projects</p>
            </NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="navlink-active" to="/mates">
              <span className="menu-icons">
                <img src="/assets/icons/menu/mates.svg" alt="Mates"/>
              </span>
              <p>Mates</p>
              </NavLink>
              </li>
          </ul>
        </nav>
        <nav className="menu-projects">
          <ul>
            <li className="menu-projects-title"><p>Projects</p></li>
            <li className="menu-create">
              <button 
                className="menu-create-project"
                onClick={() => toggleCreatePanel()}
                >
                  <div className="btn-bg"></div>
                  <p>Create</p> 
                  <img className="icon-white" src="/assets/icons/create/plus-white.svg" alt="Create Project"/>
                  <img className="icon-blue" src="/assets/icons/create/plus-blue.svg" alt="Create Project"/>
                  </button></li>
                  <ul className="project-names">
                  { !loading && data && data.myProjects ? data.myProjects.map((project: any) => 
            <li key={project.id}><NavLink exact activeClassName="navlink-active" to={`/workspace/${project.id}`}>{project.name}</NavLink></li>) : null}
                  </ul>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default connector(DropDown);
