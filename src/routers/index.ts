import express from "express";
import {activateAccount, login, resetPassword, signUp} from "./../controllers/auth";
import {addPreference} from "./../controllers/shop";
import {userDetailsInfo} from "./../controllers/user";
import {verifyToken} from "./../middleware/auth";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signUp);
router.post("/reset-password", verifyToken, resetPassword);
router.patch("/active/:activateUserToke", activateAccount);
router.post("/preference", verifyToken, addPreference);
router.get("/user/details", verifyToken, userDetailsInfo);

export default router;
