import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom"
// GrahphQL
import { useQuery, useMutation } from "@apollo/client";
import { GET_MY_MATES } from "../../graphql/queries"
import { REMOVE_MATE } from "../../graphql/mutations";

interface ComponentProps {
  userId: number
}

const MatesComponent = ({userId}: ComponentProps) => {
  const [validateRemove, setValidation ] = useState(false);
  const [mateId, setMateId] = useState(0);
  const [removeMate] = useMutation(REMOVE_MATE);
  const { data, loading } = useQuery(GET_MY_MATES, {
  variables : {
    userId
  }
  });

  const removeMateFunc = (id: number) => {
    removeMate({
      variables: {
        mateId: id
      },
      update: (cache, { data: { removeMate }}) => {
  
        cache.writeQuery({
          query: GET_MY_MATES, 
          variables: {
                userId
                    }, 
          data: {
            getMates: removeMate
           }
      })  
      }
    })
  }

  const validateRemoveFunc = (id: number) => {
    setMateId(id);
    setValidation(true)
  }

  return (
    <Fragment>
        { !loading && data && data.getMates.length !== 0 ? data.getMates.map((mate: any) => 
        <li key={mate.id} className="mate-container">
          <img src={mate.avatar} alt="User Avatar"></img>
          <span>
            <p>{mate.firstName} {mate.lastName}</p>
            <Link to={`/profile/${mate.id}`}>View Profile</Link>
          </span>
          <span className="btn-wrapper">
            <button onClick={() => validateRemoveFunc(mate.id)}> 
              <img src="/assets/icons/workspace/delete.svg" alt="Remove Friend"/>
            </button>
          </span>
          { validateRemove === true && mate.id === mateId &&
            <div className="remove-validation">
            <p>Are you sure you want to remove <b>{mate.firstName}</b> as a mate?</p>
            <span className="remove-btns">
              <button className="remove-button" onClick={() => removeMateFunc(mate.id)}>Remove</button>
              <button className="cancel-buton" onClick={() => setValidation(false)}>Cancel</button>
            </span>
          </div>
          }
        </li> ) : 
        <li className="no-posts">
            <p>You have no mates. Check out the <Link to="/discover">Discover</Link> page and find some new mates.</p>
          </li> }
    </Fragment>
  )
}

export default MatesComponent;