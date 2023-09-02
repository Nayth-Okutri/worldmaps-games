import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import { useEffect, useState } from "react";
import LevelsDisplay from "./LevelsDisplay";
import ModeDescription from "./ModeDescription";
import { useTranslation } from "react-i18next";

const Home = ({ levelsData }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameMode, setGameMode] = useState(0);
  const { t } = useTranslation("menu");
  const changeLevelInDisplay = (level) => {
    console.log("changeLevelInDisplay");
    setCurrentLevel(level);
  };
  const changeGameModeInDisplay = (mode) => {
    console.log("changeGameModeInDisplay");
    setGameMode(mode);
  };
  useEffect(() => {
    console.log("gameMode updated:", gameMode);
  }, [currentLevel, gameMode]);

  return (
    <div className="home">
      <div>
        {" "}
        <h2>{t("HomeTitle")}</h2>
        <p>{t("HomeGameDescription")}</p>
      </div>

      <LevelsDisplay
        clickFunction={changeLevelInDisplay}
        useClickFunction={true}
        overrideIconClick={changeGameModeInDisplay}
        levelsData={levelsData}
        nestedComponent={
          <ModeDescription level={currentLevel} gameMode={gameMode} />
        }
      />
    </div>
  );
};

export default Home;
