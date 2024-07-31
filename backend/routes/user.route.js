import express from "express";
import { Login, Logout, ProfileUpdate, Register } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(Register)
router.route("/login").post(Login)
router.route("/profile/update").post(isAuthenticated , ProfileUpdate)
router.route("/logout").get(Logout)

export default router;