import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    active_chip: {
      type: "String",
    },
    automatic_subs: {
      type: "Array",
    },
    entry_history: {
      event: {
        type: "Number",
      },
      points: {
        type: "Number",
      },
      total_points: {
        type: "Number",
      },
      rank: {
        type: "Number",
      },
      rank_sort: {
        type: "Number",
      },
      overall_rank: {
        type: "Number",
      },
      bank: {
        type: "Number",
      },
      value: {
        type: "Number",
      },
      event_transfers: {
        type: "Number",
      },
      event_transfers_cost: {
        type: "Number",
      },
      points_on_bench: {
        type: "Number",
      },
    },
    picks: {
      type: ["Mixed"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model("Team", teamSchema);
