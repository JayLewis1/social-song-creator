import {
  Workspace,
  WorkspaceTypes,
  INIT_AND_EXIT_LYRIC_CREATION,
  INIT_AND_EXIT_TAB_CREATION,
  CREATE_LYRIC,
  DELETE_LYRIC,
  CREATE_TAB,
  DELETE_TAB,
  DELETE_TRACK
} from "./types"

// Lyrics
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
// Tabs
export const initTabCreation = (payload: Workspace) : WorkspaceTypes => {
  return {
    type: INIT_AND_EXIT_TAB_CREATION,
    payload: payload
  }
}
export const initTabDeletion = (payload: Workspace) : WorkspaceTypes => {
  return {
    type: DELETE_TAB,
    payload: payload
  }
}

// Tracks
export const initTrackDeletion = (payload: Workspace) : WorkspaceTypes => {
  return {
    type: DELETE_TRACK,
    payload: payload
  }
}


export const createTabAndAddToProject = (lyricData: Workspace): WorkspaceTypes => {
  return {
    type: CREATE_LYRIC,
    payload: lyricData
  }
}