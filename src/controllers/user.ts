import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userDetails } from "../util/userDetails";
import constants from "./../constants";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * @typedef {object} DetailsSuccess
 * @property {string} message - Details success message
 * @property {object} data -  User Details with shopping preference
 */

/**
 * POST /user/details
 * @summary User Details
 * @tags User
 * @security BearerAuth
 * @return {DetailsSuccess} 200 - success response
 */

export const userDetailsInfo = async (req: Request, res: Response) => {
  try {
    let info = await userDetails(req);

    const user = await prisma.user.findUnique({
      where: { id: info.id },
      include: {
        preference: true,
      },
    });
    return res.status(201).json({ message: constants.SUCCESS, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: constants.INTERNAL_SERVER_ERR });
  }
};
