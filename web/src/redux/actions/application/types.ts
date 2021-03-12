export const SET_APP_LOCATION = "SET_APP_LOCATION";
export const CLOSE_POST_PANEL = "CLOSE_POST_PANEL";
export const CLOSE_SETTINGS_PANEL = "CLOSE_SETTINGS_PANEL";
export const TOGGLE__NOTIFICATIONS = "TOGGLE__NOTIFICATIONS";
export const INIT_PROJECT = "INIT_PROJECT";
export const TOGGLE__CONTRIBUTORS = "TOGGLE__CONTRIBUTORS";
export const TOGGLE_SEARCH = "TOGGLE_SEARCH";
export const TOGGLE_CREATE_PANEL = "TOGGLE_CREATE_PANEL";
export const RESULT_TOGGLE = "RESULT_TOGGLE";
export const NAVBAR_TOGGLE = "NAVBAR_TOGGLE";

export interface Application {
  location : string
  postPanel : boolean
  projectPanel: boolean
  settingsPanel: boolean
  notificationPanel: boolean
  contributorsPanel: boolean
  searchPanel: boolean
  createPanel: boolean
  navbar: boolean
  result: {
    show: boolean
    success: boolean
    type: string
  }
}

interface setAppLocation  {
  type:typeof SET_APP_LOCATION,
  payload: Application
}


interface closePostPanel  {
  type:typeof CLOSE_POST_PANEL,
  payload: Application
}

interface intialiseProject {
  type: typeof INIT_PROJECT
  payload: Application
}

interface closeSettingsPanel  {
  type:typeof CLOSE_SETTINGS_PANEL,
  payload: Application
}

interface toggleNotification  {
  type:typeof TOGGLE__NOTIFICATIONS,
  payload: Application
}

interface toggleContributors {
  type: typeof TOGGLE__CONTRIBUTORS,
  payload : Application
}

interface toggleSearch {
  type: typeof TOGGLE_SEARCH,
  payload : Application
}
interface toggleCreatePanel {
  type: typeof TOGGLE_CREATE_PANEL,
  payload : Application
}

interface toggleResult {
  type: typeof RESULT_TOGGLE,
  payload: Application
}

interface toggleNavbar {
  type: typeof NAVBAR_TOGGLE,
  payload: Application
}

export type ApplicationTypes = setAppLocation | closePostPanel | closeSettingsPanel | intialiseProject |toggleNotification |toggleContributors | toggleSearch | toggleCreatePanel | toggleResult | toggleNavbar;