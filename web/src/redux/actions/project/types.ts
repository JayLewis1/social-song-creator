export const STORE_PROJECT = "STORE_PROJECT";
export const SHOW_PROJECT_DELETE_PANEL = "SHOW_PROJECT_DELETE_PANEL"
export const SELECTED_PROJECT_ID = "SELECTED_PROJECT_ID";
export const REMOVE_CONTRIBUTOR = "REMOVE_CONTRIBUTOR";
export const PROJECT_OPTIONS = "PROJECT_OPTIONS";
export const PROJECT_RESULT = "PROJECT_RESULT";

export interface Project {
  currentProject: string,
  deleteProject: boolean,
  selectedProject: string
  options: string
  contributor:  {
    remove: boolean,
    projectId: string,
    userId: number
  }
  result: {
    toggle: boolean
    type: string
    selectedId: string
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

interface setSelectedProject {
  type: typeof SELECTED_PROJECT_ID
  payload: Project
}

interface removeContributor {
  type: typeof REMOVE_CONTRIBUTOR
  payload: Project
}

interface toggleOptions {
  type: typeof PROJECT_OPTIONS
  payload: Project
}

interface toggleResults {
  type: typeof PROJECT_RESULT
  payload: Project
}

export type ProjectTypes =  storeProject | setDeleteProjectPanel | setSelectedProject | removeContributor | toggleOptions |toggleResults;