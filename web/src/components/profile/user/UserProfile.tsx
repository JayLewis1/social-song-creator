import React, { useState, useEffect, Fragment } from 'react'

import { withRouter, useLocation } from "react-router-dom";
 
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import { USER_BY_ID, MY_ACCOUNT, GET_MY_MATES } from "../../../graphql/queries";
import { SEND_NOTIFICATION,  REMOVE_MATE } from "../../../graphql/mutations";

// Redux
import { connect, ConnectedProps } from "react-redux";

import Information from "./components/Information"
import Posts from "./posts/Posts";

import Projects from "./projects/Projects";
import Mates from "../../mates/lists/Mates";


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
  
const ProfileByID = ({ history } : Props) => {
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
        <div className="user-profile-wrapper"> 
        {/* <div className="component-header">
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
        </div> */}
         {!loading && data && data.user &&
         <Fragment>
            <Information user={data.user}/>
            <ul className="profile-components-options">
                <li>
                    <button 
                    onClick={() => setDisplayOption("posts")} 
                    className={ display === "posts" ? "display-active" : "display-normal"}>Posts</button>
                </li>
                <li>
                    <button 
                    onClick={() => setDisplayOption("projects")}
                    className={ display === "projects" ? "display-active" : "display-normal"}>Projects</button>
                </li>
                <li>
                    <button  
                        className={ display === "mates" ? "display-active" : "display-normal"}
                        onClick={() => setDisplayOption("mates")}>Mates</button>
                </li>
            </ul> 
            <ul className="profile-display">
            { display === "posts" && <Posts />}
            { display === "projects" && <Projects />}
            { display === "mates" && <Mates userId={data.user.id} />}
            </ul>
        </Fragment>
        }
        </div>
        </div>
    );
}

export default withRouter(connector(ProfileByID));