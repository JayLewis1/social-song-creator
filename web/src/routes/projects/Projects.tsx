import React from 'react'
// Components
import MyProjects from "../../components/project/lists/MyProjects";
import ProjectsHeader from "../../components/project/components/ProjectsHeader";
 
const Projects: React.FC = () => {
    return (
    <div className="component-container">
         <ProjectsHeader />
         <ul className="list-of-projects">
            <MyProjects />
         </ul>
    </div>
    );
}

export default Projects;