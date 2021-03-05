import { Playbar, PlaybarTypes, OPEN_PLAYBAR, ASSIGN_TRACK } from '../../actions/playbar/types';


const initialState: Playbar = {
  status  : false,
  data: {
    id: "",
    projectId: "",
    trackName: ""
  }
}

export const playbarStatus = (state:Playbar = initialState, action: PlaybarTypes ) => {
  const { type, payload } = action;
  switch(type) {
    case OPEN_PLAYBAR: 
            return {
              ...state,
              status : payload
            }
    case ASSIGN_TRACK:
            return {
              ...state,
              data: payload
            }
    default : 
            return state;
            
  }
}
