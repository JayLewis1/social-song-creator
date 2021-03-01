import React, { useState } from 'react'
import { NavLink } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client"
import { MY_PROJECTS, MY_ACCOUNT } from "../../graphql/queries";
//  Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps  {
  application : {
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

 const Navigation = ({projectPanel,  intialiseProject} : Props) => {
   const [activeLink, setActiveLink] = useState("")
  const { data, loading } = useQuery(MY_PROJECTS);
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);

  const createProject = () => {
    if(projectPanel === false) {
      intialiseProject(true)
    } else {
      intialiseProject(false)
    }
  } 
  return (
    
    <div className="main-menu">
      <h4 className="menu-title">Menu</h4>
      <nav className="menu-navigation">
      <ul> 
            { !meLoading && meData && meData.me &&    
              <li>
                <NavLink exact activeClassName="navlink-active" to="/profile/me">
                <span className="menu-icons">
                  <img src={meData.me.avatar} alt="Profile Avatar" className="avatar"/>
                </span>
                <p className="profile-name">{meData.me.firstName + " " + meData.me.lastName}</p></NavLink></li>
           } 
            <li>
              <NavLink exact activeClassName="navlink-active" to="/feed">
              <span className="menu-icons">
               <img src="/assets/icons/menu/feed-bg.svg" alt="Feed"/>
              </span>
              <p>Feed</p>
              <div className="active-circle"></div> </NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="navlink-active" to="/discover">
              <span className="menu-icons">
               <img src="/assets/icons/menu/discover-bg.svg" alt="Discover"/>
              </span>
              <p>Discover</p>
              <div className="active-circle"></div> </NavLink>
            </li>
            <li>

              <NavLink exact activeClassName="navlink-active" to="/projects">
                <span className="menu-icons">
                  <img src="/assets/icons/menu/projects-bg.svg" alt="Project"/>
                </span>
                <p>Projects</p>
              <div className="active-circle"></div> </NavLink>
            </li>
            <li>
              <NavLink exact activeClassName="navlink-active" to="/mates">
              <span className="menu-icons">
                <img src="/assets/icons/menu/mates-bg.svg" alt="Mates"/>
              </span>
              <p>Mates</p>
              <div className="active-circle"></div> </NavLink>
              </li>
          </ul>
  
      </nav>
      <nav className="menu-projects">
        <ul>
          <li><p className="menu-projects-title">Projects</p></li>
          <li>
            <button 
              className="menu-create-project"
              onClick={() => createProject()}
              disabled={projectPanel === true}
              >
            <p>Create</p>
            <img src="/assets/icons/plus/plus-white.svg" alt="Create Project"/></button></li>

            { !loading && data && data.myProjects ? data.myProjects.map((project: any) => 
            <li key={project.id}><NavLink exact activeClassName="navlink-active" to={`/workspace/${project.id}`}>{project.name}</NavLink></li>) : null}
            
        </ul>
      </nav>
  </div>
  )
}

export default connector(Navigation);
