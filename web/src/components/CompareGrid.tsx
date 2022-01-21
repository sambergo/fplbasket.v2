import { Grid, Typography } from "@material-ui/core";
import { FC } from "react";
import { useStateValue } from "../state";
import { getElementType, getPlayerName } from "../tools";
import { Manager } from "../types/newleague";

interface CompareGridType {
  headerText: string;
  team1: Manager;
  team2: Manager;
}

const CompareGrid: FC<CompareGridType> = ({ headerText, team1, team2 }) => {
  const [{ bssData }] = useStateValue();
  return (
    <Grid xs={12} sm={6} md={4} item direction="column">
      <Typography variant="h6">{headerText}</Typography>
      {team1.gw_team.picks
        .filter(
          (pick) =>
            pick.multiplier > 0 &&
            !team2.gw_team.picks.map((ep) => ep.element).includes(pick.element)
        )
        .sort(
          (a, b) =>
            getElementType(bssData?.elements[a.element]) -
            getElementType(bssData?.elements[b.element])
        )
        .map((pick) => (
          <Typography key={pick.element} variant="body2">
            {getPlayerName(bssData?.elements[pick.element] || null)}
          </Typography>
        ))}
    </Grid>
  );
};

export default CompareGrid;
