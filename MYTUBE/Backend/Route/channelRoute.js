import { createChannel, getChannel } from "../Controller/channelController.js";
import { getchannelVideos } from "../Controller/videoController.js";
import authenticateJWT from "../Middleware/authenticateJWT.js";

export default function channelRoute(app){
    app.post('/api/channel',authenticateJWT ,createChannel);
    app.get('/api/channel/:id' ,getChannel);
    app.get('/api/channel/:id/videos', getchannelVideos);
}