import { AccountStatus } from "../../common/enum/banckAccount.enum.js"
import { TypesEnum } from "../../common/enum/transaction.enum.js"
import { success_response } from "../../common/utils/successRes.js"
import * as dbService from "../../DB/db.service.js"
import banckAccountModel from "../../DB/models/banckAccount.model.js"
import beneficiaryModel from "../../DB/models/beneficiary.model.js"
import transactionModel from "../../DB/models/transaction.model.js"



const createTransactionFunc = async ({account,amount,type,balance_before,balance_after}) => {

    const createdTransaction = await dbService.create({
        model:transactionModel,
        data:{
            accountNumber:account.accountNumber,
            accountId:account._id,
            amount,
            type,
            balanceBefore:balance_before,
            balanceAfter : balance_after 
        }
    })

    if(createdTransaction){
        const userAccount = await dbService.findOneAndUpdate({
            model:banckAccountModel,
            filter:{
                accountNumber:account.accountNumber,
            },
            update:{
                balance:createdTransaction.balanceAfter
            }
        })
        if(!userAccount){
            throw new Error("account not exist");
        }
        return userAccount;
    }else{
        throw new Error("transaction failed");
    }
}


export const getUsertransactions = async (req,res)=>{
    const {page,limit} = req.query
    const usertransaction = await dbService.find({
        model:transactionModel,
        filter:{
            userId:req.user.id
        },
        options:{
            //pagination 
            skip:(page - 1) * limit,  
            limit,
            sort:{ createdAt: -1 }
        }
    })
    if(!usertransaction){
        throw new Error("no transaction found for this user")
    }
    return success_response({res,data:usertransaction})
}

export const createTransaction = async (req,res)=>{
    const {amount,type} = req.body
    if(amount <= 0 ){
        throw new Error("amount must be grater than zero");
    }

    const balance_before = req.userAccount.balance
    let balance_after;
    if (type==TypesEnum.deposit){
        balance_after = req.userAccount.balance + amount
    }
    else if(type==TypesEnum.withdraw){
        if(balance_before > amount){
            balance_after = req.userAccount.balance - amount
        }
        else{
            throw new Error("you don't have enough balance to make this process");
            
        }
    }
    else{
        throw new Error("Invalid Type");
    }

    const updatedAccount = await createTransactionFunc({
        account:req.userAccount,
        amount,
        type,
        balance_before,
        balance_after
    })

    return success_response({res,status:201,data:{
        "current_balance":updatedAccount.balance
    }})
}


export const transferTransaction = async (req,res)=>{
    const {accountNumber , amount , addToFavToggel , bankName , nickName} = req.body

    if(amount <= 0 ){
        throw new Error("amount must be grater than zero");
    }

    let receiver_account = await dbService.findOne({
        model:banckAccountModel,
        filter:{
            accountNumber,
            status:AccountStatus.active
        }
    })
    if(!receiver_account){
        throw new Error("this account not exist or inactive");
    }


    const sender_balance_before = req.userAccount.balance
    let sender_balance_after;
    if(sender_balance_before > amount){
        sender_balance_after = req.userAccount.balance - amount
    }
    else{
        throw new Error("you don't have enough balance to make this process");
    }
    const updatedSenderAccount = await createTransactionFunc({
        account:req.userAccount,
        amount,
        type:"transfer",
        balance_before:sender_balance_before ,
        balance_after: sender_balance_after,
    })

    const updatedReceverAccount = await createTransactionFunc({
        account:receiver_account,
        amount,
        type:"transfer",
        balance_before: receiver_account.balance,
        balance_after: receiver_account.balance+amount,
    })

    if(addToFavToggel && bankName && nickName){
        try {
                await dbService.create({
                model:beneficiaryModel,
                data:{
                    ownerUserId:updatedSenderAccount.userId,
                    accountNumber:updatedReceverAccount.accountNumber,
                    bankName,
                    nickName
                }
            })
        } catch (error) {
            throw new Eror("faild to add to favorite account");
        }

    }

    return success_response({res,status:201,data:{
        "current_balance":updatedSenderAccount.balance
    }})
}


export const getTransaction = async (req,res)=>{
    const{id} = req.params
    const transactionDetails = await dbService.findOne({
        model:transactionModel,
        filter:{
            _id:id
        },
    })

    if(!transactionDetails){
        throw new Error("fail to get transaction");
    }

    return success_response({res,data:transactionDetails})
}


export const getUsertransactionsSummary = async (req,res)=>{
    const summary  = await dbService.find({
        model:transactionModel,
        filter:{
            accountNumber:req.userAccount.accountNumber
        },
        options:{
            // populate:'accountId'
            select:'type balanceAfter balanceBefore amount createdAt -_id',
            sort:{ createdAt: -1 }
        }
    })

    return success_response({
        res,
        data:{"currentBalance":req.userAccount.balance,summary}
    })
}

