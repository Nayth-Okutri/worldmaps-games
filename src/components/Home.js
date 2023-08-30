import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import { useEffect, useState } from "react";
import LevelsDisplay from "./LevelsDisplay";
import ModeDescription from "./ModeDescription";
const Home = ({ levelsData }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameMode, setGameMode] = useState(0);

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
