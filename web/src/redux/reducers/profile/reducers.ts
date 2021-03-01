import {
  ProfileTypes,
  Profile,
  SET_PROFILE,
  EDIT_NAME,
  EDIT_BIO,
  EDIT_INSTRUMENT
} from "../../actions/profile/types"

const initialState = {
  profileId: 0,
  editting: {
    names: false,
    bio: false,
    instruments: false
  }
}

export const profileReducer = (state: Profile = initialState, action:ProfileTypes )  => {
  const { type , payload } = action;

  switch(type) {
    case SET_PROFILE : 
          return {
            ...state,
            profileId: payload
          }
    case  EDIT_NAME: 
          return {
            ...state,
            editting: {
              names: payload,
              bio: false,
              instruments: false
            }
          }
    case  EDIT_BIO: 
          return {
            ...state,
            editting: {
              names: false,
              bio: payload,
              instruments: false
            }
          }
    case  EDIT_INSTRUMENT: 
          return {
            ...state,
            editting: {
              names: false,
              bio: false,
              instruments: payload,
            }
          }
    default :
          return state
  } 
}