import mongoose from "mongoose";
import { RoleEnum } from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema({
    fullName:{
        type : String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type : String,
        require:true,
        minLength:8,
        trim:true
    },
    role:{
        type:String,
        enum:Object.values(RoleEnum),
        default:RoleEnum.user
    },
    confirmed:Boolean,
    changeCredetial:Date
},
{
    timestamps:true,
    strictQuery:true,
    versionKey:"versionKey",
    optimisticConcurrency:true, // to update version
}
);


/* if user model exist use it else create it */
const userModel = mongoose.models.user || mongoose.model("user",userSchema);

export default  userModel;