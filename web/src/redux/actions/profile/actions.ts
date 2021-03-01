import {
  ProfileTypes,
  Profile,
  SET_PROFILE,
  EDIT_NAME,
  EDIT_BIO,
  EDIT_INSTRUMENT
} from "./types"

import { Dispatch } from "redux"

export const setProfile = (payload: Profile) => (dispatch: Dispatch<ProfileTypes>) => {
  dispatch({
    type: SET_PROFILE,
    payload: payload
  })
}

export const editNames = (payload: Profile) => (dispatch:Dispatch<ProfileTypes>) => {
  dispatch({
    type: EDIT_NAME,
    payload: payload
  })
}

export const editBio = (payload: Profile) => (dispatch:Dispatch<ProfileTypes>) => {
  dispatch({
    type: EDIT_BIO,
    payload: payload
  })
}

export const editInstrument = (payload: Profile) => (dispatch:Dispatch<ProfileTypes>) => {
  dispatch({
    type: EDIT_INSTRUMENT,
    payload: payload
  })
}