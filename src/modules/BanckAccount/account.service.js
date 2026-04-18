import { success_response } from "../../common/utils/successRes.js"
import * as dbService from "../../DB/db.service.js"
import banckAccountModel from "../../DB/models/banckAccount.model.js"
import transactionModel from "../../DB/models/transaction.model.js"



export const getUserAccount= async (req,res)=>{
    const userAccount = await dbService.findOne({
        model:banckAccountModel,
        filter:{
            userId:req.user.id
        }
    })
    return success_response({res,data:userAccount})
}

export const getStatment = async (req,res)=>{
    const {start_date , end_date} = req.body
    const statment = await dbService.find({
        model:transactionModel,
        filter:{
            createdAt:{
                $gte:start_date,
                $lte:end_date
            }
        },
        options:{
            select:"amount type createdAt -_id"
        }
    })

    return success_response({
        res,
        data:statment
    })
}