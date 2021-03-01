import React, { Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
// GraphQL
import { useQuery } from "@apollo/client";
import { MY_POSTS, MY_ACCOUNT } from "../../graphql/queries";
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
  closePostPanel : (payload: boolean) => ({ type: "CLOSE_POST_PANEL", payload: payload }),
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux;

const MyPosts = ({ user, postId, postDelete, setPostId, validatePostDelete, closePostPanel }:Props) => {
  const [ postIdForComment, setIdForComments ] = useState(0)
  const { data, loading } = useQuery(MY_POSTS);
  const { data: meData, loading: meLoading } = useQuery(MY_ACCOUNT);

  useEffect(() => {
    return () => {
      validatePostDelete(false);
      setPostId(-1);
    }
  },[])
  
  if(loading) {
    return <div>Loading...</div>
  }
  
  const toggleDeletePopUp = (id: number) => {
    validatePostDelete(true);
    setPostId(id);
  }

const openComments = (postId: number) => {
  if(postIdForComment === postId) {
   setIdForComments(0)
  } else {
   setIdForComments(postId)
  }
}
const openPlaybarAndAssignTrackId = () => {
  // activatePlaybar(true);
  console.log("open playbar")
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
                  <div className="post">
                  <div className="post-top-wrapper">
                 <div className="avatar">
                 <img src={post.post.avatar} alt="User's Avatar"/>
                 </div>
                     <span className="post-name-wrapper">
                     <p className="post-name post-user">You <span className="shared-project-span">Shared project</span></p>
                     <FormatTimestamp timestamp={post.post.created} />
                   </span> 
      
                 <span className="post-btn-wrapper">
                   <button className="post-buttons" onClick={() => toggleDeletePopUp(post.post.id)}>
                    <img src="/assets/icons/workspace/delete.svg" alt="Delete post"/>
                   </button> 
                 </span>
               </div>
                 <div className="post-project-wrapper">
                   <button>
                     <img src="/assets/icons/post/play.svg" alt="Play button"/>
                   </button>
                   <p className="project-name">{post.post.content}</p>
                           <Link className="project-name-link" to={`/workspace/${post.project.id}`}>See project</Link>
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
                      <span className="post-name-wrapper">
                        <p className="post-name post-user">You</p>
                       <FormatTimestamp timestamp={post.post.created} />
                      </span>
              <span className="post-btn-wrapper">
                <button className="post-buttons" onClick={() => toggleDeletePopUp(post.post.id)}>
                  <img src="/assets/icons/workspace/delete.svg" alt="Delete post"/>
                </button> 
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
          </div>
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

export default connector(MyPosts);