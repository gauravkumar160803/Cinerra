import express from "express";
import Booking from "../models/Bookings.js";
import { requireAuth } from "@clerk/express";

const router = express.Router();


/* ===============================
   GET all bookings of logged user
   GET /api/bookings
================================ */

router.get("/", async (req, res) => {
  try {

    const userId = req.dbUser._id;

    const bookings = await Booking.find({ user: userId })
      .populate("movie", "title poster rating genres")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});


/* ===============================
   GET specific booking (payment)
   GET /api/bookings/:bookingId
================================ */

router.get("/:bookingId", async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.bookingId)
      .populate("movie")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // optional but recommended security
    if (!booking.user._id.equals(req.dbUser._id)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (
      booking.paymentStatus !== "pending" ||
      booking.expiresAt <= new Date()
    ) {
      return res.status(410).json({ message: "Booking expired" });
    }

    res.json(booking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
