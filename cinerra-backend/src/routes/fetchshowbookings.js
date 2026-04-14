import express from "express";
import Bookings from "../models/Bookings.js";   


const router = express.Router();




router.get("/show/:showId", async (req, res) => {
    try {

        const bookings = await Bookings.find({
            "show.showId": req.params.showId,
            paymentStatus: { $in: ["pending", "paid"] }
        });

        res.json(bookings);

    } catch (err) {

        console.error("Error fetching show bookings:", err);
        res.status(500).json({ message: "Failed to fetch bookings" });

    }
});

export default router;