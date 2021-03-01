export const SET_PROFILE = "SET_PROFILE";
export const EDIT_NAME = "EDIT_NAME";
export const EDIT_BIO = "EDIT_BIO";
export const EDIT_INSTRUMENT = "EDIT_INSTRUMENT";

export interface Profile {
  profileId: number
  editting: {
    names: boolean,
    bio: boolean,
    instruments: boolean
  }
}

interface updateProfile {
  type:typeof SET_PROFILE,
  payload: Profile
}

interface edittingName {
  type:typeof EDIT_NAME,
  payload: Profile
}

interface edittingBio {
  type:typeof EDIT_BIO,
  payload: Profile
}

interface edittingInstrument {
  type:typeof EDIT_INSTRUMENT,
  payload: Profile
}


export type ProfileTypes = updateProfile | edittingName | edittingBio | edittingInstrument;