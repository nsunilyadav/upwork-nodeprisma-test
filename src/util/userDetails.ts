import jwt from "jsonwebtoken";

export const userDetails = async (req : any) => {
    const token = req.headers.authorization.replace("Bearer ", "").trim();
    const userInfo: any = await jwt.verify(token, "secretOrPrivateKey");
    return userInfo.data
}
