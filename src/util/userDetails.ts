import jwt from "jsonwebtoken";

export const userDetails =async(req:any)=>{
    const token: string = req.headers.authorization || "";
    const userInfo: any = await jwt.verify(token, "secretOrPrivateKey");
    return userInfo.data
}