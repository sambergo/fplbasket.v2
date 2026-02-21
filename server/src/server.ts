import "dotenv/config";
import cors from "cors";
import express from "express";

const PORT = process.env.PORT;
if (!PORT) {
  console.error("Error: PORT environment variable is required but not set.");
  process.exit(1);
}

const main = async () => {
  const app = express();
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static("build"));
  app.use("/id/*", express.static("build"));
  app.use("/api/data", require("./routes/bssData"));
  app.use("/api/league", require("./routes/league"));
  app.use("/api/live", require("./routes/live"));

  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at PORT: ${PORT}`);
  });
};

main().catch((err) => {
  console.error(err);
});
