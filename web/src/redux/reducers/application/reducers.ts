import { 
  ApplicationTypes,
  Application,
  CLOSE_POST_PANEL,
  CLOSE_SETTINGS_PANEL,
  INIT_PROJECT,
  SET_APP_LOCATION, 
  TOGGLE__NOTIFICATIONS,
  TOGGLE__CONTRIBUTORS,
  TOGGLE_SEARCH,
TOGGLE_CREATE_PANEL} from "../../actions/application/types";

const initialState: Application = {
  location : "",
  postPanel: false,
  projectPanel: false,
  settingsPanel: false,
  notificationPanel: false,
  contributorsPanel: false,
  searchPanel: false,
  createPanel: false,
}

export const applicationReducer = (state: Application = initialState, action: ApplicationTypes ) => {
  const { type, payload } = action;

  switch(type) {
    case SET_APP_LOCATION: 
      return { 
        ...state,
        location : payload
      }
    case CLOSE_POST_PANEL : 
      return {
        ...state,
        postPanel: payload,
        projectPanel: false,
        settingsPanel: false,
        notificationPanel: false,
        contributorsPanel: false,
        searchPanel: false,
        createPanel: false
      }
    case CLOSE_SETTINGS_PANEL: 
      return {
        ...state,
        postPanel: false,
        projectPanel: false,
        settingsPanel: payload,
        notificationPanel: false,
        contributorsPanel: false,
        searchPanel: false,
        createPanel: false
      }
    case TOGGLE__NOTIFICATIONS: 
      return {
        ...state,
        postPanel: false,
        projectPanel: false,
        settingsPanel: false,
        notificationPanel: payload,
        contributorsPanel: false,
        searchPanel: false,
        createPanel: false
      }
    case INIT_PROJECT : 
        return {
          ...state, 
          postPanel: false,
          projectPanel: payload,
          settingsPanel: false,
          notificationPanel: false,
          contributorsPanel: false,
          searchPanel: false,
          createPanel: false
        }
      case TOGGLE__CONTRIBUTORS: 
        return {
          ...state,
          postPanel: false,
          projectPanel: false,
          settingsPanel: false,
          notificationPanel: false,
          contributorsPanel: payload,
          searchPanel: false,
          createPanel: false
        }
    case TOGGLE_SEARCH : 
      return {
        ...state,
        postPanel: false,
        projectPanel: false,
        settingsPanel: false,
        notificationPanel: false,
        contributorsPanel: false,
        searchPanel: payload,
        createPanel: false
      }
      case TOGGLE_CREATE_PANEL : 
      return {
        ...state,
        postPanel: false,
        projectPanel: false,
        settingsPanel: false,
        notificationPanel: false,
        contributorsPanel: false,
        searchPanel: false,
        createPanel: payload
      }
    default :
    return state
  }
}