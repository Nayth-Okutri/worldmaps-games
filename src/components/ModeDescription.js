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
    <div>
      {gameMode === GAME_MODE_DUPLICATE && (
        <div className="mode-description">
          <p>{t("duplicateGameModeDescription")}</p>
        </div>
      )}
      {gameMode === GAME_MODE_10_QUESTS && (
        <div className="mode-description">
          <p>{t("tenGameModeDescription")}</p>
        </div>
      )}
      {gameMode === GAME_MODE_TIMEATTACK && (
        <div className="mode-description">
          <p>{t("timeAttackGameModeDescription")}</p>
        </div>
      )}
      {gameMode === GAME_MODE_ALLQUESTS && (
        <div className="mode-description">
          <p>{t("allQuestsAttackGameModeDescription")}</p>
        </div>
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
