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
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux

const Workspace = ({setAppLocation, storeProject, intialiseProject} : Props) => {
  const [component , setComponent] = useState("tracks")
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
      // window.removeEventListener('resize', updateWindowDimensions);
    }
  }, [data, projectId, loading, meLoading, meData, isContributor, intialiseProject, setAppLocation, storeProject])


  


  return (
    <div className="workspace-container">
      { isContributor ? 
        <Fragment>
          {windowSize.width < 1000 ? 
          <div className="workspace-reszized">
            <div className="workspace-resize-buttons"> 
              <button onClick={() => setComponent("tracks")}>Tracks</button>
              <button onClick={() => setComponent("lyrics")}>Lyrics</button>
              <button onClick={() => setComponent("tabs")}>Tabs</button>
            </div>
            {
              component === "tracks" && <Tracks></Tracks> 
            }
            {
              component === "lyrics" &&   <Lyrics></Lyrics>
            }
            {
              component === "tabs" &&   <Tabs></Tabs>
            }
          </div>: 
          <Fragment>
            <Tracks></Tracks>
            <Lyrics></Lyrics>
            <Tabs></Tabs>
          </Fragment>
          }
        </Fragment> :
             <Fragment>
             {windowSize.width < 1000 ? 
             <div className="workspace-reszized">
               <div className="workspace-resize-buttons"> 
                 <button onClick={() => setComponent("tracks")}>Tracks</button>
                 <button onClick={() => setComponent("lyrics")}>Lyrics</button>
                 <button onClick={() => setComponent("tabs")}>Tabs</button>
               </div>
               {
                 component === "tracks" && <TracksViewOnly></TracksViewOnly> 
               }
               {
                 component === "lyrics" &&   <LyricsViewOnly></LyricsViewOnly>
               }
               {
                 component === "tabs" &&   <TabsViewOnly></TabsViewOnly>
               }
             </div>: 
             <Fragment>
               <TracksViewOnly></TracksViewOnly>
               <LyricsViewOnly></LyricsViewOnly>
               <TabsViewOnly></TabsViewOnly>
             </Fragment>
             }
           </Fragment>
      }

    </div>
  )
}

Workspace.propTypes = {
  setAppLocation : PropTypes.func.isRequired,
}

export default connector(Workspace);