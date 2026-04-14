import mongoose from "mongoose";

const UpcomingSchema = new mongoose.Schema({
    id: Number,
    title: String,
    poster: String,
    rating: String,
    genres: [String],
    duration: String,
    releaseDate: String,
    about: String,
    trailerUrl: String,
    cast: [
        { name: String, role: String, imageUrl: String }
    ],
    crew: [
        { name: String, role: String, imageUrl: String }
    ]
}, { timestamps: true });

export default mongoose.model('Upcoming', UpcomingSchema);