import userModel from "../../DB/models/user.model.js";
import * as dbService from "../../DB/db.service.js";
import * as success from "../../common/utils/successRes.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import {
    decrypt,
    encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { v4 as uuidv4 } from "uuid";
import * as authService from "../../common/utils/auth.service.js";
import * as configService from "../../../config/config.service.js";
import banckAccountModel from "../../DB/models/banckAccount.model.js";



export const signUp = async (req, res) => {

    const { fullName, email, password, cPassowrd } = req.body;
    if (await dbService.findOne({ model: userModel, filter: { email } })) {
        throw new Error("email already exist", { cause: 400 });
    }

    
    const user = await dbService.create({
        model: userModel,
        data: {
            fullName,
            email,
            password: Hash({ plainText: password, saltRounds: 12 }),
        },
    });

    const generateAccountNumber = Math.floor(Math.random() * 900000 + 100000);
    const accountExist = await dbService.findOne({
        model:banckAccountModel,
        filter:{
            accountNumber:generateAccountNumber,
        }
    })
    const user_account = await dbService.create({
        model: banckAccountModel,
        data: {
            userId:user._id,
            accountNumber:generateAccountNumber,
            balance:0
        },
    });
    
    return success.success_response({ res, status: 201, data: user });
};


export const signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await dbService.findOne({ 
        model: userModel, 
        filter: { 
            email 
        } });
    if (!user) {
        throw new Error("email not exist you need to creat an acount", {
            cause: 404,
        });
    }
    if (!Compare({ plainText: password, cipherText: user.password })) {
        throw new Error("Invalid password", { cause: 400 });
    }


    const randomID = uuidv4(); // to generate random id for the token

    const access_token = authService.generateToken(
        //payload (data will be encrypted into the token)
        {
            payload: {
                id: user._id,
                email: user.email,
            },
            secret_key: configService.ACCESS_SECRET_KEY,
            options: {
                expiresIn: "15m", // this token will be expired after 1 hour
                jwtid: randomID, // make the id for the access token like the refresh token to expire theme when the user logout
            },
        },
    );
    const refresh_token = authService.generateToken({
        payload: {
            id: user._id,
            email: user.email,
        },
        secret_key: configService.REFRESH_SECRET_KEY,
        options: {
            expiresIn: "30d",
            jwtid: randomID, // make the id for the access token like the refresh token to expire theme when the user logout
        },
    });
    success.success_response({
        res,
        message: "logged in successfully",
        data: { access_token, refresh_token },
    });
};

