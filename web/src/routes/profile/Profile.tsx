import React, { useState, Fragment } from 'react'

import { withRouter } from "react-router-dom";

// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT } from "../../graphql/queries";

// Redux
import { connect, ConnectedProps } from "react-redux";

import NameDob from "./edit/NameDob";
import Bio from "./edit/Bio";
import Instruments from "./edit/Instruments";

import Posts from "../../components/profile/me/Posts";
import MyProjects from "../../components/project/lists/MyProjects";
import Mates from "../../components/mates/lists/Mates";

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

    const onChange = (e:React.ChangeEvent<HTMLSelectElement> ) => {
        setDisplayOption(e.target.value);
    }
    return (
    <div className="component-container">
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
                        <p className="profile-info capitalize">{data.me.firstName + " " + data.me.lastName}</p>
                    </span>
                    <span>
                        <p className="label">Date of birth</p>
                        <p className="profile-info">{data.me.dob}</p>
                    </span>
                 </div>
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
                    {data.me.bio ?
                        <Fragment>
                            <span>
                                <p className="label">Bio</p>
                                <p className="profile-info">{data.me.bio}</p>
                            </span>
                            <button className="edit-profile" onClick={() => editBio(true)}>
                                <img src="/assets/icons/post/edit-green.svg" alt="Edit"/>
                            </button>
                        </Fragment>
                       : 
                        <span className="empty-state-wrapper">
                            <p className="label">Why not add a bio?</p>
                            <button className="add-info-btn" onClick={() => editBio(true)}>
                                Add bio
                            </button>
                        </span> }
                </div>
                } 
            {edditingInstruments === true ?  <Instruments/> :       
             <div className="info-wrappers"> 
             { data.me.instruments ? 
                <Fragment>
                    <span>
                        <p className="label">Instruments</p>
                        <p className="profile-info instruments">{data.me.instruments}</p>
                    </span>
                    <button className="edit-profile" onClick={() => editInstrument(true)}>
                        <img src="/assets/icons/post/edit-green.svg" alt="Edit"/>
                    </button>
                </Fragment>
                 :
                  <span className="empty-state-wrapper">
                            <p className="label">Why not show what instruments you play?</p>
                            <button className="add-info-btn" onClick={() => editInstrument(true)}>Add Instruments</button>
                        </span> 
                    }
                </div> 
            } 
            <ul className="profile-components-options">
                <li><button 
                    onClick={() => setDisplayOption("posts")} 
                    className={display === "posts" ? "active-btn" : "component-btn"}>
                    Posts</button></li>
                <li><button 
                    onClick={() => setDisplayOption("projects")}
                    className={display === "projects" ? "active-btn" : "component-btn"}
                     >Projects</button></li>
                <li><button className={display === "mates" ? "active-btn" : "component-btn"} onClick={() => setDisplayOption("mates")}>Mates</button></li>
                <select value={display} onChange={(e) => onChange(e)}>
                    <option value="posts">Posts</option>
                    <option value="projects">Projects</option>
                    <option value="mates">Mates</option>
                </select>
            </ul> 
            <ul className="profile-display">
            { display === "posts" && <Posts />}
            { display === "projects" && <MyProjects />}
            { display === "mates" && <Mates userId={!loading && data && data.me && data.me.id} />}
            </ul>
        </div> }
        </div>
    );
}

export default withRouter(connector(Profile));