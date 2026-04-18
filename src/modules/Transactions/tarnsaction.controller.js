import { Router } from "express";
import authMiddleware from "../../common/middleware/authentication.js";
import * as transactionService from "./transaction.service.js";
import { checkUserAccount } from "../../common/middleware/checkUserAccount.js";
import validationMid from "../../common/middleware/validation.js";
import { createTransaction_schema, getTransaction_schema, transferTransaction_schema } from "./transaction.validation.js";

const transactionRouter = Router({
    caseSensitive:true,
    strict:true
})

transactionRouter.get("/my",authMiddleware, transactionService.getUsertransactions)
transactionRouter.get("/my/summary",authMiddleware, checkUserAccount ,transactionService.getUsertransactionsSummary)
transactionRouter.post("/deposit_withdraw",authMiddleware,validationMid({schema:createTransaction_schema}),checkUserAccount,transactionService.createTransaction)
transactionRouter.get("/:id",authMiddleware, validationMid({schema:getTransaction_schema}) ,transactionService.getTransaction)
transactionRouter.post("/transfer",authMiddleware, validationMid({schema:transferTransaction_schema}) , checkUserAccount ,transactionService.transferTransaction)

export default transactionRouter