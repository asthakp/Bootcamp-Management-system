
import mongoose from "mongoose";
import config from "./config.js";


export const dbConnection=async()=>{
const connection=await mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
})
console.log('mongodb connected at', connection.connection.host)
}


