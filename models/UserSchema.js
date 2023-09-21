import mongoose, { Schema } from "mongoose";

const UsersSchema = new Schema({
    
    Name:{
            type: String,
            required: true,
         },
    Email:{
            type: String,
            required: true,
            unique: true
         },
    Password:{
            type: String,
            required: true
         },
    Date: {
        type: Date,
        default: Date.now
    }
    
})

const users = mongoose.model ("Users",UsersSchema);
export default users;