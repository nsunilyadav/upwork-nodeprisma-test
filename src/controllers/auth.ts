import {PrismaClient} from "@prisma/client";
import bcrypt from "bcrypt";
import {Request, Response} from "express";
import {userDetails} from "../util/userDetails";
import constants from "./../constants";
import {generateToken} from "./../util/jwt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface UserInfo {
    name: string;
    email: string;
    id: string;
    dob: string;
    password: string;
}

/**
 * @typedef {object} LoginRequest
 * @property {string} email.required
 * @property {string} password.required
 */

/**
 * @typedef {object} LoginSuccess
 * @property {string} message - login success message
 * @property {string} token - JWT token
 * @property {string} expires - expiration time epoch time string
 */

/**
 * POST /login
 * @summary User login
 * @tags Auth
 * @param {LoginRequest} request.body.required - login body - application/json
 * @return {LoginSuccess} 200 - success response
 */
export const login = async (req : Request, res : Response) => {
    try {
        let data: UserInfo = req.body;
        let userDetails = await prisma.user.findFirst({
            where: {
                email: data.email,
                status: "activated"
            }
        });
        if (! userDetails) {
            return res.status(400).json({message: constants.EMAIL_PASS_INCORRECT});
        }
        const comparePassword = await bcrypt.compare(data.password, userDetails.password);
        if (! comparePassword) {
            return res.status(400).json({message: constants.EMAIL_PASS_INCORRECT});
        }
        return res.status(200).json({
            message: "login success",
            token: generateToken(userDetails),
            expires: new Date().getTime() + 36000000
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: constants.INTERNAL_SERVER_ERR});
    }
};

/**
 * @typedef {object} SignupRequest
 * @property {string} name.required
 * @property {string} email.required
 * @property {string} password.required
 * @property {string} dob.required
 */

/**
 * @typedef {object} SignupSuccess
 * @property {string} message - login success message
 * @property {string} data - user details
 */

/**
 * POST /signup
 * @summary User Signup
 * @tags Auth
 * @param {SignupRequest} request.body.required - signup body - application/json
 * @return {SignupSuccess} 201 - success response
 */
export const signUp = async (req : Request, res : Response) => {
    try {
        const data: any = req.body;
        console.log(data, "......");
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
        data.activateUserToken = generateToken({email: data.email});
        let UserInfo = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        });
        console.log(UserInfo, "USerinfo.....");
        if (UserInfo) {
            return res.status(400).json({message: constants.USER_ALREADY_EXIST});
        }
        const userDetails = await prisma.user.create({data});
        return res.status(201).json({message: constants.SUCCESS, data: userDetails});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: constants.INTERNAL_SERVER_ERR});
    }
};

/**
 * @typedef {object} ResetPasswordRequest
 * @property {string} password.required
 */

/**
 * @typedef {object} ResetPasswordSuccess
 * @property {string} message - login success message
 */

/**
 * POST /reset-password
 * @summary User Reset Password
 * @tags Auth
 * @security BearerAuth
 * @param {ResetPasswordRequest} request.body.required - reset password body - application/json
 * @return {ResetPasswordSuccess} 200 - success response
 */
export const resetPassword = async (req : Request, res : Response) => {
    try {
        const {password} : {
            password: string;
        } = req.body;
        const token: string = req.params.activateUserToke;
        const info = await userDetails(req);
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        let data = await prisma.user.update({
            where: {
                email: String(info.email)
            },
            data: {
                password: hashPassword
            }
        });
        return res.status(200).json({message: constants.SUCCESS});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: constants.INTERNAL_SERVER_ERR});
    }
};

/**
 * @typedef {object} ActivateAccountSuccess
 * @property {string} message - User activate success message
 */

/**
 * PATCH /active/{activateUserToken}
 * @summary User Signup
 * @tags Auth
 * @param {string} activateUserToken.path.required - activate body - application/json
 * @return {ActivateAccountSuccess} 201 - success response
 */
export const activateAccount = async (req : Request, res : Response) => {
    try {
        const token: string = req.params.activateUserToke;
        const info: any = await jwt.verify(token, "secretOrPrivateKey");
        await prisma.user.update({
            where: {
                email: String(info.data.email)
            },
            data: {
                status: "activated"
            }
        });
        return res.status(200).json({message: constants.SUCCESS});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: constants.INTERNAL_SERVER_ERR});
    }
};
