import crypto from "crypto";
import express from "express";
import Booking from "../models/Bookings.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Razorpay instance forpayment verification and refunds
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post("/verify-payment", async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        // 🔒 Verify signature FIRST before any DB work
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // 🔍 Find booking using razorpay order id
        const booking = await Booking.findOne({
            paymentIntentId: razorpay_order_id
        });

        // 🔴 Case 1: Booking missing (TTL deleted it during payment)
        // With two-phase expiry this is now an extreme edge case
        if (!booking) {
            try {
                await razorpay.payments.refund(razorpay_payment_id, {
                    notes: { reason: "Booking session expired before payment was confirmed" }
                });
            } catch (refundErr) {
                console.error("Refund failed for missing booking:", refundErr);
            }
            return res.status(400).json({
                message: "Your booking session expired. Payment has been refunded automatically."
            });
        }

        // ✅ Idempotency — already paid (handles duplicate webhook or double call)
        if (booking.paymentStatus === "paid") {
            return res.json({ success: true, bookingId: booking._id });
        }

        // 🔴 Case 2: Booking exists but expiry window passed
        if (booking.expiresAt && booking.expiresAt < new Date()) {
            try {
                await razorpay.payments.refund(razorpay_payment_id, {
                    notes: { reason: "Payment arrived after booking expiry window" }
                });
            } catch (refundErr) {
                console.error("Refund failed for expired booking:", refundErr);
            }

            booking.paymentStatus = "failed";
            await booking.save();

            return res.status(400).json({
                message: "Your session expired. Payment has been refunded automatically."
            });
        }

        // 🟢 All good — confirm the booking
        booking.paymentStatus = "paid";
        booking.expiresAt = null;  // null removes it from TTL consideration permanently
        booking.paymentIntentId = razorpay_payment_id; // overwrite order_id with actual payment_id

        await booking.save();

        res.json({ success: true, bookingId: booking._id });

    } catch (err) {
        console.error("verify-payment error:", err);
        res.status(500).json({ message: "Server error during payment verification" });
    }
});

export default router;