import React, { Fragment, useState } from 'react'
import { Link, useLocation, withRouter } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { SEARCH_APPLICATION } from "../../graphql/queries"

interface ComponetProps {
  history: any
}

const SearchResult = ({history}:ComponetProps) => {
  const [mateId, setMateId] = useState(0);
  const [validateRemove, setValidation ] = useState(false);
  const [searchData, setSearchData] = useState({ search : ""})
  const location = useLocation()
  const pathName = location.pathname
  const params = pathName.split("/")
  const { data, loading } = useQuery(SEARCH_APPLICATION, {
    variables : {
      input: params[2]
    }
  });

  if(loading) {
      return <div>loading...</div>
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({...searchData, search : e.target.value})
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(searchData.search)
    history.push(`/search/${searchData.search}`)
  }


  return (
      <div className="component-container">
        <div className="mates-header">
        <form onSubmit={(e) => onSubmit(e)}>
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
          placeholder="Search people and projects"
          onChange={(e) => onChange(e)}
          />
      </form>
        </div>
        <div className="results-container">
        { !loading && data && data.searchApplication.users !== 0 &&
        <Fragment>
          <h3>Users</h3>
          <ul>
            { data.searchApplication.users.map((user: any) => 
              <li key={user.id}>
                <Link to={`/profile/${user.id}`}> </Link>
                  <span>
                    <img src={user.avatar} alt="Users avatar"/>
                  </span>
                  <p>{user.firstName}</p>
              </li>
            )}  
          </ul>
         </Fragment>
        }
         { !loading && data && data.searchApplication.projects !== 0 &&
        <Fragment>
          <h3>Projects</h3>
          <ul>
            { data.searchApplication.projects.map((project: any) => 
              <li key={project.id}>
              <Link to={`/workspace/${project.id}`}></Link>
                <span>
                  <img className="project-icon" src="/assets/icons/menu/projects.svg" alt="Project icon"/>
                </span>
                <p>{project.name}</p>
                <p className="creator">by {project.creatorId}</p>
              </li>
            )}  
          </ul>
         </Fragment>
        }
        </div>
      </div>    
          );
}

export default withRouter(SearchResult)