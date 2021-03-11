import React, { useState, useEffect } from 'react'
import { useLocation } from "react-router-dom";
// GraphQL
import { useMutation } from "@apollo/client";
import { CREATE_POST } from "../../../graphql/mutations";
import { MY_POSTS, FEED_POSTS, ALL_POSTS } from "../../../graphql/queries";
// Redux 
import { connect, ConnectedProps } from "react-redux";
// Component props types
interface ComponentProps {
  application : {
    postPanel : boolean
  }
 }
 
 const mapState = (state: ComponentProps) => ({
   postPanel : state.application.postPanel
 })
 const mapDispatch = {
   closePostPanel : (payload: boolean) => ({ type: "CLOSE_POST_PANEL", payload: payload }),
 }
 
 const connector = connect(mapState, mapDispatch)
 type PropsFromRedux = ConnectedProps<typeof connector>;
 type Props = PropsFromRedux;
 
const CreatePost = ({closePostPanel} : Props) => {
    const [oldLocation , setLocation] = useState("")
    const [post, setPostContent] = useState("");
    const [createPost] = useMutation(CREATE_POST)
    // Find location from the pathname
    var location = useLocation();
    var pathName = location.pathname
  
    useEffect(() => {
      // Check to see if the route has changed
      // If so close the create panel
      if(oldLocation !== "" &&  pathName !== oldLocation) {
        closePostPanel(false)
        setLocation(pathName)
      } else {
        setLocation(pathName)
      }
    }, [pathName, oldLocation, closePostPanel])

    const onSubmit =  (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const postConent = post;
      // Create the post and update all caches that will display your new  post
      createPost({
        variables: { content : postConent },
        update: (cache, { data: { createPost } }) => {
          // Cache for my posts : Update cache to show on profile in realtime
          const cacheMyData: any = cache.readQuery({ query: MY_POSTS });
          // Check to see if there is a cache
          if(cacheMyData !== null) {
          const udatedMyCache = [...cacheMyData.myPosts , createPost];
          cache.writeQuery({ 
            query: MY_POSTS,
            data : {
              myPosts : udatedMyCache
            } 
           });
          }
          // Cache for feed posts :  Used on /feed route
          const cacheFeedData: any = cache.readQuery({ query: FEED_POSTS });
          // Check to see if there is a cache
          if(cacheFeedData !== null) {
          const udatedFeedCache = [...cacheFeedData.myFeed , createPost];
          cache.writeQuery({ 
            query: FEED_POSTS,
            data : {
              myFeed : udatedFeedCache
            } 
           });
          }
          // Cache for all posts : Used on /discover route
          const cacheAllData: any = cache.readQuery({ query: ALL_POSTS });
           // Check to see if there is a cache
          if(cacheAllData !== null) {
          const updatedAllCache = [...cacheAllData.allPosts , createPost];
           cache.writeQuery({ 
            query: ALL_POSTS,
            data : {
              allPosts : updatedAllCache
            } 
           });
          }
        }
      }).then((res) => {
          // If successful then clear state and close the post panel
          setPostContent("");
          closePostPanel(false);
        })
        .catch(err => console.log(err))
    }

    return (
       <div className="create-container">
        <span className="panel-top">
              <h4>Create Post</h4>
              <button onClick={() => closePostPanel(false)} className="exit-btn">
              <img src="/assets/icons/plus/exit-dark.svg" alt="Exit panel"/>
            </button>
        </span>
          <form  className="create-form" onSubmit={(e) => onSubmit(e)}>
          <span className="input-wrapper">
              <label htmlFor="projectName">Name your project</label>
            <textarea 
              name="post" 
              id="post"
              value={post}
              placeholder="Whats on your mind?"
              onChange={(e:any) => setPostContent(e.target.value)}
              />
          </span>
            <input type="submit" className="create-submit" value="Post"/>     
            <button onClick={() => closePostPanel(false)} className="create-cancel">Cancel</button>
         </form>
       </div> 
       
    );
}

export default connector(CreatePost);