import React, { useState, Fragment, useEffect } from 'react'
import { Link } from "react-router-dom";
// GraphQL
import { useQuery, useMutation } from "@apollo/client";
import {MY_ACCOUNT, FEED_POSTS} from "../../graphql/queries";
import { LIKE_POST } from "../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";
// Components
import DeletePost from "./DeletePost";
import Comment from "./Comment";
import FormatTimestamp from "../formatTime/FormatTimestamp"
import ContributorAvatar from "../project/ContributorAvatar";

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
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
  assignTrack : (payload: object) => ({type: "ASSIGN_TRACK", payload: payload}),
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux;

const FeedPosts = ({ user, postId, postDelete, setPostId, validatePostDelete, activatePlaybar, assignTrack }:Props) => {  
  const [ postIdForComment, setIdForComments ] = useState(0)
  const [likePost] = useMutation(LIKE_POST);
  const { data, loading, error } = useQuery(FEED_POSTS);
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);

  useEffect(() => {
    return () => {
      validatePostDelete(false);
      setPostId(-1);
    }
  },[])

  if(loading) {
    console.log("loading");
    return <div>Loading...</div>
  }
  if(error) {
    console.log(error)
    return <div>error!</div>
  }
  const toggleDeletePopUp = (id: number) => {
    validatePostDelete(true);
    setPostId(id);
  }

  const likePostById = (postId: number) => {
    likePost({ 
      variables : { postId },
      update: (cache, { data: { likePost } }) => {
        // Read the query cache
        const cacheLikeData : any = cache.readQuery({query : FEED_POSTS })  
        var index: any;
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

  const openPlaybarAndAssignTrackId = (trackId: string, projectId: string) => {
    activatePlaybar(true);
    const dataObject = {
      id: trackId,
      projectId,
      trackName: ""
    }
    assignTrack(dataObject)
  }
  
    return (
     <Fragment>
        {!loading && data && data.myFeed.length !== 0  ?
              <ul>
                {data.myFeed.map((post: any) => 
                <li key={post.post.id}>
                  { post.project !== null ?
                     <div className="post">
                       <div className="post-top-wrapper">
                      <div className="avatar">
                      <img src={post.post.avatar} alt="User's Avatar"/>
                      </div>
                      { !meLoading && meData && meData.me && meData.me.id === post.post.creatorId ?
                          <span className="post-name-wrapper">
                          <Link to={`/profile/${post.post.creatorId}`} className="post-name post-user">You <span className="shared-project-span">Shared project</span></Link>
                          <FormatTimestamp timestamp={post.post.created} />
                        </span>  :
                         <span className="post-name-wrapper">
                         <Link to={`/profile/${post.post.creatorId}`} className="post-name post-user">{post.post.creatorName} <span className="shared-project-span">Shared project</span></Link>
                         <FormatTimestamp timestamp={post.post.created} />
                       </span> 
                      }  
                      <span className="post-btn-wrapper">
                        { !meLoading && meData && meData.me && meData.me.id=== post.post.creatorId ? 
                        <button className="post-buttons" onClick={() => toggleDeletePopUp(post.post.id)}>
                         <img src="/assets/icons/workspace/delete.svg" alt="Delete post"/>
                        </button> :
                          <button className="post-buttons" onClick={() => likePostById(post.post.id)}> 
                            <img src="/assets/icons/post/like.svg" alt="Like post"/> 
                          </button>}
                      </span>
                    </div>
                      <div className="post-project-wrapper">
                        <button onClick={() => openPlaybarAndAssignTrackId(post.project.mainTrack, post.project.id)}>
                          <img src="/assets/icons/post/play.svg" alt="Play button"/>
                        </button>
                          <p className="project-name">{post.post.content}</p>
                          <Link className="project-name-link" to={`/workspace/${post.project.id}`}>See project</Link>
                         {/* <Link className="project-name-link" to={`/workspace/${post.project.id}`}>{post.post.content}</Link> */}
                      </div>
                      <div className="contributors">
                        <span className="flex-wrapper">
                        <p>Contributors</p>
                          <span className="contributors-avatars">
                          <ContributorAvatar projectId={post.project.id} />
                          </span>
                        </span>   
                        </div>

                     <div className="post-bottom-wrapper">
                         <button onClick={() => openComments(post.post.id)} className="comment-button">Comments</button>
                         <p className="comments-length">{post.comments.length}</p>
                       <div className="likes"> 
                         <img src="/assets/icons/post/thumb.svg" alt="Likes"/>
                         <p>{post.likes.length}</p>
                       </div>
                     </div>
                     {postIdForComment === post.post.id ? <Comment postId={post.post.id} /> : null}
                     { postDelete === true &&  postId === post.post.id && <DeletePost />}
                   </div> 
                      :
                  <div className="post">
                    <div className="post-top-wrapper">
                      <div className="avatar">
                      <img src={post.post.avatar} alt="User's Avatar"/>
                      </div>
                      { !meLoading && meData && meData.me && meData.me.id === post.post.creatorId ?
                          <span className="post-name-wrapper">
                          <Link to={`/profile/${post.post.creatorId}`} className="post-name post-user">You</Link>
                          <FormatTimestamp timestamp={post.post.created} />
                        </span>  :
                         <span className="post-name-wrapper">
                         <Link to={`/profile/${post.post.creatorId}`} className="post-name post-user">{post.post.creatorName}</Link>
                         <FormatTimestamp timestamp={post.post.created} />
                       </span> 

                      }
                      
                      <span className="post-btn-wrapper">
                        { !meLoading && meData && meData.me && meData.me.id=== post.post.creatorId ? 
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
                    { postDelete === true &&  postId === post.post.id && <DeletePost />}
                  </div> }
                  </li> )}
              </ul> : 
              <div className="no-posts">
                <p>There are no posts on your feed. Check out the <Link to="/discover">Discover</Link> page and find some new mates. </p>
              </div> }
    </Fragment>
    );
}

export default connector(FeedPosts);