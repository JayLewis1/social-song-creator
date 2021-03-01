import React, { useState, useEffect, Fragment, useRef } from 'react'
import { Link, useLocation, withRouter } from "react-router-dom"
// GraphQL
import { useQuery } from "@apollo/client"
import { SEARCH_APPLICATION } from "../../graphql/queries"
// Redux
import { connect, ConnectedProps } from "react-redux"

interface ComponentProps {
  applciation : {
    searchPanel: boolean
  }
}

const mapState = (state: any) => ({
  searchPanel: state.application.searchPanel
}) 

const mapDispatch = {
  toggleSearch : (payload: boolean) => ({ type: "TOGGLE_SEARCH", payload: payload })
}

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  history : any
}

const Search = ({toggleSearch, searchPanel, history}: Props) => {
  const [ searchData, setSearchData ] = useState({ search: "" })
  const [routeLocation, setLocation] = useState("")
  const { data, loading } = useQuery(SEARCH_APPLICATION, {
    variables: {
      input : searchData.search
    }
  })
  const location = useLocation();
  const searchInput = useRef(null);

  useEffect(() => {
    let pathname = location.pathname;
    if(routeLocation !== "" && pathname!== routeLocation) {
      toggleSearch(false)
      setLocation(pathname)
    } else {
      setLocation(pathname)
    }

  }, [location, routeLocation])

  const closeContainer = () => {
    if(searchPanel === true ) {
      toggleSearch(false);
    } else {
      toggleSearch(true);
    }
  }
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({...searchData, search: e.target.value })
  }

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    history.push(`/search/${searchData.search}`)
  }

  return (
    <div className="search-container">
      <span className="flex-wrapper">
        <button className="header-btns" onClick={() => closeContainer()}>
          <img src="/assets/icons/menu/back.svg" alt="back"/>
        </button>
        <form id="search-form" onSubmit={(e) => onSubmit(e)}>
          <input autoFocus ref={searchInput} type="text" id="search-bar" placeholder="Search projects, people and bands" value={searchData.search} onChange={(e) => onChange(e)}/>
        </form>
      </span>
      { searchData.search !== "" && 
        <ul className="search-list">
           { !loading && data && data.searchApplication.users.length !== 0 && 
           <Fragment>
            <h3>Users</h3>
              { data.searchApplication.users.map((user: any) => 
                <li key={user.id}>
                  <Link to={`/profile/${user.id}`}> </Link>
                    <span>
                      <img src={user.avatar} alt="Users avatar"/>
                    </span>
                    <p>{user.firstName}</p>
                </li>
              )}  
          </Fragment> }
          { !loading && data && data.searchApplication.projects.length !== 0 && <Fragment>
          <h3>Projects</h3>
            {data.searchApplication.projects.map((project: any) => 
            <li key={project.id}>
              <Link to={`/workspace/${project.id}`}></Link>
                <span>
                  <img className="project-icon" src="/assets/icons/menu/projects.svg" alt="Project icon"/>
                </span>
                <p>{project.name}</p>
                <p className="creator">by {project.creatorId}</p>
              </li>
          )}
          </Fragment> }
        </ul>
      }
    </div>
  )
}

export default withRouter(connector(Search));