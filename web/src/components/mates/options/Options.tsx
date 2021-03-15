import React, { useEffect, useState} from 'react'
import { Link } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT, GET_MY_MATES, VALIDATE_NOTIFICATION } from "../../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {
  mates: {
    id: number
  }
}

const mapState = (state: ComponentProps) => ({
  userId: state.mates.id
})

const mapDispatch = {
  toggleMatesOptions: (payload: boolean) => ({type: "MATES_OPTIONS", payload}),
  toggleMatesRemove: (payload: boolean) => ({type: "MATES_REMOVE", payload}),
  toggleMatesAdd: (payload: boolean) => ({type: "MATES_ADD", payload}),
  selectedUserId: (userId: number ) => ({type: "MATES_SELECTED_ID", payload: userId})
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  type: string
}

const Options = ({ userId, type, toggleMatesOptions, toggleMatesRemove, toggleMatesAdd, selectedUserId}:Props) => {
  const [isOurMate, setIsOurMate] = useState(false);
  const [myId, setMyId] = useState(0);
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);

  const { data: mateData, loading: mateLoading } = useQuery(GET_MY_MATES, {
    variables: {
      userId: meData.me.id
    }
  });
  
  const { data: nData, loading: nLoading } = useQuery(VALIDATE_NOTIFICATION, { 
    variables : {
      senderId : meData.me.id,
      recipient: userId,
      type: "request"
    }
  })

  useEffect(() => {
    if(!meLoading && !mateLoading && mateData) {
      setMyId(meData.me.id);
      for(let x = 0; x < mateData.getMates.length; x++) {
        if(userId === mateData.getMates[x].id) {
          setIsOurMate(true)
        }
      }
    }
  }, [meLoading, mateLoading , meData, mateData, userId, setIsOurMate])
  return (
    <div className="options-container">
        <div className="options">
          {!nLoading && nData.validateNotification !== true &&  isOurMate === false && myId !== userId && 
            <button className="add-btn" onClick={() => toggleMatesAdd(true)}>Add Friend</button>
          }
          { myId !== userId  && !nLoading && nData.validateNotification === true &&
           <button className="add-btn" disabled style={{cursor: "default"}}>Mate request sent</button>
           }  
          {isOurMate === true && myId !== userId &&  
            <button className="delete-btn" onClick={() => toggleMatesRemove(true)}>Remove Friend</button>
          }
          { type !== "profile" && 
            <Link className="share-btn" to={`/profile/${userId}`}>See Profile</Link>  
          }
            <button onClick={() => toggleMatesOptions(false)}>Cancel</button>
        </div>
    </div>
  )
}

export default connector(Options);