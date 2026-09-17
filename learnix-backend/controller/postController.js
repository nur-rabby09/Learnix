import Post from "../model/Post.js";
import User from "../model/user.js";

export const createPost = async (req, res) => {
  const { title, subject, description, time, place, phone } = req.body;

  try {
    const user = await User.findById(req.userId).select(["email"]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newPost = new Post({
      title,
      subject,
      description,
      time,
      place,
      phone: phone || undefined,
      email: user.email,
      createdBy: req.userId,
    });

    await newPost.save();

    return res.status(201).json(newPost);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: "Not allowed to delete this post" });
    }

    await post.deleteOne();

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};