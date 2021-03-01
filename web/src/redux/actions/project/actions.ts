import { 
    ProjectTypes,
    Project,
    STORE_PROJECT,
    SHOW_PROJECT_DELETE_PANEL,
    SET_ID_FOR_DELETE,
    REMOVE_CONTRIBUTOR
  } from "./types"

  export const storeProject = (projectId : Project) : ProjectTypes => {
    return {
      type: STORE_PROJECT,
      payload: projectId
    }
  }

  export const setDeleteProjectPanel = (payload: Project) : ProjectTypes => {
    return {
      type: SHOW_PROJECT_DELETE_PANEL,
      payload: payload
    }
  }

  export const setDeleteId = (id: Project) : ProjectTypes => {
    return {
      type: SET_ID_FOR_DELETE,
      payload: id
    }
  }


  export const removeContributors = (id: Project) : ProjectTypes => {
    return {
      type: REMOVE_CONTRIBUTOR,
      payload: id
    }
  }