export const SELECTED_POST_ID = "SELECTED_POST_ID";
export const SET_DELETE_COMPONENT = "SET_DELETE_COMPONENT";
export const TOGGLE_POST_OPTIONS = "TOGGLE_POST_OPTIONS"
export const TOGGLE_REMOVE_COMMENT = "TOGGLE_REMOVE_COMMENT"

export interface Post  {
  postId: number
  postDelete : boolean
  options: boolean
  commentDelete: boolean
}

interface setPostId {
  type: typeof SELECTED_POST_ID
  payload: Post
}

interface validatePostDelete {
  type: typeof SET_DELETE_COMPONENT
  payload: Post
}
interface togglePostOptions {
  type: typeof TOGGLE_POST_OPTIONS
  payload: Post
}
interface toggleRemoveComment {
  type: typeof TOGGLE_REMOVE_COMMENT,
  payload: Post
}

export type PostTypes = setPostId | validatePostDelete | togglePostOptions |toggleRemoveComment;