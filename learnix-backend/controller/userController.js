import { hashPassword } from "../utils/helpers.js";
import User from "../model/user.js";

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

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
