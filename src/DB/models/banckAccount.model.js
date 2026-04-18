import mongoose, { Types } from "mongoose";
import { AccountStatus } from "../../common/enum/banckAccount.enum.js";
import { TypesEnum } from "../../common/enum/transaction.enum.js";

const banckAccountSchema = new mongoose.Schema({
    accountNumber:{
        type : String,
        required:true,
        minLength:1,
    },
    userId:{
        type : Types.ObjectId,
        ref:"user",
        required:true,
    },
    balance:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:Object.values(AccountStatus),
        default:AccountStatus.active
    }
},
{
    timestamps:true,
    strictQuery:true,
    versionKey:"versionKey",
    optimisticConcurrency:true, // to update version
    toJSON:true,
    toObject:true
}
);


/* if banckAccount model exist use it else create it */
const banckAccountModel = mongoose.models.banckAccount || mongoose.model("banckAccount",banckAccountSchema);

export default  banckAccountModel;