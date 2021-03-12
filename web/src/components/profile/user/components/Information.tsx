import React, { Fragment, useState, useEffect } from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import {MY_ACCOUNT, VALIDATE_NOTIFICATION } from "../../../../graphql/queries";
 // Redux
import { connect, ConnectedProps } from "react-redux";

const mapDispatch = {
  toggleMatesOptions: (payload: boolean) => ({type: "MATES_OPTIONS", payload}),
  toggleMatesAdd: (payload: boolean) => ({type: "MATES_ADD", payload})
}

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & { 
      user: {
        id: number
        firstName: string
        lastName: string
        avatar: string
        dob: string
        bio: string
        instruments: string
      }
  }
  
const Information = ({ user,toggleMatesAdd , toggleMatesOptions} : Props) => {
  const [isMyMate,  setIsMyMate] = useState(false)
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);
  const { data: nData, loading: nLoading } = useQuery(VALIDATE_NOTIFICATION, { 
    variables : {
      senderId : meData.me.id,
      recipient: user.id,
      type: "request"
    }
  })
  useEffect(() => {
    if(!meLoading && meData) {
      for(let x = 0; x < meData.me.mates.length; x++) {
        if(user.id === meData.me.mates[x]) {
          setIsMyMate(true);
        }
      }
    }
  },[meLoading, meData, user, setIsMyMate])

 
  const addFriend = () => {
    toggleMatesAdd(true)
  }
  const openOptions = () => {
    toggleMatesOptions(true);
  }

    return (
      <Fragment>
        <div className="profile-top-wrapper">
        <div className="info-wrappers">
          <div className="left-wrapper">
            <div className="profile-avatar">
            <img src={user.avatar} alt="User's Avatar"/>
            </div>
            { isMyMate === true &&
            <button onClick={() => openOptions()} className="user-profile-options">
                <span className="btn-bg"></span>
            <img src="/assets/icons/post/options.svg" alt="Profile options"/>
          </button>  }
            { !nLoading && nData.validateNotification === true && isMyMate === false && 
              <button onClick={() => addFriend()} className="user-profile-btn req-sent" disabled>
            
              <p>Mate request sent</p></button> 
            }
            { !nLoading && nData.validateNotification !== true && isMyMate === false && 
              <button onClick={() => addFriend()} className="user-profile-btn">
              <span className="btn-bg"></span>
              <p>Add Mate</p></button> 
            }
          </div>
          <div className="name-dob">
              <div className="name-email-wrapper">
            <span>
                <p className="label">Full Name</p>
                <p className="profile-info user-name">{user.firstName + " " + user.lastName}</p>
            </span>
          </div>
          <span>
            <p className="label">Date of birth</p>
            <p className="profile-info">{user.dob}</p>
        </span>
        </div>
      </div>
      <div className="info-wrappers user-instruments"> 
        <span>
              <p className="label">Instruments</p>
            <p className="profile-info instruments">{user.instruments ? user.instruments: null}</p>
        </span>
      </div>
      </div>
        <div className="info-wrappers">
          <span>
            <p className="label">Bio</p>
              <p className="profile-info">{user.bio ? user.bio : null}</p>
          </span>
        </div> 
    </Fragment>
    );
}

export default connector(Information);