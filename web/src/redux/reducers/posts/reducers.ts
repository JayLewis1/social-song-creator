import {
  PostTypes,
  Post,
  SELECTED_POST_ID,
  SET_DELETE_COMPONENT
} from "../../actions/posts/types";

const initialState = {
  postId : 0,
  postDelete: false
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
    default :
      return state;
  }
} 