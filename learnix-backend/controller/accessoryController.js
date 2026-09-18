import Accessory from "../model/Accessory.js";

export const createAccessory = async (req, res) => {
  const { name, item, model, date, time, location, phone } = req.body;

  try {
    const newAccessory = new Accessory({
      name,
      item,
      model,
      date,
      time,
      location,
      phone,
      createdBy: req.userId,
    });

    await newAccessory.save();

    return res.status(201).json(newAccessory);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const getAccessories = async (req, res) => {
  try {
    const accessories = await Accessory.find().sort({ createdAt: -1 });
    return res.status(200).json(accessories);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export const deleteAccessory = async (req, res) => {
  const { accessoryId } = req.params;

  try {
    const accessory = await Accessory.findById(accessoryId);

    if (!accessory) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (accessory.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: "Not allowed to delete this item" });
    }

    await accessory.deleteOne();

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    return res.status(400).json(err);
  }
};