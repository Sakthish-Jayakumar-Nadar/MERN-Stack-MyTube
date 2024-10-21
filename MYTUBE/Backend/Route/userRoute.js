import { createUser, getUser, loginUser } from "../Controller/userController.js";
import checkUserExist from "../Middleware/checkUserExist.js";

export default function userRoute(app){
    app.post('/api/register',checkUserExist ,createUser);
    app.post('/api/login' ,loginUser);
    app.get('/api/user/:id' ,getUser);
}