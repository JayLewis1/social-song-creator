import React, { Fragment } from 'react'

interface ComponentProps { 
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
  
const Information = ({ user } : ComponentProps) => {
    return (
      <Fragment>
        <div className="profile-top-wrapper">
        <div className="info-wrappers">
            <div className="profile-avatar">
            <img src={user.avatar} alt="User's Avatar"/>
            </div>
          <div className="name-dob">
              <div className="name-email-wrapper">
            <span>
                <p className="label">Full Name</p>
                <p className="profile-info">{user.firstName + " " + user.lastName}</p>
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

export default Information;