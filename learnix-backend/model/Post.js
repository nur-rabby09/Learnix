import { Schema, model } from "mongoose";

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
  },
  { timestamps: true },
);

const Post = model("Post", postSchema);
export default Post;