import React, { useState } from 'react'

import { withRouter } from "react-router-dom";

// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT } from "../../graphql/queries";

// Redux
import { connect, ConnectedProps } from "react-redux";

import NameDob from "./edit/NameDob";
import Bio from "./edit/Bio";
import Instruments from "./edit/Instruments";

import ComponentHeader from "../../components/ComponentHeader";
import MyPosts from "../../components/post/MyPosts";
import MyProjects from "../../components/project/MyProjects";
// import MyMates from "./mates/MyMates";
import MatesComponent from "../../components/mates/MatesComponent";

interface ComponentProps {  
    profile: {
      update: boolean
      editting: {
        names : boolean
        bio: boolean
        instruments: boolean
      }
    }
  }
  
  const mapState = (state: ComponentProps) => ({
    update: state.profile.update,
    edittingNames : state.profile.editting.names,
    edditingBio: state.profile.editting.bio,
    edditingInstruments: state.profile.editting.instruments,
  })
  
  const mapDispatch = {
    updateProfile: (payload: boolean) => ({ type: "UPDATE_PROFILE", payload: payload}),
    editNames: (payload: boolean) => ({type: "EDIT_NAME", payload: payload}),
    editBio: (payload: boolean) => ({type: "EDIT_BIO", payload: payload}),
    editInstrument: (payload: boolean) => ({type: "EDIT_INSTRUMENT", payload: payload}),
  }
  
  const connector = connect(mapState,mapDispatch);
  
  type PropsFromRedux = ConnectedProps<typeof connector>;
  type Props = PropsFromRedux & {
      history : any
  }
  
const Profile = ({
    updateProfile, 
    update, 
    history, 
    editNames, 
    editBio,
    editInstrument,
    edittingNames,
    edditingBio,
    edditingInstruments,} : Props) => {
    // const { data, loading } = useQuery(MY_PROFILE);
    const { data, loading } = useQuery(MY_ACCOUNT);
    const [display , setDisplayOption] = useState("posts");

    if(loading) {
        return <div>loading...</div>
    }

    return (
    <div className="component-container">
        {/* <ComponentHeader /> */}
         {!loading && data && data.me &&
         <div className="profile-wrapper">
             {edittingNames === true ?  <NameDob/> : 
               <div className="info-wrappers">
                   <div className="my-profile-avatar">
                       <img src={data.me.avatar} alt="Users Avatar"/>
                   </div>
                 <div className="name-dob-wrapper">
                    <span>
                        <p className="label">Full Name</p>
                        <p className="profile-info">{data.me.firstName + " " + data.me.lastName}</p>
                    </span>
                    <span>
                        <p className="label">Date of birth</p>
                        <p className="profile-info">{data.me.dob}</p>
                    </span>
                 </div>
                    {/* <span>
                        <p className="label">Date of birth</p>
                        <p className="profile-info">{data.me.dob}</p>
                    </span> */}
                <span className="email-container">
                        <p className="label">Email</p>
                        <p className="profile-info">{data.me.email}</p> 
                    </span>
                 <button className="edit-profile" onClick={() =>  editNames(true)}>
                        <img src="/assets/icons/post/edit-green.svg" alt="Edit"/>
                    </button>
             </div>}
             {edditingBio === true ?  <Bio/> : 
                <div className="info-wrappers">
                 <span>
                    <p className="label">Bio</p>
                     <p className="profile-info">{data.me.bio ? data.me.bio : null}</p>
                 </span>
                 <button className="edit-profile" onClick={() => editBio(true)}>
                     <img src="/assets/icons/post/edit-green.svg" alt="Edit"/>
                 </button>
                </div>
                } 
            {edditingInstruments === true ?  <Instruments/> :       
             <div className="info-wrappers"> 
                <span>
                     <p className="label">Instruments</p>
                    <p className="profile-info instruments">{data.me.instruments ? data.me.instruments: null}</p>
                </span>
                <button className="edit-profile" onClick={() => editInstrument(true)}>
                     <img src="/assets/icons/post/edit-green.svg" alt="Edit"/>
                 </button>
             </div>
            } 
            <ul className="profile-components-options">
                <li><button 
                    onClick={() => setDisplayOption("posts")} 
                style={ display === "posts" ? { backgroundColor: " #2767fa", color: "white"} : { backgroundColor: "white", color: " #2767fa"}}>
                    My Posts</button></li>
                <li><button 
                    onClick={() => setDisplayOption("projects")}
                    style={ display === "projects" ? { backgroundColor: " #2767fa", color: "white"} : { backgroundColor: "white", color: " #2767fa"}} >My Projects</button></li>
                <li><button style={ display === "mates" ? { backgroundColor: " #2767fa", color: "white"} : { backgroundColor: "white", color: " #2767fa"}} onClick={() => setDisplayOption("mates")}>My Mates</button></li>
            </ul> 
            <ul className="profile-display">
            { display === "posts" && <MyPosts />}
            { display === "projects" && <MyProjects />}
            { display === "mates" && <MatesComponent userId={!loading && data && data.me && data.me.id} />}
            </ul>
        </div> }
        </div>
    );
}

export default withRouter(connector(Profile));