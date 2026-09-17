import express from "express";
import checkToken from "../middlewares/checkToken.js";
import { createPost, getPosts, deletePost } from "../controller/postController.js";

const router = express.Router();

router.post("/", checkToken, createPost);
router.get("/", checkToken, getPosts);
router.delete("/:postId", checkToken, deletePost);

export default router;