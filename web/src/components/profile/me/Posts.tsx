import React, { Fragment } from 'react'
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_POSTS } from "../../../graphql/queries";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components 
import MyPost from "../../post/posts/MyPost";
import MySharedProject from "../../post/sharedProject/MySharedProject";

const mapDispatch = {
  closePostPanel : (payload: boolean) => ({ type: "CLOSE_POST_PANEL", payload: payload }),
}

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux;

const Posts = ({ closePostPanel }:Props) => {
  const { data, loading } = useQuery(MY_POSTS);
  
  if(loading) {
    return <div>Loading...</div>
  }
  const togglePostPanel = () => {
    closePostPanel(true)
  }
    return (
     <Fragment>
      {!loading && data && data.myPosts.length !== 0  ?
      data.myPosts.map((post: any) => 
        <li key={post.post.id}>
      { post.project !== null ?
          <MySharedProject post={post} />
                   :
         <MyPost post={post} />
      }
          </li> ) : 
            <div className="no-posts">
            <p>You have no posts yet.</p>
              <button onClick={() => togglePostPanel()}>  Why not create a new post? 
              </button>
          </div> }
    </Fragment>
    );
}

export default connector(Posts);