export const INIT_AND_EXIT_LYRIC_CREATION = "INIT_AND_EXIT_LYRIC_CREATION";
export const INIT_AND_EXIT_TAB_CREATION = "INIT_AND_EXIT_TAB_CREATION";

// export const INIT_LYRIC_DELETION = "INIT_LYRIC_DELETION";
// export const SET_LYRIC_ID = "SET_LYRIC_ID";

export const CREATE_LYRIC = "CREATE_LYRIC";
export const CREATE_TAB = "CREATE_TAB";

export const DELETE_LYRIC = "DELETE_LYRIC";
export const DELETE_TAB = "DELETE_TAB";
export const DELETE_TRACK = "DELETE_TRACK";

export interface Workspace { 
  lyrics: {
    create: boolean
    delete: boolean
    id: number
  }
  tabs : {
    create: boolean
    delete: boolean
  }
  tracks :{
    delete: boolean
  }
}

interface initLyricCreation {
  type: typeof INIT_AND_EXIT_LYRIC_CREATION
  payload: Workspace
}
interface initLyricDeletion {
  type: typeof DELETE_LYRIC
  payload: Workspace
}
interface initTabCreation  {
  type: typeof INIT_AND_EXIT_TAB_CREATION
  payload: Workspace
}
interface initTabDeletion {
  type: typeof DELETE_TAB
  payload: Workspace
}
interface initTrackDeletion {
  type: typeof DELETE_TRACK
  payload: Workspace
}
interface createLyricAndAddToProject {
  type: typeof CREATE_LYRIC
  payload: Workspace
}
interface createTabAndAddToProject {
  type: typeof CREATE_TAB
  payload: Workspace
}


export type WorkspaceTypes = initLyricCreation | initLyricDeletion | initTabDeletion | initTabCreation | createLyricAndAddToProject | createTabAndAddToProject |initTrackDeletion;