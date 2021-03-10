import React, {useState, Fragment, useEffect} from 'react'
import { useLocation } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT, GET_NOTIFICATIONS, USER_BY_ID } from "../../graphql/queries";
// Redux
import {connect, ConnectedProps} from "react-redux";
// Components
import DropDown from "../navigation/DropDown";
import AccountOptions from "./AccountOptions";
import Notifications from "../notifications/Notifications";
import Search from "./Search";
import CreateOptions from './CreateOptions';

interface ComponentProps {
  application:  {
    location: string,
    settingsPanel: boolean,
    postPanel : boolean,
    projectPanel: boolean,
    notificationPanel : boolean,
    searchPanel: boolean,
    createPanel: boolean
  },
  user : {
    authenticated: boolean,
    user : {
      id: number
    }
  }
  LoggedIn: string,
  Guest: string
}

const mapStateToProps = (state: ComponentProps) => ({
  location : state.application.location,
  settingsPanel: state.application.settingsPanel,
  postPanel : state.application.postPanel,
  projectPanel: state.application.projectPanel,
  notificationPanel: state.application.notificationPanel,
  searchPanel: state.application.searchPanel,
  createPanel: state.application.createPanel,
  authenticated: state.user.authenticated,
  user: state.user.user,
})

const mapDispatch = {
  closeSettingsPanel : (payload: boolean) => ({ type: "CLOSE_SETTINGS_PANEL", payload: payload }),
  closePostPanel : (payload: boolean) => ({ type: "CLOSE_POST_PANEL", payload: payload }),
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),
  toggleNotifications : (payload: boolean) => ({ type: "TOGGLE__NOTIFICATIONS", payload: payload }),
  toggleSearch : (payload: boolean) => ({ type: "TOGGLE_SEARCH", payload: payload }),
  toggleCreatePanel: (payload: boolean) => ({type: "TOGGLE_CREATE_PANEL", payload: payload})
}

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const Header = ({location, createPanel, user, postPanel, projectPanel,settingsPanel, notificationPanel, searchPanel, toggleNotifications, closePostPanel, intialiseProject, closeSettingsPanel, toggleSearch, toggleCreatePanel} : Props) => {
  const [btnDetails, setBtnDetails] = useState("")
  const [unRead, setUnRead]= useState(0)
  const [toggleMenu, setToggleMenu] = useState(false);
  const [componentLocation, setComponentLocation] = useState("");
  const { loading, data } = useQuery(MY_ACCOUNT);
  const { loading: userLoading, data: userData } = useQuery(USER_BY_ID, {
    variables : {
      userId: user?.id
    }
  })
  const { loading: notifLoading, data: notifData } = useQuery(GET_NOTIFICATIONS);
  const routeLocation = useLocation();
  var pathname = routeLocation.pathname;

  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  const [ windowSize, setWindowSize] = useState(getWindowDimensions())

  useEffect(() => {
    if(pathname !== componentLocation) {
      setComponentLocation(pathname);
      setToggleMenu(false);
    }
    if(!notifLoading && notifData && notifData.notifications) {
      setUnRead(notifData.notifications.length)
      }       

      const handleResize = () => {
        setWindowSize(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);

  }, [user ,notifLoading, notifData, loading , data, pathname, componentLocation])


  if(loading) {
    return <div>Loading...</div>
  }
  
  const openOptionsMenu = () => {
    if(settingsPanel === false) {
      closeSettingsPanel(true);
    } else if(settingsPanel === true) {
      closeSettingsPanel(false);
    }
  }

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
  const openNotifications = () => {
    if(notificationPanel === false) {
      toggleNotifications(true)
    } else {
      toggleNotifications(false)
    }
  }

  const openSearchContainer = () => {
    if(searchPanel === false) { 
        toggleSearch(true)   
    } else {
      toggleSearch(false)   
    }
  }

  const openBurgerMenu = () => {
    console.log("Search Clicked");
    if(toggleMenu === true ) {
      setToggleMenu(false)
    } else {
      setToggleMenu(true)
    }
  }
  const openCreateMenu = () => {
    if(createPanel) {
      toggleCreatePanel(false)
    } else {
      toggleCreatePanel(true)
    }
  }
      return (
        <Fragment>
          <div className="app-header">
            <div className="header-wrapper">
              <div className="aligned-left">
                <h3 className="logo">Space</h3>
                <span id="left-btns" style={windowSize.width <= 1100 || location === "workspace" ?{display:"flex"} : {display:"none"} }>
                <span className="header-btn-wrapper">
                  <button
                    className="header-btns"
                    onClick={() => openSearchContainer()}
                    onMouseOver={() => setBtnDetails("Search")}
                    onMouseOut={() =>  setBtnDetails("")}>
                      <img src="/assets/icons/menu/search-btn.svg" alt="Search"/>
                      { btnDetails === "Search" && <div className="btn-info">
                    <p>{btnDetails}</p></div>}
                  </button>
                  </span>
                  <span className="header-btn-wrapper">
                  <button 
                    className="header-btns"
                    onClick={() => openBurgerMenu()}
                    onMouseOver={() => setBtnDetails("Menu")}
                    onMouseOut={() =>  setBtnDetails("")}>
                      <img src="/assets/icons/menu/burger.svg" alt="Open Menu"/>
                      { btnDetails === "Menu" && <div className="btn-info">
                      <p>{btnDetails}</p></div>}
                  </button>
                </span>
                </span>
                <span className="header-btn-wrapper">
                  <button
                    className="header-btns"
                    onClick={() => openSearchContainer()}
                    onMouseOver={() => setBtnDetails("Search")}
                    onMouseOut={() =>  setBtnDetails("")}
                    style={windowSize.width <= 1100 || location === "workspace" ?{display:"none"} : {display:"flex"}}>
                      <img src="/assets/icons/menu/search-btn.svg" alt="Search"/>
                      { btnDetails === "Search" && <div className="btn-info">
                    <p>{btnDetails}</p></div>}
                  </button>
                  </span>

              </div>
              <h3 className="logo-center">Space</h3>
              <div className="aligned-right">
              <span className="header-btn-wrapper"  id="create-project-btn" >
                <button 
                  className="header-btns" 
                  onClick={() => createProject()}
                  onMouseOver={() => setBtnDetails("Create Project")}
                  onMouseOut={() =>  setBtnDetails("")}>
                  <img src="/assets/icons/menu/create-projects.svg" alt="Create Project"/>
                  { btnDetails === "Create Project" && 
                  <div className="btn-info">
                     <p>{btnDetails}</p>
                  </div>}
                </button>
                </span>
                <span className="header-btn-wrapper"   id="create-post-btn" >
                <button 
                  className="header-btns" 
                  onClick={() => createPost()}
                  onMouseOver={() => setBtnDetails("Create Post")}
                  onMouseOut={() =>  setBtnDetails("")}>
                  <img src="/assets/icons/menu/post.svg" alt="Create Post"/>
                  { btnDetails === "Create Post" && <div className="btn-info">
                  <p>{btnDetails}</p></div>}
                </button>
                </span> 
                <span className="header-btn-wrapper"    id="notifcations-btn" >
                <button 
                  className="header-btns"        
                  onClick={() => openNotifications()}
                  onMouseOver={() => setBtnDetails("Notficiations")}
                  onMouseOut={() =>  setBtnDetails("")}>
                  <img src="/assets/icons/menu/notifications.svg" alt="Notifications"/>
                  {unRead !== 0 && <div className="unread-notifications">{unRead}</div>} 
                  { btnDetails === "Notficiations" && <div className="btn-info">
                    <p>{btnDetails}</p></div>}
                </button>  
                {notificationPanel === true ? <Notifications /> : null}
                </span>
                <span className="header-btn-wrapper"    id="create-btn" >
                <button 
                    className="header-btns" 
                    onClick={() => openCreateMenu()}
                    onMouseOver={() => setBtnDetails("Create")}
                    onMouseOut={() =>  setBtnDetails("")}>
                    <img src="/assets/icons/menu/create.svg" alt="Create Project"/>
                  { btnDetails === "Create" && <div className="btn-info">
                    <p>{btnDetails}</p></div>}
                </button>
                {createPanel && <CreateOptions />}
                </span>
                <span className="header-btn-wrapper"   id="settings-btn" >
                <button 
                    className="header-btns" 
                    onClick={() => openOptionsMenu()} 
                    onMouseOver={() => setBtnDetails("Options")}
                    onMouseOut={() =>  setBtnDetails("")}>
                  <img src="/assets/icons/menu/settings.svg" alt="settings"/>
                  { btnDetails === "Options" && <div className="btn-info">
                    <p>{btnDetails}</p></div>}
                </button>
                </span>
                { !loading && data && data.me && 
                  <img src={data.me.avatar} className="profile-avatar"  id="avatar"  alt="Profile Avatar"/>}
                {!loading && data && data.me === null && !userLoading && userData && userData.user  && <img src={userData.user.avatar} className="profile-avatar" alt="Profile Avatar"/>}
              </div>
              {settingsPanel === true  ? <AccountOptions/> : null}
              {searchPanel === true && <Search />}
            </div>
          </div>
            { toggleMenu === true && <DropDown></DropDown>}
       </Fragment>
      )}

export default connector(Header);
