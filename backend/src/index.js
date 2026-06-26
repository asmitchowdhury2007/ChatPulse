require("dotenv").config();
const express = require("express");
const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");

const app = express();

app.use("/api/auth",authRoute);
app.use("/api/messages", messageRoute);





app.listen(process.env.PORT,() => console.log("Server running..."));