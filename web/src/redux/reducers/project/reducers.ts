import { 
  Project,
  ProjectTypes,
  STORE_PROJECT,
  SHOW_PROJECT_DELETE_PANEL,
  SET_ID_FOR_DELETE,
  REMOVE_CONTRIBUTOR
} from "../../actions/project/types";

const intialState: Project = {
  currentProject: "",
  deleteProject: false,
  deleteId: "",
  contributor:  {
    remove: false,
    projectId: "",
    userId: -1
  }
}

export const project = (state:Project = intialState, action : ProjectTypes) => {
  const { type, payload } = action;

  switch(type) {
    case STORE_PROJECT : 
        return {
          ...state,
          initialised: true,
          currentProject: payload
        }
    case SHOW_PROJECT_DELETE_PANEL : 
        return {
          ...state,
          deleteProject: payload,
        }
    case SET_ID_FOR_DELETE : 
        return {
          ...state,
          deleteId: payload
        }
    case REMOVE_CONTRIBUTOR : 
        return {
          ...state,
          contributor: payload
        }
    default :
        return state;
  }
}
