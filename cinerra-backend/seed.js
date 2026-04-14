import "dotenv/config";
import mongoose from "mongoose";
import UpSchema from "./src/models/UpSchema.js";
import upcomings from "./upcoming.js";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB connected");
    console.log(mongoose.connection.name);

    // clear existing to avoid duplicates
    await UpSchema.deleteMany({});
    console.log("Existing upcomings removed");

    const res = await UpSchema.insertMany(upcomings);
    console.log("Seeded upcomings:", res.length);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
