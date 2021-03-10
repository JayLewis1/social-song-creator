import React, { Fragment, useState } from 'react'
import { withRouter, useLocation } from "react-router-dom";
// GraphQL
import { useQuery,useMutation } from "@apollo/client";
import { USERS_POSTS, MY_ACCOUNT,USER_BY_ID } from "../../graphql/queries";
import { LIKE_POST } from "../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
import Comment from "./comments/Comment";
import FormatTimestamp from "../formatTime/FormatTimestamp"

interface ComponentProps {
  user: { 
    user: {
      id : number
    }
  },
  posts: {
    postId: number,
    postDelete: boolean
  }
}

const mapState = (state: ComponentProps) => ({
  user: state.user.user,
  postId : state.posts.postId,
  postDelete : state.posts.postDelete
})

const mapDispatch = {
  setPostId : (id:number) => ({type: "SELECTED_POST_ID", payload: id}),
  validatePostDelete: (payload:boolean) => ({type: "SET_DELETE_COMPONENT", payload: payload}),
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux;

const UserPosts = ({ user, postId, postDelete, setPostId, validatePostDelete }:Props) => {
  const location: any = useLocation();
  const params = location.pathname.split("/")
  const userId = parseInt(params[2]);
  const [ postIdForComment, setIdForComments ] = useState(0)
  const [likePost] = useMutation(LIKE_POST);
  const { data: meData , loading: meLoading} = useQuery(MY_ACCOUNT);
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
  const toggleDeletePopUp = (id: number) => {
    if(postDelete === false){
      validatePostDelete(true);
      setPostId(id);
    } else {
      validatePostDelete(false);
      setPostId(0);
    }
  }
  
  const likePostById = (postId: number) => {
    likePost({ 
      variables : { postId },
      update: (cache, { data: { likePost } }) => {
        // Read the query cache
        const cacheLikeData : any = cache.readQuery(
          {
             query : USERS_POSTS,
             variables : {
                userId: userId
              }
        })  
        var index: any;
        // Assign varaible with the cache so we can modify
        var usersPosts = [...cacheLikeData.usersPosts];
        // Loop through the poss array
        for(var x = 0; x < usersPosts.length; x++) {
          // Find the post that links to the like we just created
          if(usersPosts[x].postId === likePost.postId) {
            // Get the index of the post 
            index = usersPosts.indexOf(usersPosts[x]);
          }
        }
        // Remove the item from the index we found
        // and replace with the new post data we get from the mutation response 
        usersPosts.splice(index, 1,likePost );
        // Write query to update cache passing the usersPosts variable in
        cache.writeQuery({
          query : USERS_POSTS,
          variables : {
             userId: userId
           },
           data: {
            usersPosts : usersPosts
          }
        })
      }
    })
    .catch(err => console.log(err))
  }

const openComments = (postId: number) => {
  if(postIdForComment === postId) {
   setIdForComments(0)
  } else {
   setIdForComments(postId)
  }
}
  // NEEDED FOR WHEN USERS CAN SHARE PROJECTS
  // const openPlaybarAndAssignTrackId = () => {
  //   activatePlaybar(true);
  // }
  
    return (
     <Fragment>
      {!loading && data && data.usersPosts.length !== 0  ?
      data.usersPosts.map((post: any) => 
        <li key={post.post.id}>
          <div className="post">
            <div className="post-top-wrapper">
               <div className="avatar">
                <img src={post.post.avatar} alt="User's Avatar"/>
               </div>
                      <span className="post-name-wrapper">
                        <p className="post-name post-user">{post.post.creatorName}</p>
                      <FormatTimestamp timestamp={post.post.created} />
                      </span>
              <span className="post-btn-wrapper">
              {!meLoading && meData && meData.me && meData.me.id=== post.post.creatorId ? 
                        <button className="post-buttons" onClick={() => toggleDeletePopUp(post.post.id)}>
                         <img src="/assets/icons/workspace/delete.svg" alt="Delete post"/>
                        </button> :
                          <button className="post-buttons" onClick={() => likePostById(post.post.id)}> 
                            <img src="/assets/icons/post/like.svg" alt="Like post"/> 
                          </button>}
              </span>
            </div>
            <div className="post-content"><p>{post.post.content}</p></div>
            <div className="post-bottom-wrapper">
            <button onClick={() => openComments(post.post.id)} className="comment-button">Comments</button>
            <p className="comments-length">{post.comments.length}</p>
                      <div className="likes"> 
                        <img src="/assets/icons/post/thumb.svg" alt="Likes"/>
                        <p>{post.likes.length}</p>
                      </div>
                    </div>
                    {postIdForComment === post.post.id ? <Comment postId={post.post.id} /> : null}
          </div>
          </li> ) : <div className="post"><p> {!userLoading && userData && userData.user && userData.user.firstName}  has not posted any posts</p></div> }
    
    </Fragment>
    );
}

export default withRouter(connector(UserPosts));