import {
  User,
  UserTypes,
  USER_AUTHENTICATED,
  CLEAR_USER
} from "./types"

export const authenticateUser = (user:User ): UserTypes => {
  const { id , email }: any = user;

  const contructedData = {
    authenticated : true,
    user: {
      id: id,
      email: email
    }
  }
  
  return {
    type: USER_AUTHENTICATED,
    payload: contructedData
  }
}

export const logoutUser = (user:User ): UserTypes => {
  const contructedData = {
    authenticated : false,
    user: {
      id: "",
      email: ""
    }
  }

  return {
    type: USER_AUTHENTICATED,
    payload: contructedData
  }
}
