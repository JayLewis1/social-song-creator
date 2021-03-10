import React from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_PROJECTS } from "../../../graphql/queries";
// Components
import MyProject from "../project/MyProject";
import EmptyState from "../components/EmptyState";
 
const Projects: React.FC = () => {
    const { data, loading } = useQuery(MY_PROJECTS);
    return (
        <ul className="list-of-projects">
        {!loading && data && data.myProjects.length !== 0  ?
            data.myProjects.map((project: any) => 
            <MyProject project={project}/>) :
            <EmptyState type="me" userId={0}/>
        }
        </ul>
    );
}

export default Projects;