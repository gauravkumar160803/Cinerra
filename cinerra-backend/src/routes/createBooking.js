import express from "express";
import Booking from "../models/Bookings.js";
import Movie from "../models/Movie.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { showId, seats } = req.body;
        const user = req.dbUser;

        if (!showId || !seats || seats.length === 0) {
            return res.status(400).json({ message: "Missing required data" });
        }

        const selectedSeats = seats;

        const movie = await Movie.findOne({
            "showDates.theaters.timings._id": showId
        });

        if (!movie) {
            return res.status(404).json({ message: "Show not found" });
        }

        let showDetails = null;

        for (const date of movie.showDates) {
            for (const theater of date.theaters) {
                const timing = theater.timings.find(
                    (t) => t._id.toString() === showId
                );

                if (timing) {
                    showDetails = {
                        date: date.date,
                        theater: theater.theater,
                        time: timing.time,
                        audi: timing.audi,        // ✅ adding AUDI INFO
                        seatingPrices: theater.seatingPrices
                    };
                    break;
                }
            }
            if (showDetails) break;
        }

        if (!showDetails) {
            return res.status(404).json({ message: "Invalid show timing" });
        }

        // ✅ SEAT CONFLICT CHECK
        const existingBooking = await Booking.findOne({
            "show.showId": showId,
            seats: { $in: selectedSeats },
            $or: [
                { paymentStatus: "paid" },
                {
                    paymentStatus: "pending",
                    expiresAt: { $gt: new Date() }
                }
            ]
        });

        if (existingBooking) {
            return res.status(409).json({
                message: "One or more seats are already booked or temporarily locked"
            });
        }

        // ✅ PRICE CALCULATION
        let basePrice = 0;

        for (const seat of selectedSeats) {
            const row = seat.charAt(0);

            const priceCategory = showDetails.seatingPrices.find(category =>
                category.rows.includes(row)
            );

            if (!priceCategory) {
                return res.status(400).json({
                    message: `Invalid seat row for seat ${seat}`
                });
            }

            basePrice += priceCategory.price;
        }

        const gst = basePrice * 0.18;
        const totalPrice = Number((basePrice * 1.18).toFixed(2));

        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const booking = await Booking.create({
            user: user._id,
            movie: movie._id,
            theater: showDetails.theater,
            showDate: showDetails.date,
            show: {
                showId: showId,
                showTime: showDetails.time,
                audi: showDetails.audi        // ✅ ADDED HERE
            },
            seats: selectedSeats,
            totalPrice,
            paymentStatus: "pending",
            expiresAt
        });

        res.status(201).json(booking);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
