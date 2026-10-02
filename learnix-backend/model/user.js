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

  // Optional student info - blank for new users, filled in from the Profile page
  university: { type: Schema.Types.String, default: "" },
  department: { type: Schema.Types.String, default: "" },
  studentId: { type: Schema.Types.String, default: "" },
  currentSemester: { type: Schema.Types.String, default: "" },
  startDate: { type: Schema.Types.String, default: "" },
  graduationDate: { type: Schema.Types.String, default: "" },
  phone: { type: Schema.Types.String, default: "" },
  bio: { type: Schema.Types.String, default: "", maxlength: 300 },
});

const User = model("User", userSchema);
export default User;