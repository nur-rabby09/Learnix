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
export const reserveStudySpace = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, seats, reservationDate } = req.body;

  if (!name || !phone || !email || !reservationDate) {
    return res.status(400).json({ error: "name, phone, email and reservation date are required" });
  }

  const parsedDate = new Date(reservationDate);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({ error: "Invalid reservation date" });
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsedDate < today) {
    return res.status(400).json({ error: "Reservation date can't be in the past" });
  }

  const seatsRequested = Number(seats) || 1;
  if (seatsRequested < 1) {
    return res.status(400).json({ error: "seats must be at least 1" });
  }

  try {
    // Atomic "decrement only if enough seats are still free" update, so two
    // people reserving the last seat at the same moment can't both succeed
    // (a plain read-then-save would have that race condition).
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
      reservationDate: parsedDate,
    });

    return res.status(201).json({ space, reservation });
  } catch (err) {
    return res.status(400).json(err);
  }
};