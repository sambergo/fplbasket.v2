import cors from "cors";
import express from "express";
require("dotenv").config();

const main = async () => {
  const app = express();
  const PORT = process.env.PORT;
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
