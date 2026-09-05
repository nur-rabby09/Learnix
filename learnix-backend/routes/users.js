import express from "express";
import checkToken from "../middlewares/checkToken.js";
import { createUser, getProfile } from "../controller/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/profile", checkToken, getProfile);

export default router;
