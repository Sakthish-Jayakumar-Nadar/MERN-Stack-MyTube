import userModel from "../Model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export function createUser(req, res){
    const {emailId, plainPassword} = req.body;
    bcrypt.hash(plainPassword, 10, function(err, hash) {
        if (err) return res.status(500).json({message : err.message});
        const newUser = new userModel({ emailId, password : hash, });
        newUser.save().then(data => {
            if(!data){ 
                return res.status(400).json({message : "Something went wrong"});
            }
            res.send(data);
        }).catch(err => res.status(500).json({message : err.message}));
    });
}

export async function loginUser(req, res){
    try{
        const {emailId, plainPassword} = req.body;
        const user = await userModel.findOne({ emailId: emailId });
        if(user){
            bcrypt.compare(plainPassword, user.password, function(err, result) {
                if (err) return res.status(500).send({message : "Internal server error"}) ;
              
                if (result) {
                    const token = jwt.sign({user}, "MyTube", { expiresIn: '15m' });
                    return res.json({ token });
                } else {
                  return res.json({invalidLoginInputMessage : "Invalid Inputs"});
                }
              });
        }
        else{
            return res.json({firstRegisterMessage : "Register first"});
        }
    }
    catch(err){
        return res.status(500).json({message : err.message});
    }
}

export async function getUser(req, res){
    try{
        const { id } = req.params;
        const user = await userModel.findOne({_id:id});
        if(user){
            return res.send(user);
        }
        return res.json({userNotFoundMessage : "User not found"});
    }
    catch(err){
        return res.status(500).json({message : err.message})
    }
} 