import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    hashedPassword:{
        type:String,
        required:true
    },
    role:{
        type: String, 
        enum: ["user", "admin"], 
        default: "user",
        required:true
    }
})

const User = models.User || model("User", UserSchema)

export default User
