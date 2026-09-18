import StudySpace from "../model/studySpace.js";
import Reservation from "../model/reservation.js";

// GET /api/study-spaces
export const listStudySpaces = async (req, res) => {
  try {
    const spaces = await StudySpace.find();
    return res.status(200).json(spaces);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// POST /api/study-spaces  (developer/admin only - not exposed in the UI)
export const createStudySpace = async (req, res) => {
  const { name, location, category, seatsAvailable, seatsTotal } = req.body;

  try {
    const space = new StudySpace({
      name,
      location,
      category,
      seatsAvailable,
      seatsTotal,
    });
    await space.save();
    return res.status(201).json(space);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// POST /api/study-spaces/:id/reserve  (requires auth)
// Body: { name, phone, email, seats }
// POST /api/study-spaces/:id/reserve  (requires auth)
// Body: { name, phone, email, seats, reservationDate }
export const reserveStudySpace = async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, seats, reservationDate } = req.body;
  
    if (!name || !phone || !email || !reservationDate) {
      return res.status(400).json({ error: "name, phone, email and reservation date are required" });
    }
  
    // Kept as a plain "YYYY-MM-DD" string throughout - never converted into a
    // JS Date object, so there's no timezone shift or time-of-day to worry
    // about. String comparison works fine for past-date checks in this format.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(reservationDate)) {
      return res.status(400).json({ error: "reservationDate must be in YYYY-MM-DD format" });
    }
    const todayStr = new Date().toISOString().split("T")[0];
    if (reservationDate < todayStr) {
      return res.status(400).json({ error: "Reservation date can't be in the past" });
    }
  
    const seatsRequested = Number(seats) || 1;
    if (seatsRequested < 1) {
      return res.status(400).json({ error: "seats must be at least 1" });
    }
  
    try {
      const space = await StudySpace.findOneAndUpdate(
        { _id: id, seatsAvailable: { $gte: seatsRequested } },
        { $inc: { seatsAvailable: -seatsRequested } },
        { new: true },
      );
  
      if (!space) {
        const exists = await StudySpace.findById(id);
        if (!exists) {
          return res.status(404).json({ error: "Study space not found" });
        }
        return res.status(409).json({ error: "Not enough seats available" });
      }
  
      const reservation = await Reservation.create({
        studySpace: space._id,
        reservedBy: req.userId,
        name,
        phone,
        email,
        seats: seatsRequested,
        reservationDate,
      });
  
      return res.status(201).json({ space, reservation });
    } catch (err) {
      return res.status(400).json(err);
    }
  };