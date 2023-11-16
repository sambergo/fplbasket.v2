import { Box } from "@material-ui/core";
import { FC } from "react";

interface PointsBoxType {
  gwPoints: number;
  totalPoints: number;
}

const PointsBox: FC<PointsBoxType> = ({ gwPoints, totalPoints }) => {
  return (
    <Box flexDirection="column">
      <Box m="auto" fontWeight={600}>
        {gwPoints}
      </Box>
      <Box m="auto">{totalPoints}</Box>
    </Box>
  );
};
export default PointsBox;
