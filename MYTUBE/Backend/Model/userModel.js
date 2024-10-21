import { model, Schema } from "mongoose";
import channelModel from "./channelModel.js";
import videoModel from "./videoModel.js";

const userSchema =  new Schema({
    emailId : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    creator : {
        type : Boolean,
        default : false,
    },
    channelId : { 
        type : Schema.Types.ObjectId,
        ref : 'channelModel',
    },
    liked : {
        type : [Schema.Types.ObjectId],
        default : [],
        ref : 'videoModel',
    },
    disliked : {
        type : [Schema.Types.ObjectId],
        default : [],
        ref : 'videoModel',
    },
    subscribed : {
        type : [Schema.Types.ObjectId],
        default : [],
        ref : 'channelModel',
    },
    viewed : {
        type : [Schema.Types.ObjectId],
        default : [],
        ref : 'videoModel',
    }
});

const userModel = model("MyTubeUser", userSchema);
export default userModel;