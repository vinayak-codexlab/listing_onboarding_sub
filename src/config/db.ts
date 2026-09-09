import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async()=>{
    try{
        await mongoose.connect(env.MONGO_URI);
        console.log("DB connected successfully");
    } catch(err){
        console.log("Error in the db connection !",err);
        process.exit(1);
    }
};
