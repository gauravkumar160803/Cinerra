import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import connectDB from "./config/db.js";
import moviesRouter from "./routes/movies.js";
import upcomingRoute from "./routes/upcomings.js";
import showRoutes from "./routes/shows.js";
import { clerkMiddleware } from "@clerk/express";
import syncUser from "./middlewares/syncUser.js";
import requireAuth from "./middlewares/requireAuth.js";
import reqAdminAuth from "./middlewares/reqAdminAuth.js";

import createBooking from "./routes/createBooking.js";
import fetchbookings from "./routes/fetchbookings.js";
import validatePayment from "./routes/validatePayment.js";
import verifyPayment from "./routes/verifyPayment.js";
import validateAdmin from "./routes/validateAdmin.js";
import fetchshowbookings from "./routes/fetchshowbookings.js";
import adminLogin from "./routes/adminLogin.js";
import adminMovieRoutes from "./routes/adminMovieRoutes.js";


import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173", // local frontend
    "https://cinerra.vercel.app", // production
    "https://cinerra-git-main-gauravkumar160803s-projects.vercel.app" // preview
  ],
  credentials: true
}));

// Middlewares
app.use(express.json());

// 🔥 SESSION 
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  rolling: true, // reset maxAge on every response so that adminportal does not expire while user is active
  cookie: {
    secure: false, // true in production (HTTPS)
    httpOnly: true,
    maxAge: 10 * 60 * 1000 //10 min age for admin verification session
  }
}));

app.use(clerkMiddleware({
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
}));

// Sync Clerk user with DB
app.use(syncUser);


// PUBLIC ROUTES
app.use('/api/movies', moviesRouter);
app.use('/api/upcomings', upcomingRoute);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", fetchshowbookings);


// PROTECTED ROUTES
app.use("/api/bookings", requireAuth, createBooking);
app.use("/api/bookings", requireAuth, validatePayment);
app.use("/api/bookings", requireAuth, verifyPayment);
app.use("/api/bookings", requireAuth, fetchbookings);

// ADMIN LOGIN ROUTES
app.use("/api/adminlogin", requireAuth, adminLogin);


// ADMIN VALIDATION ROUTE
app.use("/api/validate", requireAuth, reqAdminAuth, validateAdmin);

// ADMIN MOVIE MANAGEMENT ROUTES
app.use("/api/admin/movies", requireAuth, reqAdminAuth, adminMovieRoutes);


// CONNECT DB
connectDB();

app.get("/", (req, res) => {
  res.send("Cinerra Backend Running...");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
