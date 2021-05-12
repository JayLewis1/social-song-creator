import {User} from "../entity/User"
import { sign } from "jsonwebtoken"

// Creates an accesstoken with the user id : expires in 15 minutes
export const createAccessToken = (user: User) => {
  return sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET!, 
    { expiresIn: "15m" });
}

// Creates a refreshtoken with the user id : expires in 7 days
export const createRefreshToken = (user: User) => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET!, 
    { expiresIn: "7d" });
} 