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
    { name: "tracks",
      col: 1},
    {name : "lyrics",
    col: 2},
    {name: "tabs", 
    col: 3}
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

  useEffect(() => {
    if(!loading && !meLoading && meData && meData.me) {
      for(let x = 0; x < data.currentProject.contributors.length; x++) {
        if(meData.me.id === data.currentProject.contributors[x]) {
          setIsContributor(true);
        }
      }
      console.log(isContributor);
    }

    storeProject(projectId);
    setAppLocation("workspace");
    intialiseProject(false);
    return () => {
      setAppLocation("");
    }
  }, [data, projectId, loading, meLoading, meData, isContributor, intialiseProject, setAppLocation, storeProject])
  
  const changeComponent = (cType: string) => {
    type objectType = {
      name : string,
      col : number,
    }
    let typeObject : Array<objectType>;
    switch(cType) {
      case "tracks" :
        typeObject = [
          {
            name : "tracks",
            col : 1,
          },
          {
            name : "lyrics",
            col : component[1].col + 1
          },
          {
            name : "tabs",
            col : component[2].col + 1
          },
        ];
        break;
      case "lyrics" :
        typeObject = [
          {
            name : "tracks",
            col : component[0].col + 1
          },
          {
            name : "lyrics",
            col : 1
          },
          {
            name : "tabs",
            col : component[2].col + 1
          },
        ];
      break;
      case "tabs" :
        typeObject = [
          {
            name : "tracks",
            col : component[0].col + 1
          },
          {
            name : "lyrics",
            col : component[1].col + 1
          },
          {
            name : "tabs",
            col : 1,
          },
        ];
        break;
      default :
      typeObject = [
        {
          name : "tracks",
          col : 1,
        },
        {
          name : "lyrics",
          col : 2,
        },
        {
          name : "tabs",
          col : 3,
        },
      ];
    }
    setComponent(typeObject)
  }

  return (
    <div className="workspace-container">
        { isContributor ? 
          <Fragment>
            <span className={`col-${component[0].col}`} >
              <Tracks />
            </span>
            <span className={`col-${component[1].col}`}  >
              <Lyrics />
            </span>
            <span className={`col-${component[2].col}`} >
              <Tabs />
            </span>
            <div className="recorder-container">
              <span className="create-btn-container">
              <Recording />
              <button className="create-btns" id="create-lyrcis" onClick={() => initLyricCreation(true)}>
                <img src="/assets/icons/workspace/createLyric.svg" alt="Create Lyric"/>
              </button>
              <button className="create-btns" 
                  id="create-tabs"
                  onClick={() =>   initTabCreation(true)}>
                  <img src="/assets/icons/workspace/createTab.svg" alt="Create Tab"/>
              </button>      
              </span>
              <div className="repsonsive-ws-menu">
                <button 
                  onClick={() => changeComponent("tracks")} 
                  className={`active-${component[0].col}`}
                  >Tracks</button>
                <button 
                  onClick={() => changeComponent("lyrics")} 
                  className={`active-${component[1].col}`}
                  disabled={component[1].col === 1}
                 >Lyrics</button>
                <button 
                  onClick={() => changeComponent("tabs")} 
                  className={`active-${component[2].col}`}
                  disabled={component[2].col === 1}
                  >Tabs</button>
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