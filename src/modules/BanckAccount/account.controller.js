import { Router } from "express";
import * as accountService from "./account.service.js";
import authMiddleware from "../../common/middleware/authentication.js";

const accountRouter = Router({
    caseSensitive:true,
    strict:true
})

accountRouter.get("/me",authMiddleware,accountService.getUserAccount)
accountRouter.get("/me/statment",authMiddleware,accountService.getStatment)

export default accountRouter