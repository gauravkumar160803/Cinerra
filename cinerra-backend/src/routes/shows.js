import express from "express";
const router = express.Router();
import Movie from "../models/Movie.js";

router.get("/:showId", async (req, res) => {
    const { showId } = req.params;

    try {
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
                        showId: timing._id.toString(),  // selected show
                        date: date.date,
                        theater: theater.theater,

                        // ✅ Return ALL timings for that theater
                        allTimings: theater.timings.map(t => ({
                            _id: t._id.toString(),
                            time: t.time
                        })),

                        seatingPrices: theater.seatingPrices
                    };
                    break;
                }
            }
            if (showDetails) break;
        }

        res.json({
            movie: {
                title: movie.title,
                poster: movie.poster,
                rating: movie.rating,
                genres: movie.genres,
                duration: movie.duration
            },
            show: showDetails
        });
 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;


