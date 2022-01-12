import { Captain, GwTeam, LeagueType, Player } from "../types/manager";

interface GetParsedDataInput {
  league_curr: LeagueType;
  league_prev: LeagueType | null;
}

const filterPicks = (team: GwTeam) => {
  if (team.active_chip == "bboost") return { active: team.picks, bench: [] };
  else if (team.automatic_subs.length < 1)
    return {
      active: team.picks.filter((p) => p.position < 12),
      bench: team.picks.filter((p) => p.position >= 12),
    };
  else {
    const subsIn = team.automatic_subs.map((sub) => sub.element_in);
    const subsOut = team.automatic_subs.map((sub) => sub.element_out);
    const picks = team.picks.filter((pick) => {
      if (pick.position < 12 && !subsOut.includes(pick.element)) return true;
      else if (subsIn.includes(pick.element)) return true;
      else return false;
    });
    return {
      active: picks,
      bench: team.picks.filter(
        (allpicks) => !picks.map((p) => p.element).includes(allpicks.element)
      ),
    };
  }
};

export const getParsedData = (input: GetParsedDataInput) => {
  const captainsObj: any = {};
  const playersObj: any = {};
  const chipsObject: any = {};
  const managers: any[] = [];
  const currentGwPicks = input.league_curr.managers;

  for (const manager of currentGwPicks) {
    // @ts-ignore
    const captain: number = manager.gw_team.picks.find(
      (p) => p.is_captain
    ).element;
    const captainInCaptainsObj = captain in captainsObj;
    if (!captainInCaptainsObj) captainsObj[captain] = [manager.player_name];
    else captainsObj[captain].push(manager.player_name);
    // picks
    const parsedPicks = filterPicks(manager.gw_team);
    const prevGwManager = input.league_prev?.managers.find(
      (pm) => pm.id == manager.id
    );
    const prevRank = manager.last_rank;
    const prev_points = prevGwManager?.gw_team.entry_history.total_points || 0;
    managers.push({
      manager: { ...manager, prev_points, last_rank: prevRank },
      parsedPicks,
    });
    for (const pick of parsedPicks.active) {
      const playerInPlayersObj = pick.element in playersObj;
      if (!playerInPlayersObj) {
        playersObj[pick.element] = [manager.player_name];
      } else {
        playersObj[pick.element].push(manager.player_name);
      }
    }
  }

  const captains: Captain[] = [];
  for (const k in captainsObj) {
    captains.push({
      captain: parseInt(k),
      captainedBy: captainsObj[k],
    });
  }
  const players: Player[] = [];
  for (const k in playersObj) {
    players.push({
      player: parseInt(k),
      ownedBy: playersObj[k],
    });
  }
  const chips: any[] = [];
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
    managers,
  };
  return returnObject;
};
