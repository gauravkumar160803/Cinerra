import mongoose from "mongoose";

const CastSchema = new mongoose.Schema({
  id: Number,
  name: String,
  role: String,
  imageUrl: String
}, { _id: false });

const CrewSchema = new mongoose.Schema({
  id: Number,
  name: String,
  role: String,
  imageUrl: String
}, { _id: false });

const SeatingPriceSchema = new mongoose.Schema({
  name: String,
  price: Number,
  rows: [String]
}, { _id: false });

// ✅ Each timing = one show
const TimingSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },

  audi: {                 // screen/auditorium name
    type: String,
    required: true
  }

});

const TheaterSchema = new mongoose.Schema({
  theater: String,
  timings: [TimingSchema],
  seatingPrices: [SeatingPriceSchema]
}, { _id: false });

const ShowDateSchema = new mongoose.Schema({
  date: String,
  theaters: [TheaterSchema]
}, { _id: false });

const MovieSchema = new mongoose.Schema({
  id: Number,
  title: String,
  poster: String,
  rating: String,
  genres: [String],
  duration: String,
  releaseDate: String,
  about: String,
  trailerUrl: String,
  cast: [CastSchema],
  crew: [CrewSchema],
  showDates: [ShowDateSchema]
}, { timestamps: true });

export default mongoose.model("Movie", MovieSchema);

