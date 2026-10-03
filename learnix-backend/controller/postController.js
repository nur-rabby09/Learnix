import Post from "../model/Post.js";
import User from "../model/user.js";

export const createPost = async (req, res) => {
  const { title, subject, description, time, place } = req.body;

  try {
    const user = await User.findById(req.userId).select(["email", "phone"]);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Phone number always comes from the user's profile
    const newPost = new Post({
      title,
      subject,
      description,
      time,
      place,
      phone: user.phone || undefined,
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
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", ["firstName", "lastName", "email", "phone"]);

    // Poster name, email and phone are always read from the poster's current profile
    const result = posts.map((post) => {
      const data = post.toObject();
      const poster = data.createdBy;
      const interests = data.interests || [];
      const mine = interests.find((item) => item.user.toString() === req.userId);

      const { interests: _interests, ...rest } = data;

      return {
        ...rest,
        createdBy: poster ? poster._id : null,
        posterName: poster ? `${poster.firstName} ${poster.lastName}` : "",
        email: poster ? poster.email : data.email,
        phone: poster ? poster.phone || "" : data.phone || "",
        myInterest: mine ? mine.status : null,
        interestCount: interests.length,
      };
    });

    return res.status(200).json(result);
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

// POST /api/posts/:postId/interest - "I'm interested" button
export const showInterest = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.createdBy.toString() === req.userId) {
      return res.status(400).json({ error: "You can't show interest in your own post" });
    }

    const alreadyInterested = post.interests.some(
      (item) => item.user.toString() === req.userId,
    );
    if (alreadyInterested) {
      return res.status(409).json({ error: "You have already shown interest" });
    }

    post.interests.push({ user: req.userId });
    await post.save();

    return res.status(201).json({ message: "Interest sent", status: "pending" });
  } catch (err) {
    return res.status(400).json({ error: "Could not send your interest" });
  }
};

// GET /api/posts/:postId/interests - only the post owner can see who is interested
export const getInterests = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("interests.user", [
      "firstName",
      "lastName",
      "university",
      "department",
    ]);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: "Not allowed to see this list" });
    }

    const list = post.interests
      .filter((item) => item.user)
      .map((item) => ({
        _id: item._id,
        status: item.status,
        user: {
          _id: item.user._id,
          firstName: item.user.firstName,
          lastName: item.user.lastName,
          university: item.user.university || "",
          department: item.user.department || "",
        },
      }));

    return res.status(200).json(list);
  } catch (err) {
    return res.status(400).json({ error: "Could not load the list" });
  }
};

// PATCH /api/posts/:postId/interests/:interestId - owner accepts or declines
export const respondToInterest = async (req, res) => {
  const { postId, interestId } = req.params;
  const { status } = req.body;

  if (status !== "accepted" && status !== "declined") {
    return res.status(400).json({ error: "Status must be accepted or declined" });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: "Not allowed to answer these requests" });
    }

    const interest = post.interests.id(interestId);

    if (!interest) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (interest.status !== "pending") {
      return res.status(400).json({ error: "This request has already been answered" });
    }

    interest.status = status;
    await post.save();

    return res.status(200).json({ message: "Answer saved", status });
  } catch (err) {
    return res.status(400).json({ error: "Could not answer the request" });
  }
};