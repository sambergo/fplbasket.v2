import mongoose from "mongoose";

const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI || ""
    : "mongodb://localhost:27017/";

// const dbName = "fplbasket";
console.log("MONGO_URI:", MONGO_URI);
async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(MONGO_URI);
}

export default dbConnect;
