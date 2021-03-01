import React, {useEffect, useState, Fragment} from 'react'
import { useLocation , Link, withRouter} from "react-router-dom";
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import {GET_NOTIFICATIONS, GET_MY_MATES, MY_ACCOUNT} from "../../graphql/queries";
import { ADD_MATE , DELETE_NOTIFICATION} from "../../graphql/mutations";
// Redux
import {connect, ConnectedProps} from "react-redux";


interface ComponentProps {
  application: {
    notificationPanel : boolean
  }
}

const mapStateToProps = (state: ComponentProps) => ({
  notificationPanel: state.application.notificationPanel
})

const mapDispatch = {
  toggleNotifications : (payload: boolean) => ({ type: "TOGGLE__NOTIFICATIONS", payload: payload }),
}

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  history: any
}

const Notifications = ({toggleNotifications, notificationPanel, history} : Props) => {
  const [oldLocation , setLocation] = useState("")
  const { loading, data } = useQuery(GET_NOTIFICATIONS);
  const { loading: meLoading, data: meData } = useQuery(MY_ACCOUNT);

  const [addMate] = useMutation(ADD_MATE);
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION);

  var location = useLocation();
  var pathName = location.pathname

 useEffect(() => {
    if(oldLocation !== "" &&  pathName !== oldLocation) {
      toggleNotifications(false)
      setLocation(pathName)
    } else {
      setLocation(pathName)
    }
  }, [pathName, oldLocation, toggleNotifications])


  if(!loading && data){
    console.log(data);
  }
  const acceptMateRequest = async (userId: number , notificationId: number) => {
    console.log(userId);
    await addMate({
      variables: {
        mateId: userId
      },
      update: (cache, { data: { addMate } }) => {
        cache.writeQuery({
          query: GET_MY_MATES, 
          variables : {
          userId: meData.me.id
          }, 
          data: {
            getMates: addMate
          } 
      })
      }
    })
    try{
        await deleteNotification({
        variables: {
          id: notificationId 
        },
        update: (cache , {data: {deleteNotification} }) => {
          cache.writeQuery({
            query: GET_NOTIFICATIONS,
            data : {
              notifications: deleteNotification
            }
          })
        }
      }).then(() => {
          // Close notifications with redux
      })
      .catch(err => console.log(err))
      
    }catch(err) {
      console.log(err);
    }
    
  }

  const declineRequest = async (notificationId: number) => {
    await deleteNotification({
      variables: {
        id: notificationId 
      },
      update: (cache , {data: {deleteNotification} }) => {
        cache.writeQuery({
          query: GET_NOTIFICATIONS,
          data : {
            notifications: deleteNotification
          }
        })
      }
    })
  }
  const takeToProject = async (notificationId: number, projectId: string) => {
      history.push(`/workspace/${projectId}`)
      await deleteNotification({
        variables: {
          id: notificationId 
        },
        update: (cache , {data: {deleteNotification} }) => {
          cache.writeQuery({
            query: GET_NOTIFICATIONS,
            data : {
              notifications: deleteNotification
            }
          })
        }
      })
  }
      return (
          <div className="notifications-container">
            <h3>Notifications</h3>
            <ul>
              {!loading && data && data.notifications && data.notifications.map((notification: any) => 
               <li key={notification.id} > 
                <div className="list-top">
                <Link to={`/profile/${notification.senderId}`}>
                  <img src={notification.avatar} alt="User Avatar"/>
                </Link>
              
                  <Fragment>
                   <p className="name">
                     <Link to={`/profile/${notification.senderId}`}>{notification.senderName}</Link> {notification.message.split("/")[0]}</p>
                  </Fragment>
             
                </div>
                { notification.type === "request" &&  
                    <div className="li-btns">
                      <button className="accept-btn" onClick={() => acceptMateRequest(notification.senderId, notification.id)}>Accept</button>
                      <button className="decline-btn" onClick={() => declineRequest(notification.id)}>Decline</button>
                    </div>
                 }
                 {
                   notification.type === "contributor" && 
                    <div className="li-btns">
                      <button onClick={() => takeToProject(notification.id, notification.message.split("/")[1])}>See project</button>
                      <button className="decline-btn" onClick={() => declineRequest(notification.id)}>Delete</button>
                    </div>
                 }
              </li>)}
              {!loading && data && data.notifications.length < 1 && <li>You have no notifcations.</li> }
            </ul>
          </div>
      )}

export default withRouter(connector(Notifications));
