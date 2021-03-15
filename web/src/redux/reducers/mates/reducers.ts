
import { 
  MatesTypes, 
  Mates, 
  MATES_OPTIONS,
  MATES_REMOVE,
  MATES_ADD,
  MATES_SELECTED_ID } from "../../actions/mates/types";

  const initialState: Mates = {
    options: false,
    remove: false,
    add: false,
    id: 0
  }

  export const matesReducer = (state: Mates = initialState, action: MatesTypes ) => {
    const { type, payload } = action;
    switch(type) {
      case MATES_OPTIONS:
        return {
          ...state,
          options: payload
        }
      case MATES_REMOVE:
        return {
          ...state,
          remove: payload
        }
      case MATES_ADD : 
        return {
          ...state,
          add: payload
        }
      case MATES_SELECTED_ID :
          return {
            ...state,
            id : payload
          }
      default:  
      return state
    }
  }