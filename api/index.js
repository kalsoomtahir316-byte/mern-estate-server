import app, { connectDB } from "../src/index.js";

export default async function handler(req, res) {
  await connectDB();      // ensure DB ready in serverless
  return app(req, res);   // let Express handle the request
}