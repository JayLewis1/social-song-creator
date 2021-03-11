import React, { useState, Fragment } from 'react'
import Mate from "../../../components/mates/mate/Mate";
interface ComponentProps {
  users: Array<any>
}

const Users = ({users}:ComponentProps) => {
  const [hide, setHideResults] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [indexLimit, setIndexLimit] = useState(4);

  const hideResults = () => {
    if(hide === true) {
      setHideResults(false)
    } else {
      setHideResults(true)
    }
  }

  const showResults = () => {
    if(indexLimit === 4) {
      setShowMore(true)
      setIndexLimit(users.length)
    } else {
      setShowMore(false)
      setIndexLimit(4)
    }
  }
  return (
      <div className="results-wrapper">
    <span className="results-header">
          <h3 className="search-headings">Users</h3> 
          <button className="hide-btn" onClick={() => hideResults()}>
            <span className="btn-bg"></span>
            <p>Hide Users</p>
          </button>
        </span>
        <ul className={hide === true ? "hide-list": ""}>
        { users.length !== 0  ? users.map((user: any, index: number) => 
         <Fragment> 
         { index < indexLimit &&
          <Mate mate={user}/>
          }
       </Fragment>
        ) : 
         <div className="no-posts"> 
          <p>There are no users with that name.</p>
         </div>
        }
        </ul>
        {
           hide === false &&  users.length > 4 &&
          <button onClick={() => showResults()} className="show-less">
          { showMore === true ? 
           <p>Show less</p> 
           : 
           <p>Show more</p> 
          }
          </button>
        }
      </div>
        );
}

export default Users;