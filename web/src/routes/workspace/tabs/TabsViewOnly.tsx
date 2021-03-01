import React,  { useState, useEffect } from 'react'
import { v4 as uuid } from "uuid";

// GraphQL
import { useQuery } from "@apollo/client";
import { GET_TABS } from "../../../graphql/queries";
// Redux
import {connect, ConnectedProps } from "react-redux";

interface ComponentProps {
  project: {
    currentProject: string
  }
}

const mapState = (state : ComponentProps) => ({
  currentProject: state.project.currentProject,
})

const connector = connect(mapState);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux


const TabsViewOnly = ({currentProject}: Props) => {
  const { data, loading } = useQuery(GET_TABS, {
    variables: {
      projectId: currentProject
    }
  });

  return (
    <div className="tabs-container">
      <div className="lyric-tab-header">
          <h5>Tabs</h5>
        </div>
        <div className="lyric-tab-scroll-container">
          { !loading && data && data.tabs && data.tabs.length !== 0 ? data.tabs.map((tab :any) => 
             <li key={tab.id} className="tab-container">
             <div className="lyric-tab-top">
               <p>{tab.description}</p>
             </div>
             <div className="tab-grid">
               <div className="grid-lines">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
               </div>
                {  tab.tab.map((item: any) => 
                 <span key={uuid()}>
                    <p>{ item === -1 ? "" : item}</p>
                 </span> 
                )}
             </div>
         </li> ) : 
         <li className="default-workspace">
           <p>There are no tabs</p>
          </li>
         }
    </div>
    </div>
  )
}

export default connector(TabsViewOnly);
