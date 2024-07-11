import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const testController=(req,res)=>{
    res.json({message:"Api is working"});
};

export const updateUser=async (req,res,next)=>{
    console.log(req.user);
    if(req.user.id!==req.params.userId)
    {
        return next(errorHandler(403,"Not allowed to update this user"));
    }
    if(req.body.username)
    {
        if(req.body.username.includes(' '))
        {
            return next(errorHandler(400,'Username cannot contain spaces'));
        }
        if(req.body.username.length < 7 || req.body.username.length>20)
        {
            return next(errorHandler(400,'Username must be within 7 to 20 chars'));
        }
        if(req.body.username!==req.body.username.toLowerCase())
        {
            return next(errorHandler(400,'Username can only contain lowercase'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/))
        {
            return next(errorHandler(400,'Username can only contain letters and numbers'));
        }
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
          return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = await bcryptjs.hash(req.body.password, 10);
      }

    try {
        //update the user
        const updatedUser=await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                profilePicture:req.body.profilePicture
            },
        },{new:true});

        const {password, ...rest}=updatedUser._doc;
        res.status(200).json({message:"User successfully updated",success:true,rest});
    } catch (error) {
        next(error);
    }
};