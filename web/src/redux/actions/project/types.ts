export const STORE_PROJECT = "STORE_PROJECT";
export const SHOW_PROJECT_DELETE_PANEL = "SHOW_PROJECT_DELETE_PANEL"
export const SET_ID_FOR_DELETE = "SET_ID_FOR_DELETE";
export const REMOVE_CONTRIBUTOR = "REMOVE_CONTRIBUTOR";

export interface Project {
  currentProject: string,
  deleteProject: boolean,
  deleteId: string
  contributor:  {
    remove: boolean,
    projectId: string,
    userId: number
  }
}

interface storeProject {
  type: typeof STORE_PROJECT
  payload: Project
}

interface setDeleteProjectPanel {
  type: typeof SHOW_PROJECT_DELETE_PANEL
  payload: Project
}

interface setDeleteId {
  type: typeof SET_ID_FOR_DELETE
  payload: Project
}

interface removeContributor {
  type: typeof REMOVE_CONTRIBUTOR
  payload: Project
}

export type ProjectTypes =  storeProject | setDeleteProjectPanel | setDeleteId | removeContributor;