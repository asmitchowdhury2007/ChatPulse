import dotenv from "dotenv";
dotenv.config();
import {Server} from "socket.io";
import  express from "express";
import http from "http";
import {SocketAuthMiddleware} from "../middleware/socket.js"


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: process.env.CLIENT_URL,
        credentials : true,
    }
});


io.use(SocketAuthMiddleware);

const userSocketMap = {};

io.on("connection", (socket)=>{
    console.log("A new User welcomed", socket.user.fullname);
    const test = socket.user._id;
    console.log(typeof(test));
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;  
    io.emit("getOnlineUsers", Object.keys(userSocketMap));  


    socket.on("disconnect", () =>{
        console.log("A user disconnected" , socket.user.fullname);
    })
})





server.listen(process.env.PORT , () => console.log(`Server running...`));