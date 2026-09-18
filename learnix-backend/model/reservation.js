import { Schema, model } from "mongoose";

const reservationSchema = new Schema(
  {
    studySpace: {
      type: Schema.Types.ObjectId,
      ref: "StudySpace",
      required: true,
    },
    reservedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: Schema.Types.String, required: true },
    phone: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    seats: { type: Schema.Types.Number, required: true, min: 1 },
  },
  { timestamps: true },
);

const Reservation = model("Reservation", reservationSchema);
export default Reservation;