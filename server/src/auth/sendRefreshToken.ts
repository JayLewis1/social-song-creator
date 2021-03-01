import { Response } from "express";

// Create cookie to store refreshToken
export const sendRefreshToken = (res: Response, token : string) => {
  res.cookie("dsi", token, {
    httpOnly: true,
    path: "/refresh_token"
  });
};