import joi from "joi"
import { Types } from "mongoose";
import { TypesEnum } from "../enum/transaction.enum.js";
export const general_rules = {
    fullName: joi.string().min(2).max(50),

    email: joi.string().email({ tlds: { allow: false, deny: ["yahoo"] } }),

    password: joi
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
        .message({
            "string.pattern.base":
                "Invalid passwords , must contain numbers , lower and upper letters and spetial characters ",
        }),

    cPassword: joi.string().valid(joi.ref("password")).messages({
        "any.required": "password is required",
    }),

    phone: joi
        .string()
        .regex(/^(01|02001|\+201)[0125][0-9]{8}$/)
        .message({
            "string.pattern.base": "Invalid phone number",
        }),


    id:joi.string().custom((value,helper)=>{
        const isValid = Types.ObjectId.isValid(value)
        return isValid ? value : helper.message("invalid id structure")
    }),

    accountNumber:joi.number(),
    amount:joi.number().positive(),
    type:joi.string().valid(...Object.values(TypesEnum)).required(),

    addToFavToggel:joi.boolean(),
    nickName:joi.string().min(2),
    bankName:joi.string(),
    date:joi.date()
};
