import { Response } from "express";

// Create cookie to store refreshToken
export const sendRefreshToken = (res: Response, token : string) => {
  console.log(token);
  res.cookie("dsi", token, {
    httpOnly: true,
    path: "/refresh_token"
  });
}; 