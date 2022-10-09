"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const standingsSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.default = mongoose_1.default.models.Standings ||
    mongoose_1.default.model("Standings", standingsSchema);
//# sourceMappingURL=Standings.js.map