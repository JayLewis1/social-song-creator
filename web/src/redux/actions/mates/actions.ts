import { 
  MatesTypes, 
  Mates, 
  MATES_OPTIONS,
  MATES_REMOVE,
  MATES_ADD,
  MATES_SELECTED_ID } from "./types";

export const toggleMatesOptions = (payload: Mates) : MatesTypes => {
  return {
    type: MATES_OPTIONS,
    payload
  }
}

export const toggleMatesRemove = (payload: Mates) : MatesTypes => {
  return {
    type: MATES_REMOVE,
    payload
  }
}

export const toggleMatesAdd = (payload: Mates) : MatesTypes => {
  return {
    type: MATES_ADD,
    payload
  }
}
export const selectedUserId = (payload: Mates) : MatesTypes => {
  return {
    type: MATES_SELECTED_ID,
    payload
  }
}
