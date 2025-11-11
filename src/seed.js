import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/Listing.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URL);

await Listing.deleteMany({});
await Listing.insertMany([
  {
    title: "DHA Phase 6 - 1 Kanal",
    city: "Lahore",
    price: 85000000,
    type: "rent",
    images: ["https://placehold.co/600x400"]
  },
  {
    title: "Bahria Town - 1 Kanal",
    city: "Lahore",
    price: 75000000,
    type: "sale",
    images: ["https://placehold.co/600x400"]
  },
  {
    title: "E-11 Apartment",
    city: "Islamabad",
    price: 45000,
    type: "rent",
    images: ["https://placehold.co/600x400"]
  },
]);

console.log("seed done");
process.exit();