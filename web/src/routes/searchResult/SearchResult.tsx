import React, { useState, useRef } from 'react'
import { useLocation, withRouter } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { SEARCH_APPLICATION } from "../../graphql/queries"

import Users from "./lists/Users";
import Projects from "./lists/Projects";

interface ComponetProps {
  history: any
}

const SearchResult = ({history}:ComponetProps) => {
  const [searchData, setSearchData] = useState({ search : ""})
  const location = useLocation()
  const pathName = location.pathname
  const params = pathName.split("/")
  let inputData;
  if(searchData.search === "") {
    inputData = params[2];
  }  else {
    inputData = searchData.search.toLowerCase();
  }
  const { data, loading } = useQuery(SEARCH_APPLICATION, {
    variables : {
      input: inputData
    }
  });
  const searchInput = useRef<HTMLInputElement>(null); 

  if(loading) {
      return <div>loading...</div>
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({...searchData, search : e.target.value})
  }
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.push(`/search/${searchData.search}`)
  }

  const focusInput = () => {
    if(searchInput && searchInput.current) {
      searchInput.current.focus()
    }
  }

  return (
      <div className="component-container">
        <div className="mates-header">
            <form onSubmit={(e) => onSubmit(e)}>
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
              placeholder="Search projects"
              onChange={(e) => onChange(e)}
              ref={searchInput}
              />
              </span>
          </form>
        </div>
        { !loading && data && data.searchApplication.users && 
          <Users users={data.searchApplication.users} />
        }
        { !loading && data && data.searchApplication.projects &&
          <Projects projects={data.searchApplication.projects} />
        }
      </div>    
  );
}

export default withRouter(SearchResult)