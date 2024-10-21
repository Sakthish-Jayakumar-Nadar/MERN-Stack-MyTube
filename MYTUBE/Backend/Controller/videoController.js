import channelModel from "../Model/channelModel.js";
import userModel from "../Model/userModel.js";
import videoModel from "../Model/videoModel.js"

export async function getchannelVideos(req, res) {
    try{
        const {id} = req.params
        const videos = await videoModel.find({channelId:id});
        if(videos){
            return res.send(videos);
        }
        return res.json({noVideosMesssage : "No video"})
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export async function getVideos(req,res){
    try{
        const videos = await videoModel.find({});
        if(videos){
            videos.forEach((video)=>{
                channelModel.findOne({_id:video.channelId}).then((channel)=>{
                    video.set({channelName : channel.channelName, subscribers : channel.subscribers});
                    video.save().catch((err) => console.log("error : "+err.message))                
                }).catch((err) => res.status(500).json({message : err.message}));
            })  
            return res.send(videos);
        }
        return res.json({noVideosMesssage : "No video"})
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export async function getVideosById(req,res){
    try{
        const {id} = req.params;
        const video = await videoModel.findOneAndUpdate({_id:id},{ $inc: { ["views"]: 1 } },{ new: true });
        if(video){
            channelModel.findOne({_id:video.channelId}).then((channel)=>{
                video.set({channelName : channel.channelName, subscribers : channel.subscribers});
                video.save().catch((err) => console.log("error : "+err.message))                
            }).catch((err) => res.status(500).json({message : err.message}));
            return res.send(video);
        }
        return res.json({noVideosMesssage : "No video"})
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export async function getSideVideo(req, res){
    try {
        const { id } = req.params;
        const videos = await videoModel.find({ _id: { $ne: id } }).limit(10);
        if(videos){
            videos.forEach((video)=>{
                channelModel.findOne({_id:video.channelId}).then((channel)=>{
                    video.set({channelName : channel.channelName, subscribers : channel.subscribers});
                    video.save().catch((err) => console.log("error : "+err.message))                
                }).catch((err) => res.status(500).json({message : err.message}));
            })  
            return res.send(videos);
        }
        return res.json({noVideosMesssage : "No video"});
      } catch (err) {
        return res.status(500).json({message : err.message});
      }
}

export async function getVideoForSearch(req, res){
    const {searchText} = req.params;
    try {
        const videos = await videoModel.find({ title: { $regex: searchText, $options: 'i' } });
        videos.forEach((video) => {
            channelModel.findById(video.channelId)
            .then((channel) => {
                video.channelName = channel.channelName;
                video.save()
            })
            .catch((err) => res.status(500).json({message : err.message}))
        })
        return res.send(videos);
      } catch (err) {
        return res.status(500).json({message : err.message});
      }
}

export async function addComment(req, res){
    const { id } = req.params;

  try {
    const video = await videoModel.findById(id);
    if (!video) {
      return res.json({videoNotFoundMessage : "Video not found"});
    }
    const user = await userModel.findById(req.body.userId);
    if (!user){
        return res.json({userNotFoundMessage : "User not found"});
    }
    video.comments.push({...(req.body), emailId : user.emailId});
    await video.save();
    res.send(video);
  } catch (err) {
    res.status(500).send('Server error');
  }
}

export async function editComment(req, res){
    const {id , commentId} = req.params;
    try{
        const video = await videoModel.findOneAndUpdate({_id:id, 'comments._id':commentId},{$set : {'comments.$.text' : req.body.text}},{new : true});
        return res.send(video);
    }
    catch(err){
        res.status(500).send('Server error');
    }
}

export async function deleteComment(req, res){
    const {id , commentId} = req.params;
    try {
        const video = await videoModel.findById(id);
        if (!video) {
            return res.json({videoNotFoundMessage : "Video not found"});
        }
    
        const commentIndex = video.comments.findIndex(comment => comment._id.toString() === commentId);
        
        if (commentIndex === -1) {
          return res.json({commentNotFound : "Comment not found"});
        }
    
        video.comments.splice(commentIndex, 1);
        
        await video.save();
    
        return res.send(video);
      } catch (err) {
        res.status(500).send('Server error');
      }
}

export async function deleteVideoById(req, res){
    const { channelId, videoId } = req.params;
    try {
        const video = await videoModel.findByIdAndDelete(videoId);
        const videos = await videoModel.find({channelId : channelId});
        videos.forEach((v)=>{ 
            channelModel.findById(channelId)
            .then((channel) => {
                v.channelName = channel.channelName;
                v.save()
            })
            .catch((err)=>res.json({message : err.message}));
        })
        return res.send(videos);
    } catch (err) {
        res.status(500).send('Server error');   
    }
}

export async function editVideoById(req, res){
    const { channelId, videoId } = req.params;
    const { title, description } = req.body;
    try {
        const video = await videoModel.findByIdAndUpdate(videoId,{title : title, description : description},{new : true});
        const videos = await videoModel.find({channelId : channelId});
        videos.forEach((v)=>{ 
            channelModel.findById(channelId)
            .then((channel) => {
                v.channelName = channel.channelName;
                v.save()
            })
            .catch((err)=>res.json({message : err.message}));
        })
        return res.send(videos);
    } catch (err) {
        res.status(500).send('Server error');   
    }
}

export async function getVideoByCategory(req, res) {
    const { category } = req.params;
    try{
        const videos = await videoModel.find({category : category});
        videos.forEach((v)=>{ 
            channelModel.findById(v.channelId)
            .then((channel) => {
                v.channelName = channel.channelName;
                v.save()
            })
            .catch((err)=>res.json({message : err.message}));
        })
        return res.send(videos);
    } catch (err) {
        res.status(500).send('Server error');   
    }
}

export async function getCategory(req, res){
    try{
        const categories = await videoModel.distinct('category')
        return res.send(categories);
    }catch (err) {
        res.status(500).send('Server error');   
    }
}