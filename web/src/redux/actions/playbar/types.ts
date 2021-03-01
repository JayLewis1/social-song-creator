// // App Location
// export const SET_APP_LOCATION = "SET_APP_LOCATION";

// Playbar Types 
export const OPEN_PLAYBAR = "OPEN_PLAYBAR";


export const ASSIGN_TRACK = "ASSIGN_TRACK";

// // Project Types
// export const  INIT_PROJECT = "INIT_PROJECT";
// export const  STORE_PROJECT = "STORE_PROJECT";
// export const INIT_AND_EXIT_LYRIC_CREATION = "INIT_AND_EXIT_LYRIC_CREATION";
// export const INIT_AND_EXIT_TAB_CREATION = "INIT_AND_EXIT_TAB_CREATION";


export interface Playbar {
  status: boolean
  data: any

}

interface openPlaybar { 
  type: typeof OPEN_PLAYBAR
  payload: Playbar
}

interface assignTrack {
  type: typeof ASSIGN_TRACK
  payload: Playbar
}

export type PlaybarTypes =  openPlaybar | assignTrack;

