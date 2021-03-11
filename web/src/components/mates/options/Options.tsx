import React, { useEffect, useState} from 'react'
import { Link } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT, GET_MY_MATES } from "../../../graphql/queries";
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

const Options = ({ mateId, toggleMatesOptions, toggleMatesRemove}:Props) => {
  const [isOurMate, setIsOurMate] = useState(false);
  const [myId, setMyId] = useState(0);
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);

  const { data: mateData, loading: mateLoading } = useQuery(GET_MY_MATES, {
    variables: {
      userId: meData.me.id
    }
  });
  
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


  const toggleRemoveValidations = () => {
    toggleMatesRemove(true);
  }

  return (
    <div className="options-container">
        <div className="options">
          {isOurMate === false && myId !== mateId && 
            <button className="add-btn" onClick={() => toggleRemoveValidations()}>Add Friend</button>
          }
            <Link className="share-btn" to={`/profile/${mateId}`}>See Profile</Link>    
          {isOurMate === true && myId !== mateId &&  
            <button className="delete-btn" onClick={() => toggleRemoveValidations()}>Remove Friend</button>
          }
            <button onClick={() => toggleMatesOptions(false)}>Cancel</button>
        </div>
    </div>
  )
}

export default connector(Options);