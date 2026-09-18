import { Schema, model } from "mongoose";

const studySpaceSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  location: {
    type: Schema.Types.String,
    required: true,
  },
  category: {
    type: Schema.Types.String,
    enum: ["Library", "Cafe", "Lounge"],
    required: true,
  },
  seatsAvailable: {
    type: Schema.Types.Number,
    required: true,
    min: 0,
  },
  seatsTotal: {
    type: Schema.Types.Number,
    required: true,
    min: 1,
  },
  photoUrl: {
    type: Schema.Types.String,
    default: null, // filled in later once Cloudinary uploads are wired up
  },
});

const StudySpace = model("StudySpace", studySpaceSchema);
export default StudySpace;