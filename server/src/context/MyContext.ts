import { Request, Response } from "express"

import  {createLyricsLoader} from "../utils/lyricsLoader";

export interface MyContext {
  req: Request,
  res: Response,
  payload?: { userId: number },
  lyricsLoader: ReturnType<typeof createLyricsLoader>;
}