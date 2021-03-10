import React, { useState } from 'react'
import { Link } from "react-router-dom"
// Components 
import Comment from "../comments/Comment";
import FormatTimestamp from "../../formatTime/FormatTimestamp"
import LikePost from "../like/LikePost";
// Redux
import { connect, ConnectedProps } from "react-redux";
interface ComponentProps  {
  application : {
    options: string
  }
}
const mapState = (state: ComponentProps) => ({
  options: state.application.options,
})

const mapDispatch = {
  toggleOptions: (postId: string) => ({type: "PROJECT_OPTIONS", payload: postId}),
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
      creatorName: string
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


const UsersPost = ({ post, options, toggleOptions }: Props ) => {
  const [ postIdForComment, setIdForComments ] = useState(0)

  const toggleOptionsMenu = (id: number) => {
    if(options === "") {
      toggleOptions("dssd")
    } else {
      toggleOptions("")
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
          <Link to={`/profile/${post.post.creatorId}`} className="post-name post-user">{post.post.creatorName}</Link>
          <FormatTimestamp timestamp={post.post.created} />
        </span> 
        <span className="post-btn-wrapper"> 
          <LikePost id={post.post.id} />
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
  )
}

export default connector(UsersPost);