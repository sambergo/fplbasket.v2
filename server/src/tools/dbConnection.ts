import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

const dbName = "fplbasket";

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(MONGO_URI + dbName);
}

export default dbConnect;
