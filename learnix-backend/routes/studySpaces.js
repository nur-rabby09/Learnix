import express from "express";
import checkToken from "../middlewares/checkToken.js";
import {
  listStudySpaces,
  createStudySpace,
  reserveStudySpace,
} from "../controller/studySpaceController.js";

const router = express.Router();

router.get("/", listStudySpaces);
router.post("/", checkToken, createStudySpace); // seeding/admin only, not linked from the UI
router.post("/:id/reserve", checkToken, reserveStudySpace);

export default router;