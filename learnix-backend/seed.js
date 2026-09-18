// Run once with: node seed.js
// Populates the study spaces collection so GET /api/study-spaces isn't
// empty on a fresh database. Safe to re-run - it clears and re-inserts.
import "dotenv/config";
import mongoose from "mongoose";
import StudySpace from "./model/studySpace.js";

const SPACES = [
  { name: "AUST Central Library", location: "3rd Floor, Main Building", category: "Library", seatsAvailable: 12, seatsTotal: 40 },
  { name: "CSE Building Lounge", location: "Ground Floor, CSE Building", category: "Lounge", seatsAvailable: 0, seatsTotal: 20 },
  { name: "Campus Cafe", location: "Near West Gate", category: "Cafe", seatsAvailable: 5, seatsTotal: 15 },
  { name: "Quiet Study Room", location: "4th Floor, Library", category: "Library", seatsAvailable: 3, seatsTotal: 10 },
  { name: "Rooftop Lounge", location: "6th Floor, Academic Block", category: "Lounge", seatsAvailable: 8, seatsTotal: 25 },
  { name: "Coffee Corner", location: "1st Floor, Student Center", category: "Cafe", seatsAvailable: 0, seatsTotal: 12 },
];

const run = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
  await StudySpace.deleteMany({});
  await StudySpace.insertMany(SPACES);
  console.log(`Seeded ${SPACES.length} study spaces.`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});