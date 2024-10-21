import { model, Schema } from "mongoose";
import userModel from "./userModel.js";
import videoModel from "./videoModel.js";

const channelSchema = new Schema({
    channelName : {
        type : String,
        required : true,
    },
    channelProfileUrl : {
        type : String,
    },
    subscribers : {
        type : Number,
        default : 0,
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'userModel',
        required : true,
    },
    videos : {
        type : [Schema.Types.ObjectId],
        ref : 'videoModel',
    }
})

const channelModel = model('MyTubeChannel', channelSchema);
export default channelModel;