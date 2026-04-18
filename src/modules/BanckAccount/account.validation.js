import joi from "joi";
import { general_rules } from "../../common/utils/general.rules";

export const transferTransaction_schema={
    body:joi.object({
        start_date:general_rules.date.required(),
        end_date:general_rules.date.required()
    })
}