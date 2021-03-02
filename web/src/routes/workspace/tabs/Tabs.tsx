import React,  { useState, useEffect } from 'react'
import { v4 as uuid } from "uuid";

// GraphQL
import { useQuery } from "@apollo/client";
import { GET_TABS } from "../../../graphql/queries";
// Redux
import {connect, ConnectedProps } from "react-redux";
// Components
import CreateTabs from "./CreateTabs";
import DeleteWSItem from "../DeleteWSItem";
interface ComponentProps {
  workspace: {
   tabs: {
     create: boolean,
     delete: boolean
   }
  }
  project: {
    currentProject: string
  }
}

const mapState = (state : ComponentProps) => ({
  currentProject: state.project.currentProject,
  tabs: state.workspace.tabs
})

const mapDispatch = {
  initTabCreation : (bool: boolean) => ({type: "INIT_AND_EXIT_TAB_CREATION", payload: bool}),
  initTabDeletion : (bool: boolean) => ({type: "DELETE_TAB", payload: bool}),
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux


const Tabs = ({initTabCreation, initTabDeletion, currentProject, tabs}: Props) => {
  const [currentTab ,setCurrentTab] = useState(-1);
  const { data, loading } = useQuery(GET_TABS, {
    variables: {
      projectId: currentProject
    }
  });

  const createTabPanel = () => {
    initTabCreation(true)
  }
  const deleteTabPanel = (id: number) => {
    setCurrentTab(id);
    initTabDeletion(true);
  }

  return (
    <div className="tabs-container">
      <div className="lyric-tab-header">
          <h5>Tabs</h5>
          {/* <button className="add-btn" onClick={() => createTabPanel()}>
            <img src="/assets/icons/workspace/add.svg" alt="Add Lyric"/>
          </button> */}
        </div>
      {  tabs.create === true ? <CreateTabs></CreateTabs> : null}
        <div className="lyric-tab-scroll-container">
          { !loading && data && data.tabs && data.tabs.length !== 0 ? data.tabs.map((tab :any) => 
             <li key={tab.id} className="tab-container">
             <div className="lyric-tab-top">
               <p>{tab.description}</p>
               <div className="button-container">
                 <button  onClick={() => deleteTabPanel(tab.id)}>
                   <img src="/assets/icons/workspace/delete.svg" alt="Delete Lyric"/>
                 </button>
                 <button className="edit-btn">
                   <img src="/assets/icons/workspace/edit.svg" alt="Edit Lyric"/>
                 </button>
               </div>
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
             {tabs.delete && currentTab === tab.id && <DeleteWSItem wsType="tab" itemId={tab.id}/>}
         </li> ) : 
         <li className="default-workspace">
           <p>Add a tab</p>
           <button onClick={() => initTabCreation(true)}>Create</button>
          </li>
         }
    </div>
    </div>
  )
}

export default connector(Tabs);
