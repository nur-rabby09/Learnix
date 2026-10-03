import { Schema, model } from "mongoose";

// A student who clicked "Interested" on a post
const interestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const postSchema = new Schema(
  {
    title: {
      type: Schema.Types.String,
      required: true,
    },
    subject: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    time: {
      type: Schema.Types.String,
      required: true,
    },
    place: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    phone: {
      type: Schema.Types.String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interests: {
      type: [interestSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const Post = model("Post", postSchema);
export default Post;