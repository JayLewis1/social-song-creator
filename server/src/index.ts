
import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from  "apollo-server-express";
import { buildSchema } from "type-graphql" 
import { UserResolver } from './resolvers/UserResolver'; 
import { ProjectResolver } from './resolvers/ProjectResolver'; 
import { PostResolver } from './resolvers/PostResolver';
import {NotificationResolver} from "./resolvers/NotificationResolver";
import {createConnection} from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import cors from "cors"
import { User } from "./entity/User";
import { createAccessToken , createRefreshToken} from "./auth/auth";
import { sendRefreshToken } from "./auth/sendRefreshToken";
// import Multer from 'multer';
  
// const gcsMiddlewares = require("./middleware/google-cloud-storage");

// import { sendUploadToGCS } from "./middleware/google-cloud-storage";
// const gcsMiddlewares = require('./middleware/google-cloud-storage')
const PORT = process.env.port || 4000;

// const multer: any = Multer({
//     limits: {
//       fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
//     },
//   });

(async () => {
    const app = express();
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true
        })
    )
    app.use(cookieParser());
    app.get("/", (_req, res) => res.send("Hello"));
    // app.post("/upload", 
    // multer.single('image'),
    // gcsMiddlewares.sendUploadToGCS,
    // ({req, res} :any) => {
    //     if(req.file && req.file.gcsUrl) {
    //         console.log(req.file.gcsUrl)
    //         return res.send(req.file.gcsUrl)
    //     }

    //     return res.status(500).send("Unable to upload")
    // } )
    app.post("/refresh_token", async (req, res) => {
        // Read the dsi cookie which should be the refresh token
        const token = req.cookies.dsi
        // If there's no token return error and  no accessToken
        if(!token){
            return res.send({ ok: false, accessToken: '' })
        }

        let payload: any = null
        try {
            // Checking the token is valid
           payload = verify(token, process.env.REFRESH_TOKEN_SECRET!)
        } catch (err) {
            // If token is not valid then return error and no accessToken
            console.log(err);
            return res.send({ ok: false, accessToken: '' })
        }

        // Token is valid, send back an access token
        // Find a user by the user id stored in the payload
        const user = await User.findOne({id : payload.userId });
        // If no user send error and no accessToken
        if(!user) {
            return res.send({ ok: false, accessToken: '' })
        }

        // If token verison isnt the same as the the verison in payload
        // Token is invalid
        if(user.tokenVersion !== payload.tokenVersion) {
            return res.send({ ok: false, accessToken: '' })
        }

        sendRefreshToken(res, createRefreshToken(user));

        // User valid : create a new accessToken
        return res.send({ ok: true, accessToken : createAccessToken(user)});
    })

    await createConnection();
   
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver, PostResolver, ProjectResolver, NotificationResolver],
        }),
        context : ({ req,res }) => ({ req,res })
    });

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(PORT, () => {
        console.log("Express server started")
    })
})();
