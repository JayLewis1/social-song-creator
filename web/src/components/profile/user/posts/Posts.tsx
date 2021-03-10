import React, { Fragment } from 'react'
import { withRouter, useLocation } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { USERS_POSTS, USER_BY_ID } from "../../../../graphql/queries";
// Components
import UsersPost from "../../../post/posts/UsersPost";
import UserSharedProject from "../../../post/sharedProject/UserSharedProject";

const Posts: React.FC = () => {
  const location: any = useLocation();
  const params = location.pathname.split("/")
  const userId = parseInt(params[2]);
  const { data: userData, loading: userLoading } = useQuery(USER_BY_ID, {
    variables: {
      userId: userId
    }
  });
  const { data, loading } = useQuery(USERS_POSTS, {
    variables: {
      userId: userId
    }
  });

  if(loading) {
    return <div>Loading...</div>
  }

    return (
     <Fragment>
      {!loading && data && data.usersPosts.length !== 0  ?
      data.usersPosts.map((post: any) => 
        <li key={post.post.id}>
           { post.project !== null ?
              <UserSharedProject post={post} />
              :
              <UsersPost post={post} />
           }  
          </li> ) : 
          <div className="no-posts"><p> <em>{!userLoading && userData && userData.user && userData.user.firstName}</em> has no posts</p></div> }
    
    </Fragment>
    );
}

export default withRouter(Posts);