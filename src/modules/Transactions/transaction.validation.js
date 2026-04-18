import joi from "joi";
import { general_rules } from "../../common/utils/general.rules.js";

export const createTransaction_schema = {
    body:joi.object({
        amount:general_rules.amount,
        type:general_rules.type,
    }).options({presence:"required"}).messages({
        "any.required":"body  is required"
    }),
}

export const getTransaction_schema = {
    params:joi.object({
        id:general_rules.id.required()
    })
}

export const transferTransaction_schema={
    body:joi.object({
        accountNumber: general_rules.accountNumber.required(),
        amount:general_rules.amount.required(),
        addToFavToggel:general_rules.addToFavToggel,
        bankName:general_rules.bankName,
        nickName:general_rules.nickName
    })
}