require("dotenv").config();
const express = require("express");
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");
const path = require("path");

const app = express();



app.use("/api/auth",authRoute);
app.use("/api/messages", messageRoute);
if(process.env.NODE_ENV=== "production"){
    app.use(express.static(path.join(__dirname,"../../frontend/dist")));
    app.get(/.*/, (req,res)=>{
        res.sendFile(path.join(__dirname,"../../frontend/dist/index.html"))
    })
}





app.listen(process.env.PORT,() => console.log("Server running..."));