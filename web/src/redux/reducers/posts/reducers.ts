import {
  PostTypes,
  Post,
  SELECTED_POST_ID,
  SET_DELETE_COMPONENT,
  TOGGLE_POST_OPTIONS,
  TOGGLE_REMOVE_COMMENT
} from "../../actions/posts/types";

const initialState = {
  postId : 0,
  postDelete: false,
  options: false,
  commentDelete: false,
}

export const postReducer = (state: Post = initialState, action: PostTypes) => {
  const {type, payload} = action;

  switch(type) {
    case SELECTED_POST_ID :
      return {
        ...state,
        postId: payload
      }
    case SET_DELETE_COMPONENT:
        return {
          ...state,
          postDelete: payload
        }
    case TOGGLE_POST_OPTIONS:
        return{ 
          ...state,
          options: payload
        }
    case TOGGLE_REMOVE_COMMENT: 
        return {
          ...state,
          commentDelete: payload
        }
    default :
      return state;
  }
} 