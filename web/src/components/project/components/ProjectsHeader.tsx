import React, { useRef , useState, Fragment} from 'react'
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT, SEARCH_PROJECTS } from "../../../graphql/queries";
// Redux 
import { connect, ConnectedProps } from "react-redux";
// Components 
import SearchProjects from "./SearchProjects";

interface ComponentProps {
 application : {
   projectPanel: boolean
 }
}

const mapState = (state: ComponentProps) => ({
  projectPanel: state.application.projectPanel
})

const mapDispatch = {
  intialiseProject: (bool: boolean ) => ({type: "INIT_PROJECT", payload: bool }),
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;
const ProjectsHeader = ({projectPanel, intialiseProject} : Props) => {
  const [searchData, setSearchData] = useState({
    search: ""
  })
  const searchInput = useRef<HTMLInputElement>(null); 

  const toggleProjectPanel = () => {
    if(projectPanel === true) {
      intialiseProject(false)
    } else {
      intialiseProject(true)
    }
  }

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({...searchData , search: e.target.value})
  } 

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  const focusInput = () => {
    if(searchInput && searchInput.current) {
      searchInput.current.focus()
    }
  }
  return (
    <Fragment>
    <div className="projects-header">
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
          <div className="right">
            <button onClick={() => toggleProjectPanel()}> 
              <img src="/assets/icons/create/project-create.svg" alt="Create Project" />
              <p>Create Project</p>
            </button>
          </div>
    </div>
    { searchData.search !== ""  &&  <SearchProjects searchInput={searchData.search}/> }
    </Fragment>
  )
}
export default connector(ProjectsHeader);