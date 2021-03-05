import { 
    ProjectTypes,
    Project,
    STORE_PROJECT,
    SHOW_PROJECT_DELETE_PANEL,
    SELECTED_PROJECT_ID,
    REMOVE_CONTRIBUTOR,
    PROJECT_OPTIONS,
    PROJECT_RESULT
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

  export const setSelectedProject = (id: Project) : ProjectTypes => {
    return {
      type:SELECTED_PROJECT_ID,
      payload: id
    }
  }


  export const removeContributors = (id: Project) : ProjectTypes => {
    return {
      type: REMOVE_CONTRIBUTOR,
      payload: id
    }
  }
  export const toggleOptions = (id: Project) : ProjectTypes => {
    return {
      type: PROJECT_OPTIONS,
      payload: id
    }
  }

 export const toggleProjectResult = (payload: Project) : ProjectTypes => {
    return {
      type: PROJECT_RESULT,
      payload: payload
    }
  }