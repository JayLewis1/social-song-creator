import { 
  Project,
  ProjectTypes,
  STORE_PROJECT,
  SHOW_PROJECT_DELETE_PANEL,
  SELECTED_PROJECT_ID,
  REMOVE_CONTRIBUTOR,
  PROJECT_OPTIONS,
  PROJECT_RESULT
} from "../../actions/project/types";

const intialState: Project = {
  currentProject: "",
  deleteProject: false,
  selectedProject: "",
  options: "",
  contributor:  {
    remove: false,
    projectId: "",
    userId: -1
  },
  result : {
    toggle: false,
    type: "",
    selectedId: ""
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
    case SELECTED_PROJECT_ID : 
        return {
          ...state,
          selectedProject: payload
        }
    case REMOVE_CONTRIBUTOR : 
        return {
          ...state,
          contributor: payload
        }
    case PROJECT_OPTIONS : 
        return {
          ...state,
          options: payload
        }
    case PROJECT_RESULT : 
        return {
          ...state,
          result: payload
        }
    default :
        return state;
  }
}
