import Accessory from "../model/Accessory.js";
import User from "../model/user.js";

export const createAccessory = async (req, res) => {
  const { item, model, date, time, location } = req.body;

  try {
    const user = await User.findById(req.userId).select([
      "firstName",
      "lastName",
      "phone",
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.phone) {
      return res
        .status(400)
        .json({ error: "Please add your phone number to your profile first" });
    }

    const newAccessory = new Accessory({
      name: `${user.firstName} ${user.lastName}`,
      item,
      model,
      date,
      time,
      location,
      phone: user.phone,
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
    const accessories = await Accessory.find()
      .select("-requests")
      .sort({ createdAt: -1 });
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

export const requestAccessory = async (req, res) => {
  const { accessoryId } = req.params;

  try {
    const user = await User.findById(req.userId).select([
      "firstName",
      "lastName",
      "email",
      "phone",
    ]);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.phone) {
      return res
        .status(400)
        .json({ error: "Please add your phone number to your profile first" });
    }

    const name = `${user.firstName} ${user.lastName}`;

    const accessory = await Accessory.findById(accessoryId);

    if (!accessory) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (accessory.createdBy.toString() === req.userId) {
      return res.status(400).json({ error: "You can't request your own item" });
    }

    if (!accessory.available) {
      return res.status(409).json({ error: "This item is not available anymore" });
    }

    for (const request of accessory.requests) {
      if (request.requestedBy.toString() === req.userId) {
        return res.status(409).json({ error: "You have already requested this item" });
      }
    }

    accessory.requests.push({
      requestedBy: req.userId,
      name,
      email: user.email,
      phone: user.phone,
    });

    await accessory.save();

    return res.status(201).json({ message: "Request sent successfully" });
  } catch {
    return res.status(400).json({ error: "Could not send the request" });
  }
};

export const getRequests = async (req, res) => {
  const { accessoryId } = req.params;

  try {
    const accessory = await Accessory.findById(accessoryId);

    if (!accessory) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (accessory.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: "Not allowed to see these requests" });
    }

    return res.status(200).json(accessory.requests);
  } catch {
    return res.status(400).json({ error: "Could not load the requests" });
  }
};

export const respondToRequest = async (req, res) => {
  const { accessoryId, requestId } = req.params;
  const { status } = req.body;

  if (status !== "accepted" && status !== "declined") {
    return res.status(400).json({ error: "Status must be accepted or declined" });
  }

  try {
    const accessory = await Accessory.findById(accessoryId);

    if (!accessory) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (accessory.createdBy.toString() !== req.userId) {
      return res.status(403).json({ error: "Not allowed to answer these requests" });
    }

    const request = accessory.requests.id(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ error: "This request has already been answered" });
    }

    if (status === "accepted") {
      if (!accessory.available) {
        return res.status(409).json({ error: "You have already accepted a request" });
      }

      request.status = "accepted";
      accessory.available = false;

      for (const otherRequest of accessory.requests) {
        if (otherRequest.status === "pending") {
          otherRequest.status = "declined";
        }
      }
    } else {
      request.status = "declined";
    }

    await accessory.save();

    return res.status(200).json(accessory.requests);
  } catch {
    return res.status(400).json({ error: "Could not answer the request" });
  }
};

export const getMyRequests = async (req, res) => {
  try {
    const accessories = await Accessory.find({
      "requests.requestedBy": req.userId,
    }).select("requests");

    const myRequests = [];

    for (const accessory of accessories) {
      for (const request of accessory.requests) {
        if (request.requestedBy.toString() === req.userId) {
          myRequests.push({
            accessoryId: accessory._id,
            status: request.status,
          });
        }
      }
    }

    return res.status(200).json(myRequests);
  } catch {
    return res.status(400).json({ error: "Could not load your requests" });
  }
};