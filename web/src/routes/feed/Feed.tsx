import React, { Fragment } from 'react'
import { Link } from "react-router-dom"
// GraphQL
import { useQuery } from "@apollo/client";
import {MY_ACCOUNT, FEED_POSTS} from "../../graphql/queries";
import CreateComponent from "../../components/create/CreateComponent"
import MyPost from "../../components/post/posts/MyPost";
import UsersPost from "../../components/post/posts/UsersPost";
import MySharedProject from "../../components/post/sharedProject/MySharedProject";
import UserSharedProject from "../../components/post/sharedProject/UserSharedProject";

const Feed: React.FC = () => {
  const { data, loading } = useQuery(FEED_POSTS);
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);

    return (
      <div className="component-container">
        <div className="feed-flex">
         <CreateComponent />
         {!loading && data && data.myFeed.length !== 0  ?
              <ul>
                {data.myFeed.map((post: any) => 
                <li key={post.post.id}>
                  { post.project !== null ?
                    <Fragment> 
                    { !meLoading && meData && meData.me.id === post.post.creatorId ? 
                      <MySharedProject post={post} />  :
                      <UserSharedProject post={post} /> 
                    }
                   </Fragment>
                  :
                  <Fragment> 
                  { !meLoading && meData && meData.me.id === post.post.creatorId ? 
                    <MyPost post={post} />  :
                    <UsersPost post={post} /> 
                  }
                 </Fragment>
                }
                  </li> )}
              </ul> : 
              <div className="no-posts">
                <p>There are no posts on your feed. Check out the <Link to="/discover">Discover</Link> page and find some new mates. </p>
              </div> }
        </div>
      </div> 
    );
}

export default Feed;