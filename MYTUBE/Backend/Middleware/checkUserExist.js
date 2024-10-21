import userModel from "../Model/userModel.js";

export default async function checkUserExist(req, res, next){
    try{
        const { emailId } = req.body;
        const user = await userModel.findOne({ emailId: emailId });
        if(user){
            return res.send({userExistMessage : "User already exist"})
        }
        else{
            next()
        }
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}