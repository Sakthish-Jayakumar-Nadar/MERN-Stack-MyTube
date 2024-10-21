import { addComment, deleteComment, deleteVideoById, editComment, editVideoById, getCategory, getSideVideo, getVideoByCategory, getVideoForSearch, getVideos, getVideosById } from "../Controller/videoController.js";
import authenticateJWT from "../Middleware/authenticateJWT.js";

export default function videoRoute(app){
    app.get('/api/videos' ,getVideos);
    app.get('/api/searchVideos/:searchText' ,getVideoForSearch);
    app.get('/api/video/category', getCategory)
    app.get('/api/video/category/:category', getVideoByCategory);
    app.get('/api/video/:id' ,getVideosById);
    app.get('/api/sideVideo/:id' ,getSideVideo);
    app.post('/api/video/:id/addComment' ,authenticateJWT ,addComment);
    app.post('/api/video/:id/editComment/:commentId' ,authenticateJWT ,editComment);
    app.delete('/api/video/:id/deleteComment/:commentId' ,authenticateJWT ,deleteComment);
    app.delete('/api/channel/:channelId/deleteVideo/:videoId' ,authenticateJWT ,deleteVideoById);
    app.post('/api/channel/:channelId/editVideo/:videoId' ,authenticateJWT ,editVideoById);
}