export const MATES_OPTIONS = "MATES_OPTIONS";
export const MATES_REMOVE = "MATES_REMOVE";
export const MATES_ADD = "MATES_ADD";
export const MATES_SELECTED_ID = "MATES_SELECTED_ID";

export interface Mates {
  options: boolean
  remove : boolean
  add: boolean
  id : number
}

interface toggleMatesOptions {
  type: typeof MATES_OPTIONS
  payload: Mates
}

interface toggleMatesRemove {
  type: typeof MATES_REMOVE
  payload: Mates
}

interface toggleMatesAdd {
  type: typeof MATES_ADD
  payload: Mates
}

interface selectedUserId {
  type: typeof MATES_SELECTED_ID
  payload: Mates
}

export type MatesTypes = toggleMatesOptions | toggleMatesRemove | toggleMatesAdd |  selectedUserId;