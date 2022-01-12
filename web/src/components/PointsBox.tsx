import { Box } from "@material-ui/system";
import { FC } from "react";

interface PointsBoxType {
  gwPoints: number;
  totalPoints: number;
}

const PointsBox: FC<PointsBoxType> = ({ gwPoints, totalPoints }) => {
  return (
    <Box>
      <Box>{gwPoints} /</Box>
      <Box>{totalPoints}</Box>
    </Box>
  );
};
export default PointsBox;
