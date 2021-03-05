import React, { useState, useEffect } from 'react'

import { withRouter, useLocation } from "react-router-dom";
 
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import { USER_BY_ID, MY_ACCOUNT, GET_MY_MATES } from "../../graphql/queries";
import { SEND_NOTIFICATION,  REMOVE_MATE } from "../../graphql/mutations";

// Redux
import { connect, ConnectedProps } from "react-redux";


import UserPosts from "../post/UserPosts";
import UsersProjects from "../project/projects/UsersProjects";
import MatesComponent from "../mates/MatesComponent";

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
  
const UserProfile = ({ history } : Props) => {
    const location: any = useLocation();
    const params = location.pathname.split("/")
    const userId = parseInt(params[2]);
    const [sendNotfication] = useMutation(SEND_NOTIFICATION);
    const [removeMate] = useMutation(REMOVE_MATE);
    const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);
    const { data, loading } = useQuery(USER_BY_ID, {
        variables: {
            userId: userId,
        } 
    });
    const [addBtnDisabled, setBtnDisabled] = useState(false)
    const [notificationSent, setNotificationSent] = useState(false)
    const [myFriend, setMyFriend] = useState(false)
    const [clearMessage, setClearMessage] = useState(false)
    const [responseStatus, setResStatus] = useState("")
    const [display , setDisplayOption] = useState("posts");

    useEffect(() => {
        if(addBtnDisabled === true ||  notificationSent === true) {
            const timer = setTimeout(() => {
                setClearMessage(true)
              }, 5000);
              return () => clearTimeout(timer);
        }
        if(!loading && meData && meData.me) {
            for(var x = 0; x < meData.me.mates.length; x ++) {
                if(meData.me.mates[x] === userId){
                    setMyFriend(true);
                }
            }
        }
    }, [addBtnDisabled, loading, meData, userId, notificationSent])

    if(loading) {
        return <div>loading...</div>
    }

    const removeMateFunc = async (userId: number) => {
        console.log(userId);
        removeMate({
            variables: {
                mateId: userId
            }, 
            update: (cache , { data: removeMate }) => {
                cache.writeQuery({
                    query : GET_MY_MATES,
                    variables: meData.me.id,
                    data :  {
                        getMates: removeMate
                    }       
                })
            } 
        })
    } 

    const addMate = async (userId: number) => {
        setClearMessage(false)
       const response =  await sendNotfication({
            variables : {
                recipient: userId,
                type: "request",
                message: "wants to be your mate."
            }
        })
        try{
            if(response.data.sendNotfication.reqBlocked === true) {
                setResStatus(response.data.sendNotfication.status)
                setNotificationSent(false);
                setBtnDisabled(true);
            } else {
                setNotificationSent(true);
                setResStatus(response.data.sendNotfication.status)
            }
        } catch(err) {
            console.log(err);
        }
    }

    return (
    <div className="component-container">
        <div className="component-header">
        <h3 className="feed-title">{data.user.firstName + " " + data.user.lastName}</h3>
        { !meLoading && meData && meData.me.id === userId  ? null : myFriend === true ?
            <button 
                onClick={() => removeMateFunc(data.user.id)} className="remove-mate"
                disabled={addBtnDisabled === true}>
                <p>Remove mate</p>
            </button> :
             <button 
            onClick={() => addMate(data.user.id)} className="add-mate"
            disabled={addBtnDisabled === true}>
                <p>Add Mate</p>
                <img src="/assets/icons/profile/add.svg" alt="Add Mate"/>
        </button>}

        {clearMessage === false && addBtnDisabled === true &&
            <span className="res-status" style={ {backgroundColor: "#f8323b"} }>
                <div></div> 
                <p>{responseStatus}</p>
            </span>
        }
       { clearMessage === false && notificationSent === true &&
          <span className="res-status" style={ {backgroundColor: "2767fa", width: "200px"}}>
          <div></div> 
          <p>{responseStatus}</p>
      </span> }
        </div>
         {!loading && data && data.user &&
         <div className="user-profile-wrapper"> 
               <div className="profile-top-wrapper">
               <div className="info-wrappers">
                   <div className="profile-avatar">
                   <img src={data.user.avatar} alt="User's Avatar"/>
                   </div>
                 <div className="name-dob">
                     <div className="name-email-wrapper">
                    <span>
                        <p className="label">Full Name</p>
                        <p className="profile-info">{data.user.firstName + " " + data.user.lastName}</p>
                    </span>
                 </div>
                 <span>
                    <p className="label">Date of birth</p>
                    <p className="profile-info">{data.user.dob}</p>
                </span>
                </div>
             </div>
             <div className="info-wrappers user-instruments"> 
                <span>
                     <p className="label">Instruments</p>
                    <p className="profile-info instruments">{data.user.instruments ? data.user.instruments: null}</p>
                </span>
             </div>
             </div>
                <div className="info-wrappers">
                 <span>
                    <p className="label">Bio</p>
                     <p className="profile-info">{data.user.bio ? data.user.bio : null}</p>
                 </span>
                </div>    

            <ul className="profile-components-options">
                <li><button 
                    onClick={() => setDisplayOption("posts")} 
                style={ display === "posts" ? { backgroundColor: " #2767fa", color: "white"} : { backgroundColor: "white", color: " #2767fa"}}>Posts</button></li>
                <li><button 
                    onClick={() => setDisplayOption("projects")}
                    style={ display === "projects" ? { backgroundColor: " #2767fa", color: "white"} : { backgroundColor: "white", color: " #2767fa"}} >Projects</button></li>
                <li><button style={ display === "mates" ? { backgroundColor: " #2767fa", color: "white"} : { backgroundColor: "white", color: " #2767fa"}} onClick={() => setDisplayOption("mates")}>Mates</button></li>
            </ul> 
            <ul className="profile-display">
            { display === "posts" && <UserPosts />}
            { display === "projects" && <UsersProjects />}
            { display === "mates" && <MatesComponent userId={data.user.id} />}
            </ul>
        </div> }
        </div>
    );
}

export default withRouter(connector(UserProfile));