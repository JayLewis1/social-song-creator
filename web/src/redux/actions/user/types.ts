export const USER_AUTHENTICATED = "USER_AUTHENTICATED";
export const CLEAR_USER = "CLEAR_USER";


export interface User {
  authenticated : boolean,
  user: {}
}

interface authenticateUser {
  type: typeof USER_AUTHENTICATED
  payload: User
}

interface clearUser {
  type: typeof CLEAR_USER
  payload: User
}

export type UserTypes = authenticateUser | clearUser