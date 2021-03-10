import React from 'react'
// Redux
import { connect, ConnectedProps } from "react-redux";

const mapDispatch = {
  togglePostOptions: (payload: boolean) => ({type: "TOGGLE_POST_OPTIONS", payload}),
  validatePostDelete: (payload:boolean) => ({type: "SET_DELETE_COMPONENT", payload: payload}),
  toggleRemoveComment: (payload: boolean) => ({type: "TOGGLE_REMOVE_COMMENT", payload})
}

const connector = connect(null, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>
type Props = PropsFromRedux & {
  type: string
}

const Options = ({ type, togglePostOptions, validatePostDelete,
  toggleRemoveComment}:Props) => {

  const setDeletePost = () => {
    if(type === "post") {
      validatePostDelete(true);
    }
    if(type === "comment") {
      toggleRemoveComment(true);
    }
  }

  return (
    <div className="options-container">
        <div className="options">
           <button className="delete-btn" onClick={() => setDeletePost()}>Delete</button>
          <button onClick={() => togglePostOptions(false)}>Cancel</button>
        </div>
    </div>
  )
}

export default connector(Options);