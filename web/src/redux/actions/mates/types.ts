export const MATES_OPTIONS = "MATES_OPTIONS";
export const MATES_REMOVE = "MATES_REMOVE";

export interface Mates {
  options: boolean
  remove : boolean
}

interface toggleMatesOptions {
  type: typeof MATES_OPTIONS
  payload: Mates
}

interface toggleMatesRemove {
  type: typeof MATES_REMOVE
  payload: Mates
}


export type MatesTypes = toggleMatesOptions | toggleMatesRemove;