import express from "express";
import Movie from "../models/Movie.js";
import Upcoming from "../models/UpSchema.js";

const router = express.Router();

// ================= ADD MOVIE SHOW =================
router.post("/add-movie-show", async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const {
            title,
            poster,
            rating,
            genres,
            duration,
            releaseDate,
            about,
            trailerUrl,
            cast = [],
            crew = [],
            showDates = []
        } = req.body;


        if (!title || !poster) {
            return res.status(400).json({
                success: false,
                message: "Title and Poster required"
            });
        }

        const movieData = {
            title,
            poster,
            rating,
            genres,
            duration,
            releaseDate,
            about,
            trailerUrl: trailerUrl || "",

            cast: cast.map((c, i) => ({
                id: i + 1,
                name: c.name,
                role: c.role,
                imageUrl: c.imageUrl || ""
            })),

            crew: crew.map((c, i) => ({
                id: i + 1,
                name: c.name,
                role: c.role,
                imageUrl: c.imageUrl || ""
            })),

            showDates // already structured from frontend
        };

        const movie = await Movie.create(movieData);

        return res.status(201).json({
            success: true,
            console: "Movie show added successfully",
            movie
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
});


// ================= ADD UPCOMING MOVIE =================

router.post("/add-upcoming-movie", async (req, res) => {
    try {
        console.log("BODY:", req.body);
        const {
            title,
            poster,
            rating,
            genres,
            duration,
            releaseDate,
            about,
            trailerUrl,
            cast = [],
            crew = []
        } = req.body;
        

        // ✅ basic validation
        if (!title || !poster) {
            return res.status(400).json({
                success: false,
                message: "Title and Poster required"
            });
        }

        // ✅ structure data EXACTLY like schema
        const movieData = {
            title,
            poster,
            rating,
            genres,
            duration,
            releaseDate,
            about,
            trailerUrl: trailerUrl || "", // optional fix
            cast: cast.map((c, i) => ({
                id: i + 1,
                name: c.name,
                role: c.role,
                imageUrl: c.imageUrl || ""
            })),
            crew: crew.map((c, i) => ({
                id: i + 1,
                name: c.name,
                role: c.role,
                imageUrl: c.imageUrl || ""
            }))
        };

        const movie = await Upcoming.create(movieData);

        return res.status(201).json({
            success: true,
            console: "Upcoming movie added successfully",
            movie
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false });
    }
});

export default router;