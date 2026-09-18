import express from "express";
import checkToken from "../middlewares/checkToken.js";
import { createAccessory, getAccessories, deleteAccessory } from "../controller/accessoryController.js";

const router = express.Router();

router.post("/", checkToken, createAccessory);
router.get("/", getAccessories);
router.delete("/:accessoryId", checkToken, deleteAccessory);

export default router;