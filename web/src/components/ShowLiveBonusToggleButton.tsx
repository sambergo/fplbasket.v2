import { FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import { useStateValue } from "../state";

const ShowLiveBonusToggleButton: React.FC = () => {
  const [{ showLiveBonus, showLiveBonusDisabled }, dispatch] = useStateValue();
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            color="primary"
            disabled={showLiveBonusDisabled}
            defaultChecked={!showLiveBonusDisabled}
            onChange={() =>
              dispatch({
                type: "SET_SHOW_LIVE_BONUS",
                payload: !showLiveBonus,
              })
            }
          />
        }
        label="LiveBonus"
        labelPlacement="bottom"
      />
    </FormGroup>
    // <ToggleButton
    //   selected={showLiveBonus && !showLiveBonusDisabled}
    //   onChange={() =>
    //     dispatch({
    //       type: "SET_SHOW_LIVE_BONUS",
    //       payload: !showLiveBonus,
    //     })
    //   }
    //   disabled={showLiveBonusDisabled}
    //   value="livebps"
    // >
    //   LiveBonus
    // </ToggleButton>
  );
};

export default ShowLiveBonusToggleButton;
