import mongoose, { Types } from "mongoose";

const beneficiarySchema = new mongoose.Schema({
    ownerUserId:{
        type : Types.ObjectId,
        ref:"user",
        required:true,
    },
    accountNumber:{
        type : String,
        required:true,
        minLength:1,
    },
    bankName:{
        type:String,
        required:true
    },
    nickName:{
        type:String,
        required:true
    },
},
{
    timestamps:true,
    strictQuery:true,
    versionKey:"versionKey",
    optimisticConcurrency:true, // to update version
}
);


/* if user model exist use it else create it */
const beneficiaryModel = mongoose.models.beneficiary || mongoose.model("beneficiary",beneficiarySchema);

export default  beneficiaryModel;