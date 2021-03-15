
import "dotenv/config";
import "reflect-metadata";
import express, { Request, Response } from "express";
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
import multer from 'multer';
import { uploadToS3, getFromS3, removeFileFromS3, removeProjectFromS3 } from "./apis/s3";

const PORT = process.env.port || 4000;
const path = require("path");
var upload = multer({ dest: 'uploads/'});
var type = upload.single('users-audio');

(async () => {
    const app = express();
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true
        })
    )
    app.use(cookieParser());
    app.use(express.json());
    // app.get("/", (_req, res) => res.send("Hello"));
    app.use(express.static(path.join(__dirname, '../../web/build')))
    app.get("/", (_req, res) => {
        res.sendFile(path.join(__dirname, "../../web/build", "index.html"));
        });
    app.get("/get/:projectId/:fileId", (req: Request, res: Response) => {
        const fileId = req.params.fileId
        const projectId = req.params.projectId
        console.log(fileId);
        console.log(projectId);

        getFromS3(projectId, fileId)
        .then((response) => {
            console.log(response)
            return res.send(response);
        }).catch((err) => { 
            console.log(err);
            return res.send(err);
        })
    })

    app.post("/removeItem", type ,async (req: Request, res: Response) => {
        const fileId = req.body.fileId
        const projectId = req.body.projectId
        const response = await removeFileFromS3(projectId, fileId);
        try {
            console.log(response)
            return res.send(response);
        }catch(err) {
            console.log(err);
            return res.send(err);
        }
    })

    app.post("/removeProject", type, async (req: Request, res: Response) => {
        const projectId = req.body.projectId
        removeProjectFromS3(projectId)
            .then((response) => {
            // console.log(response)
            return res.send(response);
        }).catch((err) => {
            console.log(err);
            return res.send(err);
        });
    })

    app.post("/upload", type, (req: Request, res: Response) => {
        const uploadedAudio = {
            userId : req.body.userId,
            projectId: req.body.projectId,
            trackId: req.body.trackId,
            fileContent: req.file,

        }
        uploadToS3(uploadedAudio);
        return res.send(uploadedAudio);
    })


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
