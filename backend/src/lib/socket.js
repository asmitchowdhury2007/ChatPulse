import dotenv from "dotenv";
dotenv.config();
import {Server} from "socket.io";
import  express from "express";
import http from "http";



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: process.env.CLIENT_URL,
        credentials : true,
    }
});


io.use(socketAuthMiddleware);






server.listen(process.env.PORT , () => console.log(`Server running...`));