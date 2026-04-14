import express from "express";
import Booking from "../models/Bookings.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/validate-payment", async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: "Booking ID required" });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.user.toString() !== req.dbUser._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        if (booking.paymentStatus !== "pending") {
            return res.status(400).json({ message: "Booking already processed" });
        }

        if (!booking.expiresAt || booking.expiresAt < new Date()) {
            booking.paymentStatus = "failed";
            await booking.save();
            return res.status(400).json({ message: "Booking session expired" });
        }

        // 🔥 return existing order if already created
        if (booking.paymentIntentId) {
            const existingOrder = await razorpay.orders.fetch(booking.paymentIntentId);
            return res.json({
                success: true,
                order: existingOrder,
                expiresAt: booking.expiresAt
            });
        }

        // 🔥 FIX: ensure amount is integer (paise)
        const amountInPaise = Math.round(Number(booking.totalPrice) * 100);

        if (!Number.isInteger(amountInPaise)) {
            return res.status(400).json({ message: "Invalid amount calculation" });
        }

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: booking.referenceCode,
            notes: {
                bookingId: booking._id.toString(),
            }
        });

        // extend expiry
        booking.expiresAt = new Date(Date.now() + 8 * 60 * 1000);
        booking.paymentIntentId = order.id;

        await booking.save();

        res.json({
            success: true,
            order,
            expiresAt: booking.expiresAt
        });

    } catch (err) {
        console.error("validate-payment error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;