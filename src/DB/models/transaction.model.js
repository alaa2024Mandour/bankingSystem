import mongoose, { Types } from "mongoose";
import { AccountStatus } from "../../common/enum/banckAccount.enum.js";
import { TransactionStatusEnum, TypesEnum } from "../../common/enum/transaction.enum.js";

const transactionSchema = new mongoose.Schema({
    accountNumber:{
        type : String,
        required:true
    },
    accountId:{
        type : Types.ObjectId,
        ref:"banckAccount",
        required:true,
    },
    amount:{
        type:Number,
        required:true
    },
    balanceBefore:{
        type:Number,
        required:true
    },
    balanceAfter:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:Object.values(TransactionStatusEnum),
        default:TransactionStatusEnum.pending
    },
    type:{
        type:String,
        enum:Object.values(TypesEnum),
        require:true
    }

},
{
    timestamps:{
        updatedAt:false
    },
    strictQuery:true,
    versionKey:"versionKey",
    optimisticConcurrency:true, // to update version
    toJSON:true,
    toObject:true
}
);


/* if transaction model exist use it else create it */
const transactionModel = mongoose.models.transaction || mongoose.model("transaction",transactionSchema);

export default  transactionModel;