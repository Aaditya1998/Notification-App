import { inAppNotification } from "../Novu/novu.js";
import Notif from "../models/notif.js";

export const createNotif = async (req, res) => {
  const { description } = req.body;

  try {
    // Check if a notification with the same description already exists
    const existingNotif = await Notif.findOne({ description });

    if (existingNotif) {
      // Handle conflict - a notification with the same description already exists
      return res.status(409).json({ message: "Notification already exists." });
    }

    // If no conflict, create and save the new notification
    const newNotif = new Notif({ description });
    await newNotif.save();

    // Send in-app notification
    await inAppNotification(description, "64f23ae4bfc062112c128dfc");

    // Respond with the newly created notification
    res.status(201).json(newNotif);
  } catch (error) {
    // Handle other errors gracefully
    res.status(500).json({ message: "Server error." });
  }
};
