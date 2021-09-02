import { Result } from "../types/league";
import { Captain, Player, Team } from "../types/manager";

interface Manager extends Result {
  team: Team;
}
export const handleManagerList = (managerList: Manager[]) => {
  const captainsObj: any = {};
  const playersObj: any = {};
  const filterPicks = (team: Manager["team"]) => {
    if (team.active_chip == "bboost") return team.picks;
    else if (team.automatic_subs.length < 1)
      return team.picks.filter((p) => p.position < 12);
    else {
      const subsIn = team.automatic_subs.map((sub) => sub.element_in);
      const subsOut = team.automatic_subs.map((sub) => sub.element_out);
      const picks = team.picks.filter((pick) => {
        if (pick.position < 12 && !subsOut.includes(pick.element)) return true;
        else if (subsIn.includes(pick.element)) return true;
        else return false;
      });
      return picks;
    }
  };
  for (const manager of managerList) {
    // @ts-ignore
    const captain: number = manager.team.picks.find(
      (p) => p.is_captain
    ).element;
    const cAttr = captain in captainsObj;
    if (!cAttr) captainsObj[captain] = [manager.player_name];
    else captainsObj[captain].push(manager.player_name);
    const filteredPicks = filterPicks(manager.team);
    for (const pick of filteredPicks) {
      const hasattr = pick.element in playersObj;
      if (!hasattr) {
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
  captains.sort((a, b) => b.captainedBy.length - a.captainedBy.length);
  players.sort((a, b) => b.ownedBy.length - a.ownedBy.length);
  const returnObject = {
    handledList: managerList,
    captains,
    players,
  };
  return returnObject;
};
