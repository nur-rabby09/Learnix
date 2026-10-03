import express from "express";
import checkToken from "../middlewares/checkToken.js";
import {
  createPost,
  getPosts,
  deletePost,
  showInterest,
  getInterests,
  respondToInterest,
} from "../controller/postController.js";

const router = express.Router();

router.post("/", checkToken, createPost);
router.get("/", checkToken, getPosts);
router.delete("/:postId", checkToken, deletePost);
router.post("/:postId/interest", checkToken, showInterest);
router.get("/:postId/interests", checkToken, getInterests);
router.patch("/:postId/interests/:interestId", checkToken, respondToInterest);

export default router;