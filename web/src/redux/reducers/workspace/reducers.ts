
import { 
  Workspace,
  WorkspaceTypes,
  INIT_AND_EXIT_LYRIC_CREATION,
  DELETE_LYRIC,
  DELETE_TAB,
  DELETE_TRACK,
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
  tracks :{
    delete: false
  }
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
      tabs :{
        ...state.tabs,
        create : false,
      }
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
      },
      tracks : {
        ...state.tracks,
        delete : false
      },
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
      },
      tracks : {
        ...state.tracks,
        delete : false
      },
    }
    case DELETE_TRACK :
      return {
        ...state,
        lyrics : {
          ...state.lyrics,
          delete : false
        },
        tabs : {
          ...state.tabs,
          delete : false
        },
        tracks : {
          ...state.tracks,
          delete : payload
        },
      }
  default :
    return state;
}
}