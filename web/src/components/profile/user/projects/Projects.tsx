import React , { Fragment } from 'react'
import { useLocation} from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import {USERS_PROJECTS} from "../../../../graphql/queries";
// Components
import UsersProject from "../../../project/project/UsersProject";
import EmptyState from "../../../project/components/EmptyState";
 
const UserProjects: React.FC = () => {
  const location: any = useLocation();
  const params = location.pathname.split("/")
  const userId = parseInt(params[2]);
  const { data, loading } = useQuery(USERS_PROJECTS, {
    variables : {
      userId
    }
  });

    return (
      <Fragment>
        {!loading && data && data.usersProjects.length !== 0  ?
            data.usersProjects.map((project: any) => 
            <UsersProject userId={userId} project={project}/>) :
            <EmptyState type="user" userId={userId} />
        }
      </Fragment>
    );
}

export default UserProjects;