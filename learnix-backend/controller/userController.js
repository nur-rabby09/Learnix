import { hashPassword } from "../utils/helpers.js";
import User from "../model/user.js";
import jwt from "jsonwebtoken";

const lifetime = 3600000;
const isProd = process.env.NODE_ENV === "production";
const emailRegex = /^[a-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|live)\.com$/;

// Fields a user is allowed to edit from the Profile page
const EDITABLE_FIELDS = [
  "firstName",
  "lastName",
  "university",
  "department",
  "studentId",
  "currentSemester",
  "startDate",
  "graduationDate",
  "phone",
  "bio",
];

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email }).select(["email"]);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: lifetime / 1000 },
    );

    res.cookie("token", token, {
      maxAge: lifetime,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
    });

    return res.status(201).json({ message: "New user added successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getProfile = async (req, res) => {
  try {
    const userInfo = await User.findById(req.userId).select(["-password", "-__v"]);
    return res.status(200).json(userInfo);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  const updates = {};

  for (const field of EDITABLE_FIELDS) {
    if (req.body[field] !== undefined) {
      updates[field] = String(req.body[field]).trim();
    }
  }

  if ("firstName" in updates && !updates.firstName) {
    return res.status(400).json({ error: "First name can't be empty" });
  }

  if ("lastName" in updates && !updates.lastName) {
    return res.status(400).json({ error: "Last name can't be empty" });
  }

  if (updates.bio && updates.bio.length > 300) {
    return res.status(400).json({ error: "Bio must be 300 characters or less" });
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  for (const field of ["startDate", "graduationDate"]) {
    if (updates[field] && !dateRegex.test(updates[field])) {
      return res.status(400).json({ error: `${field} must be in YYYY-MM-DD format` });
    }
  }

  if (
    updates.startDate &&
    updates.graduationDate &&
    updates.graduationDate < updates.startDate
  ) {
    return res.status(400).json({ error: "Graduation date can't be before the start date" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true },
    ).select(["-password", "-__v"]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(400).json({ error: "Could not update profile" });
  }
};