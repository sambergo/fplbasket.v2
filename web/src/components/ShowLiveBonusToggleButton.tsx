import { ToggleButton } from "@material-ui/core";
import { useStateValue } from "../state";

const ShowLiveBonusToggleButton: React.FC = () => {
  const [{ showLiveBonus, showLiveBonusDisabled }, dispatch] = useStateValue();
  return (
    <ToggleButton
      selected={showLiveBonus && !showLiveBonusDisabled}
      onChange={() =>
        dispatch({
          type: "SET_SHOW_LIVE_BONUS",
          payload: !showLiveBonus,
        })
      }
      disabled={showLiveBonusDisabled}
      value="livebps"
    >
      LiveBonus
    </ToggleButton>
  );
};

export default ShowLiveBonusToggleButton;
