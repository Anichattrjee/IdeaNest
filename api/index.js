import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
// import User from "./models/user.model.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app=express();

//middlewares
app.use(express.json());

//error handling middleware
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const mssg=err.message || "Internal Server Error";
    
    res.status(statusCode).json({
        statusCode,
        success:false,
        mssg
    });
});


//connect to mongodb database
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("Database connection successfull");
})
.catch((err)=>{
    console.log("Database connection failed",err)
});


//router for user
app.use("/api/user",userRouter);
app.use("/api/auth",authRouter);




app.listen(4000,()=>{
    console.log("Server is running on PORT:4000");
});