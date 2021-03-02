import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { CURRENT_PROJECT, MY_ACCOUNT } from "../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
import Tabs from "./tabs/Tabs";
import Lyrics from "./lyrics/Lyrics";
import Tracks from './tracks/Tracks';
import Recording from "./tracks/Recording";
// ViewOnly
import TabsViewOnly from "./tabs/TabsViewOnly";
import LyricsViewOnly from "./lyrics/LyricsViewOnly";
import TracksViewOnly from "./tracks/TracksViewOnly";

interface ComponentProps {
  application : {
    location: string
  }
}

const mapState = (state: ComponentProps) => ({
  location: state.application.location
})

const mapDispatch = {
  setAppLocation: (location: string) => ({type: "SET_APP_LOCATION", payload: location}),
  storeProject: (projectId: string) => ({type: "STORE_PROJECT", payload: projectId}),
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),
  initTabCreation : (bool: boolean) => ({type: "INIT_AND_EXIT_TAB_CREATION", payload: bool}),
  initLyricCreation : (bool: boolean) => ({type: "INIT_AND_EXIT_LYRIC_CREATION", payload: bool}),
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const Workspace = ({setAppLocation, storeProject, intialiseProject, initTabCreation, initLyricCreation} : Props) => {
  const [component , setComponent] = useState([
    {name: "tracks",
     shown : true},
    {name : "lyrics",
    shown: true},
    {name: "tabs", 
    shown: false}
 ])
  const [isContributor, setIsContributor] = useState(false);
  const location = useLocation();
  const params = location.pathname.split('/');
  const projectId = params[2];
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);

  const { data , loading} = useQuery(CURRENT_PROJECT, {
    variables : {
      projectId : projectId
    }
  });

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }

  const [ windowSize, setWindowSize] = useState(getWindowDimensions())

  useEffect(() => {
    if(!loading && !meLoading && meData && meData.me) {
      for(let x = 0; x < data.currentProject.contributors.length; x++) {
        if(meData.me.id === data.currentProject.contributors[x]) {
          setIsContributor(true);
        }
      }
      console.log(isContributor);
    }

    function handleResize() {
      setWindowSize(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);

    storeProject(projectId);
    setAppLocation("workspace");
    intialiseProject(false);
    return () => {
      setAppLocation("");
      window.removeEventListener('resize', handleResize);

    }
  }, [data, projectId, loading, meLoading, meData, isContributor, intialiseProject, setAppLocation, storeProject])
  
  const assignComponentType = (option : string) => {
    let newArray = [...component];
    for(let x = 0; x < newArray.length; x ++) {
      if(newArray[x].name === option) {
        let index = newArray.indexOf(newArray[x]);
        let showComponent = {
          name: option,
          shown: true
        }
        newArray.splice(index, 1, showComponent)
        if(index === 2) {
        let hideComponent = {
            name: newArray[0].name,
            shown: false
        }
          newArray.splice(0, 1, hideComponent)
          setComponent(newArray);
        } else {
          let newIndex = index + 1;
      
          let hideComponent = {
              name: newArray[newIndex].name,
              shown: false
          }
            newArray.splice(newIndex, 1, hideComponent)
            setComponent(newArray);
        }
      }
    }
  }

  return (
    <div className="workspace-container">
        { isContributor ? 
          <Fragment>
  
            { windowSize.width > 1000 || component[0].shown === true ? <Tracks /> : null  }
            { windowSize.width > 1000 || component[1].shown === true ? <Lyrics /> : null }
            { windowSize.width > 1000 || component[2].shown === true ? <Tabs /> : null }

            <div className="recorder-container">
              <span className="create-btn-container">
              <Recording />
               {
                 windowSize.width > 1000 || component[1].shown === true ? <button className="create-btns" onClick={() => initLyricCreation(true)}>
                  <img src="/assets/icons/workspace/createLyric.svg" alt="Create Lyric"/>
                </button>  : null
               } 
                {
                  windowSize.width > 1000 || component[2].shown === true ?
                  <button className="create-btns" onClick={() =>   initTabCreation(true)}>
                    <img src="/assets/icons/workspace/createTab.svg" alt="Create Tab"/>
                  </button> : null
               }
          
              </span>

              <div className="repsonsive-ws-menu">
                <button 
                  onClick={() => assignComponentType("tracks")} 
                  className={component[0].shown === true ? "active-btn" : ""}
                  disabled={component[0].shown === true}>Tracks</button>
                <button 
                  onClick={() => assignComponentType("lyrics")} 
                  className={component[1].shown === true ? "active-btn" : ""}
                  disabled={component[1].shown === true}>Lyrics</button>
                <button 
                  onClick={() => assignComponentType("tabs")} 
                  className={component[2].shown === true ? "active-btn" : ""}
                  disabled={component[2].shown === true}>Tabs</button>
              </div>
            </div>
          </Fragment>
          :  <Fragment>
          <TracksViewOnly></TracksViewOnly>
          <LyricsViewOnly></LyricsViewOnly>
          <TabsViewOnly></TabsViewOnly>
        </Fragment>}
    </div>
  )
}

Workspace.propTypes = {
  setAppLocation : PropTypes.func.isRequired,
}

export default connector(Workspace);