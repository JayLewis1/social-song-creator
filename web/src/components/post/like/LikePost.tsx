import React from 'react'
// GraphQL
import {useMutation } from "@apollo/client";
import {FEED_POSTS} from "../../../graphql/queries";
import { LIKE_POST } from "../../../graphql/mutations";
interface ComponentProps {
  id: number
}
const LikePost = ({ id }:ComponentProps) => {
  const [likePost] = useMutation(LIKE_POST);
  const likePostById = () => {
    likePost({ 
      variables : { postId: id },
      update: (cache, { data: { likePost } }) => {
        // Read the query cache
        const cacheLikeData : any = cache.readQuery({query : FEED_POSTS })  
        var index: any;
        if(cacheLikeData !== null ) {
        // Assign varaible with the cache so we can modify
        var myFeed = [...cacheLikeData.myFeed];
        // Loop through the poss array
        for(var x = 0; x < myFeed.length; x++) {
          // Find the post that links to the like we just created
          if(myFeed[x].postId === likePost.postId) {
            // Get the index of the post 
            index = myFeed.indexOf(myFeed[x]);
          }
        }
        // Remove the item from the index we found
        // and replace with the new post data we get from the mutation response 
        myFeed.splice(index, 1,likePost);
        // Write query to update cache passing the myFeed variable in
        cache.writeQuery({
          query : FEED_POSTS,
           data: {
            myFeed : myFeed
          }
        })
      }
      }
    })
    .catch(err => console.log(err))
  }

  return (
    <button className="post-buttons like-btn" onClick={() => likePostById()}> 
      <span className="like-bg"></span>
      <img src="/assets/icons/post/thumb.svg" alt="Like post"/> 
    </button>
  )
}

export default LikePost;