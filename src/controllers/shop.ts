import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { userDetails } from "../util/userDetails";
import constants from "./../constants";
const prisma = new PrismaClient();

/**
 * @typedef {object} PreferenceRequest
 * @property {string} preference.required
 */

/**
 * @typedef {object} PreferenceSuccess
 * @property {string} message - Preference success message
 */

/**
 * POST /preference
 * @summary User Shopping Preference
 * @tags Shop
 * @security BearerAuth
 * @param {PreferenceRequest} request.body.required - Preference body - application/json
 * @return {PreferenceSuccess} 200 - success response
 */
export const addPreference = async (req: Request, res: Response) => {
  try {
    const { preference }: { preference: string } = req.body;
    let info = await userDetails(req);
    const user = await prisma.shoppingPreference.create({
      data: {
        preference,
        userId: info.id,
      },
    });
    return res.status(201).json({ message: constants.SUCCESS, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: constants.INTERNAL_SERVER_ERR });
  }
};
