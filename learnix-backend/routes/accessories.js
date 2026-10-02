import express from "express";
import checkToken from "../middlewares/checkToken.js";
import {
  createAccessory,
  getAccessories,
  deleteAccessory,
  requestAccessory,
  getRequests,
  respondToRequest,
  getMyRequests,
} from "../controller/accessoryController.js";

const router = express.Router();

router.post("/", checkToken, createAccessory);
router.get("/", getAccessories);
router.get("/my-requests", checkToken, getMyRequests);
router.delete("/:accessoryId", checkToken, deleteAccessory);
router.post("/:accessoryId/requests", checkToken, requestAccessory);
router.get("/:accessoryId/requests", checkToken, getRequests);
router.patch("/:accessoryId/requests/:requestId", checkToken, respondToRequest);

export default router;