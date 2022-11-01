import mongoose from "mongoose";

const standingsSchema = new mongoose.Schema(
  {
    id: "String",
    ex: "Number",
    new_entries: {
      has_next: {
        type: "Boolean",
      },
      page: {
        type: "Number",
      },
      results: {
        type: "Array",
      },
    },
    last_updated_data: {
      type: "Date",
    },
    league: {
      id: {
        type: "Number",
      },
      name: {
        type: "String",
      },
      created: {
        type: "Date",
      },
      closed: {
        type: "Boolean",
      },
      max_entries: {
        type: "Mixed",
      },
      league_type: {
        type: "String",
      },
      scoring: {
        type: "String",
      },
      admin_entry: {
        type: "Number",
      },
      start_event: {
        type: "Number",
      },
      code_privacy: {
        type: "String",
      },
      has_cup: {
        type: "Boolean",
      },
      cup_league: {
        type: "Mixed",
      },
      rank: {
        type: "Mixed",
      },
    },
    standings: {
      has_next: {
        type: "Boolean",
      },
      page: {
        type: "Number",
      },
      results: {
        type: ["Mixed"],
      },
    },
    managers: {
      type: ["Mixed"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Standings ||
  mongoose.model("Standings", standingsSchema);
