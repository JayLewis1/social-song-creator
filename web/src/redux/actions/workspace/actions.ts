import {
  Workspace,
  WorkspaceTypes,
  INIT_AND_EXIT_LYRIC_CREATION,
  INIT_AND_EXIT_TAB_CREATION,
  CREATE_LYRIC,
  DELETE_LYRIC,
  CREATE_TAB,
  DELETE_TAB,
} from "./types"

export const initLyricCreation = (payload: Workspace) : WorkspaceTypes => {
  return {
    type: INIT_AND_EXIT_LYRIC_CREATION,
    payload: payload
  }
}

export const initLyricDeletion = (payload: Workspace) : WorkspaceTypes => {
  return {
    type: DELETE_LYRIC,
    payload: payload
  }
}
export const initTabDeletion = (payload: Workspace) : WorkspaceTypes => {
  return {
    type: DELETE_TAB,
    payload: payload
  }
}
// export const setLyricId = (id: Workspace) : WorkspaceTypes => {
//   return {
//     type: SET_LYRIC_ID,
//     payload: id
//   }
// }

export const initTabCreation = (payload: Workspace) : WorkspaceTypes => {
  return {
    type: INIT_AND_EXIT_TAB_CREATION,
    payload: payload
  }
}

export const createTabAndAddToProject = (lyricData: Workspace): WorkspaceTypes => {
  return {
    type: CREATE_LYRIC,
    payload: lyricData
  }
}