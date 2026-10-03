import express from "express";
import checkToken from "../middlewares/checkToken.js";
import {
  createUser,
  getProfile,
  updateProfile,
  getPublicProfile,
} from "../controller/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/profile", checkToken, getProfile);
router.put("/profile", checkToken, updateProfile);
router.get("/:userId", checkToken, getPublicProfile);

export default router;