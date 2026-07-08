import dotenv from "dotenv";
dotenv.config();
import {Server} from "socket.io";
import  express from "express";
import http from "http";
import {SocketAuthMiddleware} from "../middleware/socket.auth.middleware.js"


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin: [process.env.CLIENT_URL],
        credentials : true,
    }
});


io.use(SocketAuthMiddleware);

const userSocketMap = {};

io.on("connection", (socket)=>{
    
    const test = socket.user._id;
    
    const userId = socket.userId;
    userSocketMap[userId] = socket.id;  
    io.emit("getOnlineUsers", Object.keys(userSocketMap));  


    socket.on("disconnect", () =>{
        
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
    })
})

function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

export {
    app,
    server,
    io,
    getReceiverSocketId,
}



