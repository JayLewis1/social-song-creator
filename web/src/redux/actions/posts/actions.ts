import {
  PostTypes,
  Post,
  SELECTED_POST_ID,
  SET_DELETE_COMPONENT
} from "./types";

import { Dispatch } from 'redux';

export const setPostId = (postId: Post) => (dispatch: Dispatch<PostTypes>) => {
  dispatch({
    type: SELECTED_POST_ID,
    payload: postId
  })
} 

export const validatePostDelete = (payload: Post) => (dispatch: Dispatch<PostTypes>) => {
  dispatch({
    type: SET_DELETE_COMPONENT,
    payload: payload
  })
} 