import React, { Fragment } from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_PROJECTS } from "../../../graphql/queries";
// Components
import MyProject from "../project/MyProject";
import EmptyState from "../components/EmptyState";
 
const Projects: React.FC = () => {
    const { data, loading } = useQuery(MY_PROJECTS);
    return (
        <Fragment>
        {!loading && data && data.myProjects.length !== 0  ?
            data.myProjects.map((project: any) => 
            <MyProject key={project.id}project={project}/>) :
            <EmptyState type="me" userId={0}/>
        }
        </Fragment>
    );
}
 
export default Projects;