import mongoose from "mongoose";

const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI || ""
    : "mongodb://localhost:27017/";

// const dbName = "fplbasket";
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(MONGO_URI);
}

export default dbConnect;
