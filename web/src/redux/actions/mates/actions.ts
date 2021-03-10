import { 
  MatesTypes, 
  Mates, 
  MATES_OPTIONS,
  MATES_REMOVE } from "./types";

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