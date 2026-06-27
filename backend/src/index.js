import dotenv from "dotenv";
dotenv.config();
import express from "express"
import authRoute from "./routes/auth.route.js";
import messageRoute  from "./routes/message.route.js";
import { fileURLToPath } from "url";

import path from "path";
import {ConnectionDB} from "./lib/db.js"
const app = express();
import cookieParser from "cookie-parser";

ConnectionDB(process.env.MONGO_URI).then(() => console.log("MongoDB running..."));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));;
app.use(cookieParser());

app.use("/api/auth",authRoute);
app.use("/api/messages", messageRoute);
if(process.env.NODE_ENV=== "production"){
    app.use(express.static(path.join(__dirname,"../../frontend/dist")));
    app.get(/.*/, (req,res)=>{
        res.sendFile(path.join(__dirname,"../../frontend/dist/index.html"))
    })
}





app.listen(process.env.PORT,() => console.log("Server running..."));