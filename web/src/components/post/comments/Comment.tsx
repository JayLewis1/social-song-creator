import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// GraphQL
import { useMutation, useQuery } from "@apollo/client";
import { COMMENT_ON_POST, DELETE_COMMENT } from "../../../graphql/mutations";
import { GET_COMMENTS, MY_ACCOUNT, USER_BY_POST_ID } from "../../../graphql/queries";
// Components 
import Options from "../options/Options";
import DeleteComment from "../functions/DeleteComment";
// Redux
import { connect, ConnectedProps } from "react-redux";
interface ComponentProps  {
  posts : {
    options: boolean
    postDelete: boolean
    commentDelete: boolean
  }
}
const mapState = (state: ComponentProps) => ({
  options: state.posts.options,
  postDelete: state.posts.postDelete,
  commentDelete: state.posts.commentDelete
})

const mapDispatch = {
  activatePlaybar : (payload: boolean) => ({ type: "OPEN_PLAYBAR", payload: payload }),
  assignTrack : (payload: object) => ({type: "ASSIGN_TRACK", payload: payload}),
  togglePostOptions: (payload: boolean) => ({type: "TOGGLE_POST_OPTIONS", payload}),
}

const connector = connect(mapState, mapDispatch)
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  postId: number
}
const Comment = ({postId, options, commentDelete, togglePostOptions}: Props) => {
  const [ formComment, setFormComment] = useState("")
  const [ disableButton, setDisabled] = useState(true)
  const [selectId, setSelectedId] = useState(0);
  const [comment] = useMutation(COMMENT_ON_POST);
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const { data: userData, loading : userLoading } = useQuery(USER_BY_POST_ID,{
    variables: {
      postId: postId
    }
  });
  const { data: meData, loading : meLoading } = useQuery( MY_ACCOUNT);
  const { data, loading } = useQuery(GET_COMMENTS, {
    variables: {
      postId: postId
    }
  });

  useEffect(() => {
    if(formComment === ""){
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  },[formComment, ])
  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormComment(e.target.value);
  } 
  const onSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     comment({
      variables: {
        comment: formComment,
        postId
      },
      update: (cache, { data: { comment } }) => {
        // Update cache with the response comment data which
        // should be all comments for the selected post
         cache.writeQuery({ 
          query: GET_COMMENTS, 
          variables : {
              postId: postId
            },
          data : {
            getComments : comment
          }
        });
      }
    }).then((res) => setFormComment(""))
    .catch(err => console.log(err))
  }
  const formatTimestamp = (timestamp: any) => {
    const splitDateAndTime = timestamp.split("T")
    const date = splitDateAndTime[0].split("-");
    const time =  splitDateAndTime[1].split(":");
    const hourAndMin = time[0] + ":" + time[1];
    var month;
    switch(date[1]){
      case "01" : month = "January"; break;
      case "02" : month = "Febraury"; break;
      case "03" : month = "March"; break;
      case "04" : month = "April"; break;
      case "05" : month = "May"; break;
      case "06" : month = "June"; break;
      case "07" : month = "July"; break;
      case "08" : month = "August"; break;
      case "09" : month = "September"; break;
      case "10" : month = "October"; break;
      case "11" : month = "November"; break;
      case "12" : month = "December"; break;  
    };
    const year = date[0].split("")
    const yearAbbr = year[2] + year[3];
    const fullDate = date[2] +  " " + month + " " + yearAbbr;
    const displayTimestamp = fullDate + " at " + hourAndMin;
     return displayTimestamp;
 }

 const deleteCommentById = (id: number) => {
   deleteComment({
     variables: {
       commentId: id,
       postId
     }, 
     update: (cache, { data : {deleteComment} }) => {
      cache.writeQuery({ 
        query: GET_COMMENTS, 
        variables : {
            postId: postId
          },
        data : {
          getComments : deleteComment
        }
      });
     }
   })
 }

 const toggleOptionsMenu = (id: number) => {
  if(options === true) {
    setSelectedId(0);
    togglePostOptions(false)
  } else {
    setSelectedId(id);
    togglePostOptions(true)
  }
}
  return (
    <div  className="comments-container">
      <form className="comment-form" onSubmit={(e) => onSubmit(e)}>
        <span className="input-wrapper">
          <label htmlFor="comment">Why not make a comment?</label>
          <span className="input-span">
          <textarea value={formComment} placeholder="Write your comment here ..." onChange={(e) => onChange(e)} style={formComment === "" ? { minHeight: "40px" } : { minHeight: "150px" } } />
          <input type="submit" value="Send" disabled={disableButton === true}/>
          </span>
        </span>  
      </form>  
      <div>
        <ul>
        {!loading && data && data.getComments && data.getComments.map((comment: any) => 
           <li key={comment.id} className="comment">
             <div className="comment-top">
              <div className="avatar">
                <img src={comment.avatar} alt="Avatar"/>
              </div>
              <div className="name-date-wrap">
              { !meLoading && meData && meData.me && meData.me.id === comment.userId ? 
                <Link to={`/profile/${comment.userId}`} className="name">You</Link> 
                :   <Link to={`/profile/${comment.userId}`} className="name">{comment.userName}</Link> 
                }
                <p className="date">{formatTimestamp(comment.created)}</p>
              </div>
        
              { !meLoading && !userLoading && userData && userData.userByPostId &&  userData.userByPostId.id === meData.me.id ? 
              // <button className="delete-comment" onClick={() => deleteCommentById(comment.id)}>
              //     <img src="/assets/icons/workspace/delete.svg" alt="Delete post"/>
              // </button> 
              <span className="post-btn-wrapper">
                <button className="post-buttons" onClick={() => toggleOptionsMenu(comment.id)}>
                  <img src="/assets/icons/post/options.svg" alt="Project options"/>
                </button>
                </span>
              : 
              !meLoading && meData && meData.me &&  meData.me.id === comment.userId && 
              // <button className="delete-comment" onClick={() => deleteCommentById(comment.id)}>
              //     <img src="/assets/icons/workspace/delete.svg" alt="Delete post"/>
              // </button>
              <span className="post-btn-wrapper">
              <button className="post-buttons" onClick={() => toggleOptionsMenu(comment.id)}>
                <img src="/assets/icons/post/options.svg" alt="Project options"/>
              </button>
              </span>}
             </div>
            <p className="comment-context">{comment.comment}</p>
            { selectId === comment.id && options === true && 
                      <Options type="comment" />}
            { commentDelete === true && selectId === comment.id && <DeleteComment postId={postId} commentId={comment.id}/>}
           </li>
        ) }
        </ul>
      </div>
    </div>
  )
}

export default connector(Comment);