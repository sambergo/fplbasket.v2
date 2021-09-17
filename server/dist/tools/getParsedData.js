"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParsedData = void 0;
const getParsedData = (input) => {
    console.log("getparseddata");
    const captainsObj = {};
    const playersObj = {};
    const transfers = [];
    const chipsObject = {};
    const managers = [];
    const currentGwPicks = input.league_curr.managers;
    const filterPicks = (team) => {
        if (team.active_chip == "bboost")
            return { active: team.picks, bench: [] };
        else if (team.automatic_subs.length < 1)
            return {
                active: team.picks.filter((p) => p.position < 12),
                bench: team.picks.filter((p) => p.position >= 12),
            };
        else {
            const subsIn = team.automatic_subs.map((sub) => sub.element_in);
            const subsOut = team.automatic_subs.map((sub) => sub.element_out);
            const picks = team.picks.filter((pick) => {
                if (pick.position < 12 && !subsOut.includes(pick.element))
                    return true;
                else if (subsIn.includes(pick.element))
                    return true;
                else
                    return false;
            });
            return {
                active: picks,
                bench: team.picks.filter((allpicks) => !picks.map((p) => p.element).includes(allpicks.element)),
            };
        }
    };
    for (const manager of currentGwPicks) {
        const captain = manager.gw_team.picks.find((p) => p.is_captain).element;
        const cAttr = captain in captainsObj;
        if (!cAttr)
            captainsObj[captain] = [manager.player_name];
        else
            captainsObj[captain].push(manager.player_name);
        const parsedPicks = filterPicks(manager.gw_team);
        managers.push({ manager, parsedPicks });
        for (const pick of parsedPicks.active) {
            const hasattr = pick.element in playersObj;
            if (!hasattr) {
                playersObj[pick.element] = [manager.player_name];
            }
            else {
                playersObj[pick.element].push(manager.player_name);
            }
        }
        if (input.league_prev) {
            const picks = manager.gw_team.picks.map((p) => p.element);
            const prev_picks = input.league_prev.managers
                .find((prev) => prev.entry == manager.entry)
                .gw_team.picks.map((p) => p.element);
            const wildcardOrFeehit = manager.gw_team.active_chip == "freehit" ||
                manager.gw_team.active_chip == "wildcard";
            const managerTrasfers = {
                managerName: manager.player_name,
                transfersIn: picks.filter((p) => !prev_picks.includes(p)),
                transfersOut: prev_picks.filter((p) => !picks.includes(p)),
                transfersCost: manager.gw_team.entry_history.event_transfers_cost,
                chip: !wildcardOrFeehit
                    ? null
                    : `*${manager.gw_team.active_chip[0].toUpperCase()}${manager.gw_team.active_chip.slice(1)}*`,
            };
            if (managerTrasfers.transfersIn.length > 0)
                transfers.push(managerTrasfers);
        }
        if (manager.gw_team.active_chip) {
            const chip = manager.gw_team.active_chip;
            const chipAttr = chip in chipsObject;
            if (!chipAttr)
                chipsObject[chip] = [manager.player_name];
            else
                chipsObject[chip].push(manager.player_name);
        }
    }
    const captains = [];
    for (const k in captainsObj) {
        captains.push({
            captain: parseInt(k),
            captainedBy: captainsObj[k],
        });
    }
    const players = [];
    for (const k in playersObj) {
        players.push({
            player: parseInt(k),
            ownedBy: playersObj[k],
        });
    }
    const chips = [];
    for (const c in chipsObject) {
        chips.push({
            chip: c,
            usedBy: chipsObject[c],
        });
    }
    captains.sort((a, b) => b.captainedBy.length - a.captainedBy.length);
    players.sort((a, b) => b.ownedBy.length - a.ownedBy.length);
    const returnObject = {
        chips,
        captains,
        players,
        transfers,
        managers,
    };
    return returnObject;
};
exports.getParsedData = getParsedData;
//# sourceMappingURL=getParsedData.js.map