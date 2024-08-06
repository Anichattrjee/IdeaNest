import mongoose,{ Schema } from "mongoose";

const psotSchema=new Schema({
    userId:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        default:'https://jumpseller.com/images/learn/create-a-blog/blog.jpg',
    },
    category:{
        type:String,
        default:'uncategorized',
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    }
},{timestamps:true});


export const Post=mongoose.model("Post",psotSchema);
