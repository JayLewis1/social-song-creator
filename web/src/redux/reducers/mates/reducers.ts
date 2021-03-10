
import { 
  MatesTypes, 
  Mates, 
  MATES_OPTIONS,
  MATES_REMOVE } from "../../actions/mates/types";

  const initialState: Mates = {
    options: false,
    remove: false
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
      default: 
      return state
    }
  }