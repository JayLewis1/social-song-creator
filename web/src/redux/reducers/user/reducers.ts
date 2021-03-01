import {
  User,
  UserTypes,
  USER_AUTHENTICATED,
  CLEAR_USER
} from "../../actions/user/types";

const intialState = {
  authenticated : false,
  user: {}
}

export const user = (state: User = intialState, action: UserTypes) => {
  const { type, payload } = action;
  switch(type) {
    case USER_AUTHENTICATED :
      return {
        ...state,
        authenticated : true,
        user : payload
    }
    case CLEAR_USER : 
      return {
        ...state,
        authenticated : false,
        user : {}
      }
    default : 
      return state;
  }
}