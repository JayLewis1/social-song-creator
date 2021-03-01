export const SELECTED_POST_ID = "SELECTED_POST_ID";
export const SET_DELETE_COMPONENT = "SET_DELETE_COMPONENT";

export interface Post  {
  postId: number
  postDelete : boolean
}

interface setPostId {
  type: typeof SELECTED_POST_ID
  payload: Post
}

interface validatePostDelete {
  type: typeof SET_DELETE_COMPONENT
  payload: Post
}

export type PostTypes = setPostId | validatePostDelete;