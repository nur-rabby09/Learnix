import { Schema, model } from "mongoose";

const requestSchema = new Schema(
  {
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      default: "",
    },
    phone: {
      type: Schema.Types.String,
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

const accessorySchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    item: {
      type: Schema.Types.String,
      required: true,
    },
    model: {
      type: Schema.Types.String,
      required: true,
    },
    date: {
      type: Schema.Types.String,
      required: true,
    },
    time: {
      type: Schema.Types.String,
      required: true,
    },
    location: {
      type: Schema.Types.String,
      required: true,
    },
    phone: {
      type: Schema.Types.String,
      required: true,
    },
    available: {
      type: Schema.Types.Boolean,
      default: true,
    },
    requests: {
      type: [requestSchema],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const Accessory = model("Accessory", accessorySchema);
export default Accessory;