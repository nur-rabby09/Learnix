import { Schema, model } from "mongoose";

const userSchema = new Schema({
  firstName: {
    type: Schema.Types.String,
    required: true,
  },
  lastName: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
    unique: true,
    match: [
      /^[a-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|live)\.com$/,
      "Invalid email format",
    ],
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
});

const User = model("User", userSchema);
export default User;