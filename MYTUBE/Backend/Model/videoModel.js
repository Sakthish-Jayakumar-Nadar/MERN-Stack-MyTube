import mongoose from "mongoose";
import { Schema } from "mongoose";
import userModel from "./userModel.js";
import channelModel from "./channelModel.js";

const commentSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'userModel',
        required : true,
    },
    text : {
        type : String,
        required : true,
    },
    emailId : {
        type : String,
    },
    likes : {
        type : Number,
        default : 0,
    },
    dislikes : {
        type : Number,
        default : 0,
    },
    replys : {
        type : [Schema.Types.ObjectId],
        ref : 'CommentModel',
        default : [],
    }
})

const CommentModel = mongoose.model('CommentModel', commentSchema);

const videoSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    url : {
        type : String,
        required : true,
    },
    thumbnailUrl : {
        type : String,
        default : "https://fakeimg.pl/667x1000/cc6600"
    },
    description : {
        type : String,
        required : true,
    },
    channelId : {
        type : Schema.Types.ObjectId,
        required : true,
        ref : 'channelModel',
    },
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'userModel',
        required : true,
    },
    category : {
        type : String,
    },
    channelName : {
        type : String,
    },
    subscribers : {
        type : Number,
    },
    views : {
        type : Number,
        default : 0,
    },
    likes : {
        type : Number,
        default : 0,
    },
    dislikes : {
        type : Number,
        default : 0,
    },
    comments : {
        type : [commentSchema],
        default : [],
    }
})

const videoModel = mongoose.model('MyTubeVideo', videoSchema);
export default videoModel;