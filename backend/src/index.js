require("dotenv").config();
const express = require("express");
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");
const path = require("path");
const {ConnectionDB} = require("./lib/db")
const app = express();
const cookieParser = require("cookie-parser")

ConnectionDB(process.env.MONGO_URI).then(() => console.log("MongoDB running..."));

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