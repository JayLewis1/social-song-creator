import React, { Fragment, useEffect } from 'react'
import { Link } from "react-router-dom"
// GraphQL
import { useMutation } from "@apollo/client";
import { GET_COMMENTS } from "../../../graphql/queries";
import { DELETE_COMMENT } from "../../../graphql/mutations";
// Redux
import { connect, ConnectedProps } from "react-redux";

interface ComponentProps {

}

const mapState = (state: ComponentProps) => ({

})

const mapDispatch = {
  toggleRemoveComment: (payload: boolean) => ({type: "TOGGLE_REMOVE_COMMENT", payload})
}

const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  postId: number
  commentId: number
};

const DeleteComment = ({commentId, postId, toggleRemoveComment} : Props) => {
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const deleteCommentById = async () => {
    // Remove Comment and update cache
    await deleteComment({
      variables: {
        commentId: commentId,
        postId
      }, 
      update: (cache, { data : {deleteComment} }) => {
       cache.writeQuery({ 
         query: GET_COMMENTS, 
         variables : {
             postId
           },
         data : {
           getComments : deleteComment
         }
       });
      }
    })
    try {
      toggleRemoveComment(false);
    } catch(err){
      console.log(err);
    }
    }
  return (
    <div className="result-component">
      <div className="wrapper">
            <p>Are you sure you want to delete this comment?</p> 
            <span className="btn-wrapper">
              <button onClick={() => deleteCommentById()} className="delete-btn">
                <span className="btn-bg"></span>
                <p>Delete</p>
              </button>
              <button onClick={() =>    toggleRemoveComment(false)} >
                <p>Cancel</p>
              </button>
            </span>
      </div>
    </div>
  )
}
export default connector(DeleteComment)