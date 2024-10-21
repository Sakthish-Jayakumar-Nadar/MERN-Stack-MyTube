import express from "express";
import mongoose from "mongoose";
import userRoute from "./Route/userRoute.js";
import cors from "cors";
import channelRoute from "./Route/channelRoute.js";
import videoRoute from "./Route/videoRoute.js";

const app = new express();
app.use(cors());
app.use(express.json());
app.listen(3000,() => {
    console.log("server running on port 3000");
})
mongoose.connect("mongodb+srv://mytube:mytube@mytube.4yhua.mongodb.net/");
const db = mongoose.connection;
db.on("open", () => { console.log("Data Base connection is successful") });
db.on("error", () => { console.log("Data Base connection is not successful") });

userRoute(app);
channelRoute(app);
videoRoute(app);