import React, { useState } from 'react'
import { Link } from "react-router-dom"
// Components 
import Comment from "../comments/Comment";
import FormatTimestamp from "../../formatTime/FormatTimestamp"
import Options from "../options/Options";
import DeletePost from "../functions/DeletePost"
// Redux
import { connect, ConnectedProps } from "react-redux";
interface ComponentProps  { 
posts : {
  options: boolean
  postDelete: boolean
}
}
const mapState = (state: ComponentProps) => ({
  options: state.posts.options,
  postDelete: state.posts.postDelete
})

const mapDispatch = {
  togglePostOptions: (payload: boolean) => ({type: "TOGGLE_POST_OPTIONS", payload}),
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  post : { 
    post: {
      id: number
      creatorId : string
      avatar: string
      created: number
      content: string
    }
    project: {
      id: string
      mainTrack: string
    }
    comments: [{
      id: number
      postId:  number
      userId:  number
      userName: string
      comment: string
      created : number
      avatar : string
    }]
    likes : [{
      id : number
      postId: number
      userId: string
    }]
  }
}


const MyPost = ({ post, options, postDelete, togglePostOptions }: Props ) => {
  const [selectId, setSelectedId] = useState(0);
  const [ postIdForComment, setIdForComments ] = useState(0)

  const toggleOptionsMenu = (id: number) => {
    if(options === true) {
      setSelectedId(0);
      togglePostOptions(false)
    } else {
      setSelectedId(id);
      togglePostOptions(true)
    }
  }
  const openComments = (postId: number) => {
    if(postIdForComment === postId) {
     setIdForComments(0)
    } else {
     setIdForComments(postId)
    }
  }

  return (
    <div className="post">
      <div className="post-top-wrapper">
        <div className="avatar">
          <img src={post.post.avatar} alt="User's Avatar"/>
        </div>
        <span className="post-name-wrapper">
          <Link to={`/profile/${post.post.creatorId}`} className="post-name post-user">You</Link>
          <FormatTimestamp timestamp={post.post.created} />
        </span>  
        <span className="post-btn-wrapper"> 
          <button className="post-buttons" onClick={() => toggleOptionsMenu(post.post.id)}>
            <img src="/assets/icons/post/options.svg" alt="Project options"/>
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
    { selectId === post.post.id && options === true && 
      <Options type="post"/>}
    { postDelete === true && selectId === post.post.id && <DeletePost postId={post.post.id}/>}
  </div> 
  )
}

export default connector(MyPost);