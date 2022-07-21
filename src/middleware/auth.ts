import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import allConstants from "../constants/index";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken: string = req.headers.authorization || "";
    // const token = bearerToken.replace("Bearer ", "").trim();
    const token = bearerToken.replace("Bearer ", "").trim();
    console.log("token", token);
    await jwt.verify(token, "secretOrPrivateKey");
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: allConstants.TOKEN_REQUIRED });
  }
};
