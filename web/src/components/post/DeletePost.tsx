import React from 'react'

// GraphQL
import { useMutation } from "@apollo/client";
import { MY_POSTS, FEED_POSTS, ALL_POSTS } from "../../graphql/queries";
import { DELETE_POST } from "../../graphql/mutations";

import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {
  posts: {
    postId: number
  }
}

const mapState = (state: ComponentProps) => ({
  postId : state.posts.postId
})

const mapDispatch = {
  setPostId : (id:number) => ({type: "SELECTED_POST_ID", payload: id}),
  validatePostDelete: (payload:boolean) => ({type: "SET_DELETE_COMPONENT", payload: payload}),
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux;

const DeletePost = ({postId, validatePostDelete, setPostId}:Props) => {
  const [deletePost] = useMutation(DELETE_POST);
  const deletPostById = async () => {
    const id = postId; 
    // Remove post and update all caches
    deletePost({
        variables: { postId: id }, 
        update: (cache, { data: { deletePost }}) => {
            // Cache for my posts : Update cache to show on profile in realtime
          const cacheMyData: any = cache.readQuery({ query: MY_POSTS });
          // Check to see if there is a cache
          if(cacheMyData !== null) {
            let updatedMyCache = [...cacheMyData.myPosts];
            let index;
            for(let x = 0; x < updatedMyCache.length; x++ ) {
              if(updatedMyCache[x].postId === postId ) {
               index =  updatedMyCache.indexOf(updatedMyCache[x]);
               updatedMyCache.splice(index, 1);
              }
          }
          cache.writeQuery({ 
            query: MY_POSTS, 
            data: {
              myPosts: updatedMyCache
            }
          });
        }  
          // Cache for feed posts : Update cache to show on profile in realtime
          const cacheFeedPosts: any = cache.readQuery({ query: FEED_POSTS });
          // Check to see if there is a cache
          if(cacheFeedPosts !== null) {
            let updatedFeedCache = [...cacheFeedPosts.myFeed];
            let index;
            for(let x = 0; x < updatedFeedCache.length; x++ ) {
              if(updatedFeedCache[x].postId === postId ) {
               index =  updatedFeedCache.indexOf(updatedFeedCache[x]);
               updatedFeedCache.splice(index, 1);
              }
          }
          cache.writeQuery({ 
            query: FEED_POSTS, 
            data: {
              myFeed: updatedFeedCache
            }
          });
        }  
          // Cache for all posts : Update cache to show on feed in realtime
          const cacheAllData: any = cache.readQuery({ query: ALL_POSTS });
           // Check to see if there is a cache
           if(cacheAllData !== null) {
            let updatedAllCache = [...cacheAllData.allPosts];
            let index
            // Loop through the cache and find the post we want to delete by matching the postId
            for(let x = 0; x < updatedAllCache.length; x++ ) {
                if(updatedAllCache[x].postId === postId ) {
                 index =  updatedAllCache.indexOf(updatedAllCache[x]);
                 updatedAllCache.splice(index, 1);
                }
            }
          cache.writeQuery({ 
            query: ALL_POSTS,
            data : {
              allPosts : updatedAllCache
            } 
          });
          }
        }
      }).then(() => {
        setPostId(0);
        validatePostDelete(false);
      })
      .catch(err => console.log(err) )
    }

  return (
    <div className="delete-popup">
      <p>Are you sure you want to delete this post?</p>
      <span className="delete-buttons-wrappers">
        <button className="delete-btn" onClick={() => deletPostById()}>Delete</button>
        <button onClick={() => validatePostDelete(false)}>Cancel</button>
    </span>
  </div>
  )
}

export default connector(DeletePost);