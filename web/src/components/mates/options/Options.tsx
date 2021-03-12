import React, { useEffect, useState} from 'react'
import { Link } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT, GET_MY_MATES, VALIDATE_NOTIFICATION } from "../../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";

const mapDispatch = {
  toggleMatesOptions: (payload: boolean) => ({type: "MATES_OPTIONS", payload}),
  toggleMatesRemove: (payload: boolean) => ({type: "MATES_REMOVE", payload}),
  toggleMatesAdd: (payload: boolean) => ({type: "MATES_ADD", payload})
}

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  mateId: number
  type: string
}

const Options = ({ type, mateId, toggleMatesOptions, toggleMatesRemove, toggleMatesAdd}:Props) => {
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
      recipient: mateId,
      type: "request"
    }
  })

  useEffect(() => {
    if(!meLoading && !mateLoading && mateData) {
      setMyId(meData.me.id);
      for(let x = 0; x < mateData.getMates.length; x++) {
        if(mateId === mateData.getMates[x].id) {
          setIsOurMate(true)
        }
      }
    }
  }, [meLoading, mateLoading , meData, mateData, mateId, setIsOurMate])
  console.log(mateId)
  return (
    <div className="options-container">
        <div className="options">
          {!nLoading && nData.validateNotification !== true &&  isOurMate === false && myId !== mateId && 
            <button className="add-btn" onClick={() => toggleMatesAdd(true)}>Add Friend</button>
          }
          { myId !== mateId  && !nLoading && nData.validateNotification === true &&
           <button className="add-btn" disabled style={{cursor: "default"}}>Mate request sent</button>
           }  
          {isOurMate === true && myId !== mateId &&  
            <button className="delete-btn" onClick={() => toggleMatesRemove(true)}>Remove Friend</button>
          }
          { type !== "profile" && 
            <Link className="share-btn" to={`/profile/${mateId}`}>See Profile</Link>  
          }
  
            <button onClick={() => toggleMatesOptions(false)}>Cancel</button>
        </div>
    </div>
  )
}

export default connector(Options);