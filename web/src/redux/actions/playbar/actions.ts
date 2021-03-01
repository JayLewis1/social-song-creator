import { Playbar, OPEN_PLAYBAR, ASSIGN_TRACK, PlaybarTypes } from "./types";

export const activatePlaybar = (status: Playbar) : PlaybarTypes =>  {
  return {
    type: OPEN_PLAYBAR,
    payload: status
  }
}


export const assignTrack = (data: Playbar) : PlaybarTypes =>  {
  return {
    type: ASSIGN_TRACK,
    payload: data
  }
}