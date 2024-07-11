import jwt from 'jsonwebtoken';
import {errorHandler} from "./error.js";

export const verifyToken=async (req,res,next)=>{
    const token=req.cookies.access_token;
    if(!token){
        //if no token then call the error handling middleware
        return next(errorHandler(401,'Unauthorized'));
    }
    //now verify the token
    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return next(errorHandler(401,'Could not verify token'));
        }
        // token verified, we got the user, now put the user in the req so we can access the user in the controller 
        req.user=user;
        next();
    });
}