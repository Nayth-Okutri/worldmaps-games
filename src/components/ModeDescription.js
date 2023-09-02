import "../styles/ModeDescription.css";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
} from "./Constants";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import { useTranslation } from "react-i18next";
const ModeDescription = ({ level, gameMode }) => {
  const { t } = useTranslation("menu");
  useEffect(() => {
    console.log("gameMode updated:", gameMode);
  }, [level, gameMode]);

  return (
    <div className="mode-description">
      {gameMode === GAME_MODE_DUPLICATE && (
        <p>{t("duplicateGameModeDescription")}</p>
      )}
      {gameMode === GAME_MODE_10_QUESTS && <p>{t("tenGameModeDescription")}</p>}
      {gameMode === GAME_MODE_TIMEATTACK && (
        <p>{t("timeAttackGameModeDescription")}</p>
      )}
      {gameMode === GAME_MODE_ALLQUESTS && (
        <p>{t("allQuestsAttackGameModeDescription")}</p>
      )}
      {level && gameMode ? (
        <Link to={`/worldmaps/game/${level}?mode=${gameMode}`}>
          <button className="play">Play This Level</button>
        </Link>
      ) : (
        <button className="play" disabled>
          Select a Game Mode
        </button>
      )}
    </div>
  );
};

export default ModeDescription;
