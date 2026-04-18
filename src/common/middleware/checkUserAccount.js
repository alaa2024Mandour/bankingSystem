import { AccountStatus } from "../enum/banckAccount.enum.js"
import { findOne } from "../../DB/db.service.js";
import banckAccountModel from "../../DB/models/banckAccount.model.js";

export const checkUserAccount = async (req,res,next) => {
    const userAccount = await findOne({
        model:banckAccountModel,
        filter:{
            userId:req.user.id,
        }
    })

    if(userAccount.status == AccountStatus.inActive){
        throw new Error("your account is inActive");
    }

    req.userAccount = userAccount
    console.log("------------account checked--------------");
    
    next();
}