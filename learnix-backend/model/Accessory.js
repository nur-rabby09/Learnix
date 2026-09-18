import { Schema, model } from "mongoose";

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