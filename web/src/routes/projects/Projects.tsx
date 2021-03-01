import React from 'react'

import MyProjects from "../../components/project/MyProjects";
import ProjectsHeader from "../../components/project/ProjectsHeader";

const Projects: React.FC = () => {
    return (
    <div className="component-container">
         <ProjectsHeader />
        <ul className="list-of-projects">
            <MyProjects /> 
        </ul>
    </div>);
}

export default Projects;