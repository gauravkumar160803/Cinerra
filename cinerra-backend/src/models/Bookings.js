import mongoose from "mongoose";
import crypto from "crypto";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie",
            required: true,
        },

        theater: {
            type: String,
            required: true,
        },

        showDate: {
            type: String,
            required: true,
        },

        show: {
            showId: {
                type: String,
                required: true,
            },

            showTime: {
                type: String,
                required: true,
            },

            audi: {                // ✅ screen/auditorium name
                type: String,
                required: true,
            },
        },

        seats: {
            type: [String],
            required: true,
            validate: [(val) => val.length > 0, "At least one seat must be selected"],
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        referenceCode: {
            type: String,
            unique: true,
            index: true,
            default: () => {
                return "CIN-" + crypto.randomBytes(4).toString("hex").toUpperCase();
            },
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "cancelled"],
            default: "pending",
            index: true,
        },

        paymentIntentId: {
            type: String,
        },

        expiresAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Compound index for faster seat lookup
bookingSchema.index({ movie: 1, theater: 1, showDate: 1, "show.showTime": 1 });

// For user booking history
bookingSchema.index({ user: 1, createdAt: -1 });

// TTL index for automatic cleanup of expired bookings
bookingSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export default mongoose.model("Booking", bookingSchema);


