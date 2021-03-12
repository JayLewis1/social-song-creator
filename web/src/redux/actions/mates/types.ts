export const MATES_OPTIONS = "MATES_OPTIONS";
export const MATES_REMOVE = "MATES_REMOVE";
export const MATES_ADD = "MATES_ADD";

export interface Mates {
  options: boolean
  remove : boolean
  add: boolean
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

export type MatesTypes = toggleMatesOptions | toggleMatesRemove | toggleMatesAdd;