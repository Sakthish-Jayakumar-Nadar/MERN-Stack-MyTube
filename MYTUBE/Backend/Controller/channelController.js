import channelModel from "../Model/channelModel.js";
import userModel from "../Model/userModel.js";

export async function createChannel(req, res){
    const {channelName} = req.body;
    const user = req.user;
    const id = user.user._id;
    console.log(id);
    try{
        const newChannel = new channelModel({ channelName: channelName, userId: id});
        newChannel.save().then(async (data) => {
            if(!data){ 
                return res.status(400).json({message : "Something went wrong"});
            }
            userModel.findByIdAndUpdate(id, {$set : {channelId : data._id, creator : true}}, { new: true }).then((updateData)=>{
                return res.send(data);
            }).catch((err)=>{
                return res.status(500).json({message : err.message});
            });
        }).catch(err => res.status(500).json({message : err.message}));
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export async function getChannel(req, res) {
    try{
        const { id } = req.params;
        const channel = await channelModel.findOne({_id:id}) 
        if(channel){
            return res.send(channel);
        }
        return res.json({channelNotFoundMessage : "channel not found"})
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}