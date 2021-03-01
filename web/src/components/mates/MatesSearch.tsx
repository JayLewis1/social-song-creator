import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom"
// GrahphQL
import { useQuery, useMutation } from "@apollo/client";
import { SEARCH_MATES, } from "../../graphql/queries"
import { REMOVE_MATE } from "../../graphql/mutations";

interface ComponentProps {
  userId: number
}

const MatesSearch = ({userId}: ComponentProps) => {
  const [searchData, setSearchData] = useState({ search: "" })
  const [validateRemove, setValidation ] = useState(false);
  const [mateId, setMateId] = useState(0);
  const [removeMate] = useMutation(REMOVE_MATE);
  const { data, loading } = useQuery(SEARCH_MATES, {
  variables : {
    name: searchData.search
  }
  });

  const removeMateFunc = (id: number) => {
    removeMate({
      variables: {
        mateId: id
      },
      update: (cache, { data: { removeMate }}) => {
  
        cache.writeQuery({
          query: SEARCH_MATES, 
          variables: {
                userId
                    }, 
          data: {
            searchMates: removeMate
           }
      })  
      }
    })
  }

  const validateRemoveFunc = (id: number) => {
    setMateId(id);
    setValidation(true)
  }

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({...searchData , search: e.target.value })
  }


  return (
    <Fragment>
      <div className="mates-header">
      <form>
      { searchData.search !== ""  ?
          <button className="clear-btn" onClick={() => setSearchData({search: ""})}>
            <img src="/assets/icons/menu/clear.svg" alt="Clear search"/>
          </button>
          :
          <span>
            <img src="/assets/icons/menu/search-blue.svg" alt="Search"/>
          </span>
        }
        <input 
          type="text"
          id="search"
          name="search"
          value={searchData.search}
          placeholder="Search for mates"
          onChange={(e) => onChange(e)}
          />
      </form>
    </div>
    { searchData.search !== "" && 
    <ul className="mates-list">
        { !loading && data && data.searchMates.length !== 0 ? data.searchMates.map((mate: any) => 
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
        </li>) : <li className="no-posts">
            <p>You don't have any mates with this name.</p>
          </li> }
      </ul>
           }
    </Fragment>
  )
}

export default MatesSearch;