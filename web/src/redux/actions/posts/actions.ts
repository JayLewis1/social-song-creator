import {
  PostTypes,
  Post,
  SELECTED_POST_ID,
  SET_DELETE_COMPONENT,
  TOGGLE_POST_OPTIONS,
  TOGGLE_REMOVE_COMMENT
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


export const togglePostOptions = (payload: Post) => (dispatch: Dispatch<PostTypes>) => {
  dispatch({
    type: TOGGLE_POST_OPTIONS,
    payload: payload
  })
} 

export const toggleRemoveComment = (payload: Post) => (dispatch: Dispatch<PostTypes>) => {
  dispatch({
    type: TOGGLE_REMOVE_COMMENT,
    payload: payload
  })
} 