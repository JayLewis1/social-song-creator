
import React, { Fragment, useState } from 'react'
import Project from "../../../components/project/project/UsersProject";

interface ComponentProps {
  projects: Array<any>
}

const Projects = ({projects}:ComponentProps) => {
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
      setIndexLimit(projects.length)
    } else {
      setShowMore(false)
      setIndexLimit(4)
    }
  }
  return (
      <div className="results-wrapper project-results">
        <span className="results-header">
          <h3 className="search-headings">Projects</h3> 
          <button className="hide-btn" onClick={() => hideResults()}>
            <span className="btn-bg"></span>
            <p>Hide Projects</p>
          </button>
        </span>
        <ul className={hide === true ? "hide-list": "users-projects"} >
        { projects.length !== 0 ? projects.map((project : any, index: number) => 
        <Fragment> 
          { index < indexLimit &&
           <Project userId={project.creatorId} project={project}/>
           }
        </Fragment>
        ) : 
         <div className="no-posts"> 
          <p>There are no projects with that name.</p>
         </div>
        }
        </ul>
        {
          hide === false && projects.length > 4 &&
          <button onClick={() => showResults()}className="show-less">
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

export default Projects;
