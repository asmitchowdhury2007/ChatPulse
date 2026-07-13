import dotenv from "dotenv";
dotenv.config();
import express from "express"
import {app,server,io} from "./lib/socket.js"
import authRoute from "./routes/auth.route.js";
import messageRoute  from "./routes/message.route.js";
import { fileURLToPath } from "url";
import cors from "cors";
import path from "path";
import {ConnectionDB} from "./lib/db.js"
import cookieParser from "cookie-parser";

ConnectionDB(process.env.MONGO_URI).then(() => console.log("MongoDB running..."));
const PORT = process.env.PORT || 9000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json( {limit: "10mb"}));
app.use(express.urlencoded({ limit: "10mb", extended: false }));;
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL,credentials: true,}));

app.use("/api/auth",authRoute);
app.use("/api/messages", messageRoute);
if(process.env.NODE_ENV=== "production"){
    app.use(express.static(path.join(__dirname,"../../frontend/dist")));
    app.get(/.*/, (req,res)=>{
        res.sendFile(path.join(__dirname,"../../frontend/dist/index.html"))
    })
}





server.listen(PORT ,() => console.log("Server running..."));