import React, { Fragment, useState, useRef } from "react";
// GrahphQL
import { useQuery } from "@apollo/client";
import { SEARCH_MATES } from "../../../graphql/queries"
// Components
import Mate from "../mate/Mate";

const SearchMates: React.FC = () => {
  const [searchData, setSearchData] = useState({ search: "" })
  const { data, loading } = useQuery(SEARCH_MATES, {
  variables : {
    name: searchData.search.toLowerCase()
  }
  });
  const searchInput = useRef<HTMLInputElement>(null); 
  
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({...searchData , search: e.target.value })
  }

  const focusInput = () => {
    if(searchInput && searchInput.current) {
      searchInput.current.focus()
    }
  }

  return (
    <Fragment>
      <div className="mates-header">
      <form>
      <span className="input-wrapper">
      { searchData.search !== ""  ?
          <button className="clear-btn" onClick={() => setSearchData({search: ""})}>
            <img src="/assets/icons/menu/clear.svg" alt="Clear search"/>
          </button>
          :
          <button className="focus-btn" onClick={() => focusInput()}>
          <img src="/assets/icons/menu/search-blue.svg" alt="Search"/>
        </button>
        }
        <input 
          type="text"
          id="search"
          name="search"
          value={searchData.search}
          placeholder="Search for mates"
          onChange={(e) => onChange(e)}
          />
       </span>
      </form>
    </div>
    { searchData.search !== "" && 
    <ul className="mates-list" id="search-mates-list">
        { !loading && data && data.searchMates.length !== 0 ? data.searchMates.map((mate: any) => 
            <Mate mate={mate} />    
        ) : 
        <li className="no-posts">
          <p>You don't have any mates with this name.</p>
        </li> }
      </ul>
           }
    </Fragment>
  )
}

export default SearchMates;