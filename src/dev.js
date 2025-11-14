import app, { connectDB } from "./index.js";
const port = process.env.PORT || 5000;

await connectDB();
app.listen(port, () => console.log("Dev server running on", port));