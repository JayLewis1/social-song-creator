import React from 'react'
// GrahphQL
import { useMutation, useQuery } from "@apollo/client";
import {MY_ACCOUNT, GET_MY_MATES, USER_BY_ID } from "../../../graphql/queries"
import { REMOVE_MATE } from "../../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";

const mapDispatch = {
  toggleMatesOptions: (payload: boolean) => ({type: "MATES_OPTIONS", payload}),
  toggleMatesRemove: (payload: boolean) => ({type: "MATES_REMOVE", payload})
}

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  mateId: number
}

const Remove = ({mateId, toggleMatesRemove, toggleMatesOptions}: Props) => {
  const [removeMate] = useMutation(REMOVE_MATE);
  const { data, loading } = useQuery(USER_BY_ID, {
    variables : {
      userId: mateId
    }
  })
  const { data: meData } = useQuery(MY_ACCOUNT);

  if(!loading && data) {
    console.log(data);
  }
  const removeFriend = async () => {
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
  return (
    <div className="result-component">
    <div className="wrapper">
          <p>Are you sure you want to remove as <em className="capitalize">{!loading && data && data.user.firstName}</em> a mate?</p> 
          <span className="btn-wrapper">
            <button onClick={() => removeFriend()} className="delete-btn">
              <span className="btn-bg"></span>
              <p>Remove mate</p>
            </button>
            <button onClick={() => toggleMatesRemove(false)} >
              <p>Cancel</p>
            </button>
          </span>
    </div>
  </div>
  )
}

export default connector(Remove)