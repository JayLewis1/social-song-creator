import React, { useEffect , useState, Fragment} from 'react'
import { useQuery } from "@apollo/client";
import { MY_ACCOUNT, SEARCH_PROJECTS } from "../../graphql/queries";
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
  const { data, loading } = useQuery(MY_ACCOUNT);

  const { data: projectData, loading: projectLoading } = useQuery(SEARCH_PROJECTS , 
    {variables : {
    projectName : searchData.search
  }});

  const toggleProjectPanel = () => {
    if(projectPanel === true) {
      intialiseProject(false)
    } else {
      intialiseProject(true)
    }
  }

  const onChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchData({...searchData , search: e.target.value})
    if(!projectLoading) {
      console.log(searchData.search)
      console.log(projectData.searchProjects)
    }
  } 

  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.target);
  }

  return (
    <Fragment>
    <div className="projects-header">
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
          placeholder="Search for projects"
          onChange={(e) => onChange(e)}
          />
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