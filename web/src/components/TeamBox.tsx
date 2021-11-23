import { Link } from "@material-ui/core";
import { Box } from "@material-ui/system";
import React, { FC } from "react";
import { Manager } from "../types/newleague";

interface TeamBoxType {
  manager: Manager;
}
const TeamBox: FC<TeamBoxType> = ({ manager }) => {
  console.log("manager:", manager);
  return (
    <Box>
      <Link
      // href={`https://fantasy.premierleague.com/entry/${manager.entry}/event/12/`}
      >
        <Box>{manager.entry_name}</Box>
      </Link>
      <Box>{manager.player_name}</Box>
    </Box>
  );
};
export default TeamBox;
