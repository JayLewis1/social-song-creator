import React, { Fragment } from 'react'
// GrahphQL
import { useMutation, useQuery } from "@apollo/client";
import {MY_ACCOUNT, GET_MY_MATES, USER_BY_ID, VALIDATE_NOTIFICATION } from "../../../graphql/queries"
import { REMOVE_MATE, SEND_NOTIFICATION } from "../../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";

type Result  = {
  show: boolean
  success: boolean
  type: string
}
const mapDispatch = {
  toggleMatesOptions: (payload: boolean) => ({type: "MATES_OPTIONS", payload}),
  toggleMatesRemove: (payload: boolean) => ({type: "MATES_REMOVE", payload}),
  toggleMatesAdd: (payload: boolean) => ({type: "MATES_ADD", payload}),
  toggleResult: (payload: Result ) => ({type: "RESULT_TOGGLE", payload})
}

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  mateId: number
  type: string
}

const Validation = ({type, mateId, toggleMatesRemove, toggleMatesOptions, toggleMatesAdd, toggleResult}: Props) => {
  const [sendNotfication] = useMutation(SEND_NOTIFICATION);
  const [removeMate] = useMutation(REMOVE_MATE);
  const { data, loading } = useQuery(USER_BY_ID, {
    variables : {
      userId: mateId
    }
  })
  const { data: meData } = useQuery(MY_ACCOUNT);

  const removeMateFunc = async () => {
   await removeMate({
      variables: {
        mateId
      },
      update: (cache, { data: { removeMate }}) => {
     
        cache.writeQuery({
          query: GET_MY_MATES, 
          variables: {
                userId : meData.me.id
                    }, 
          data: {
            getMates: removeMate
           }
        })  
      }
    }) 
    try {
      toggleMatesOptions(false)
      toggleMatesRemove(false)
    } catch(err) {
      console.log(err);
    }
  }

  const addMate = async () => {
    const response =  await sendNotfication({
      variables : {
          recipient: mateId,
          type: "request",
          message: "wants to be your mate."
      }, update : (cache ,  {data : { sendNotfication }}) => {
        const cacheRead = cache.readQuery({
          query : VALIDATE_NOTIFICATION,
          variables: {
            senderId : meData.me.id,
            recipient: mateId,
            type: "request"
          }
        });
          console.log(cacheRead);
          cache.writeQuery({
            query : VALIDATE_NOTIFICATION,
            variables: {
              senderId : meData.me.id,
              recipient: mateId,
              type: "request"
            },
            data: {
              validateNotification: true
            }
          })
         }
      })
  try{
    toggleMatesOptions(false);
    toggleMatesAdd(false);
    if(response.data.sendNotfication.reqBlocked !== true) {
      const result = {
        show: true,
        success: true,
        type: "request"
      }
      toggleResult(result);
    }
  } catch(err) {
      console.log(err);
  }
  }
  return (
    <div className="result-component">
    <div className="wrapper">
      {type === "remove" && 
        <Fragment>
          <p>Are you sure you want to remove <em className="capitalize">{!loading && data && data.user.firstName}</em> as a mate?</p> 
          <span className="btn-wrapper">
            <button onClick={() => removeMateFunc()} className="delete-btn">
              <span className="btn-bg"></span>
              <p>Remove mate</p>
            </button>
            <button onClick={() => toggleMatesRemove(false)} >
              <p>Cancel</p>
            </button>
          </span>
        </Fragment>
      }
       {type === "add" && 
        <Fragment>
          <p>Are you sure you want to add <em className="capitalize">{!loading && data && data.user.firstName}</em> as a mate?</p> 
          <span className="btn-wrapper">
            <button onClick={() => addMate()} className="add-btn">
              <span className="btn-bg"></span>
              <p>Add mate</p>
            </button>
            <button onClick={() =>  toggleMatesAdd(false)}>
              <p>Cancel</p>
            </button>
          </span>
        </Fragment>
      }
    </div>
  </div>
  )
}

export default connector(Validation)