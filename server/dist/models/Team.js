"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const teamSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.models.Team || mongoose_1.default.model("Team", teamSchema);
//# sourceMappingURL=Team.js.map