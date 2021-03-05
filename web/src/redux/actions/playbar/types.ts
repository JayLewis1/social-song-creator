// // App Location
// export const SET_APP_LOCATION = "SET_APP_LOCATION";

// Playbar Types 
export const OPEN_PLAYBAR = "OPEN_PLAYBAR";
export const ASSIGN_TRACK = "ASSIGN_TRACK";

export interface Playbar {
  status: boolean
  data: {
    id: string
    projectId: string
    trackName: string
  }

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

