
import { 
  Workspace,
  WorkspaceTypes,
  INIT_AND_EXIT_LYRIC_CREATION,
  DELETE_LYRIC,
  DELETE_TAB,
  INIT_AND_EXIT_TAB_CREATION,
} from "../../actions/workspace/types"

const intialState: Workspace = {
  lyrics : {
    create: false,
    delete: false,
    id: 0
  },
  tabs: {
    create: false,
    delete: false
  },
}

export const workspace = (state: Workspace = intialState, action : WorkspaceTypes) => {
const { type, payload } = action;

switch(type) {
  case INIT_AND_EXIT_LYRIC_CREATION : 
    return {
      ...state,
      lyrics : {
        create : payload
      },
      tabInit : false,
    }
 case INIT_AND_EXIT_TAB_CREATION : 
    return {
      ...state,
      lyrics : {
        ...state.lyrics,
        create : false
      },
      tabs :{
        ...state.tabs,
        create : payload,
      }
    }
  case DELETE_LYRIC : 
    return {
      ...state,
      lyrics : {
        ...state.lyrics,
        delete : payload
      },
      tabs : {
        ...state.tabs,
        delete : false
      }
    }
  case DELETE_TAB :
    return {
      ...state,
      lyrics : {
        ...state.lyrics,
        delete : false
      },
      tabs : {
        ...state.tabs,
        delete : payload
      }
    }
  // case SET_LYRIC_ID : 
  //   return {
  //     ...state,
  //     lyrics : {
  //       ...state.lyrics,
  //       id : payload
  //     }
  //   }
  default :
    return state;
}
}