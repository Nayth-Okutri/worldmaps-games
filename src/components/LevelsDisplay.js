import "../styles/levelsDisplay.css";
import { useState, useEffect } from "react";
import { collection, getFirestore, setDoc, doc } from "firebase/firestore";
import { TypeAnimation } from "react-type-animation";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
} from "./Constants";

import { useAuth } from "../auth";
import { levelAvailability } from "../gameLevelConfig";
import { weeklyContests } from "../gameLevelConfig";

const LevelsDisplay = ({
  levelsData,
  weekOfYear,
  clickFunction,
  displayIcons = true,
  useClickFunction = false,
  highlight,
  overrideIconClick,
  nestedComponent,
  minimalMode = false,
}) => {
  const [openedNumber, setOpenedNumber] = useState(-1);
  const [hoveredLevel, setHoveredLevel] = useState(0); // State for tracking hovered level
  const [selectedMode, setSelectedMode] = useState();
  const [gameMode, setGameMode] = useState();
  const [userLevelsData, setUserLevelsData] = useState([]);
  const [contestOfTheWeek, setContestOfTheWeek] = useState();
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { t } = useTranslation("menu");
  const showStyle = {
    height: "auto",
    maxWidth: "100%",
  };
  const currentYear = new Date().getFullYear();
  const handleImageLoad = () => {
    setLoading(false);
  };
  function getNextMonday(weekOfYear, year) {
    const januaryFirst = new Date(year, 0, 1);
    const daysToMonday = (8 - januaryFirst.getDay()) % 7;
    const firstMonday = new Date(year, 0, 1 + daysToMonday);

    // Add the number of weeks to get to the desired week
    const targetMonday = new Date(
      firstMonday.getTime() + weekOfYear * 7 * 24 * 60 * 60 * 1000
    );

    const month = String(targetMonday.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(targetMonday.getDate()).padStart(2, "0");

    return `${currentYear}-${month}-${day}`;
  }
  let navigate = useNavigate();
  useEffect(() => {
    if (typeof weeklyContests[weekOfYear] !== "undefined")
      setContestOfTheWeek(weeklyContests[weekOfYear]);
    console.log(contestOfTheWeek);
    setUserLevelsData(levelsData);
    /*if (currentUser) {
      setUserLevelsData(levelsData);
    } else {
      const availableLevels = levelAvailability[weekOfYear] || [];
      const availableLevelData = levelsData.filter((level) =>
        availableLevels.includes(level.level)
      );
      setUserLevelsData(availableLevelData);
    }*/
  }, [currentUser, levelsData, weekOfYear]);
  return (
    <div className="levels-display">
      {loading && <LoadingSpinner />}
      {typeof contestOfTheWeek !== "undefined" && contestOfTheWeek && (
        <div
          className="level image-container contest"
          onClick={() => {
            navigate(`/worldmaps/${contestOfTheWeek}`);
          }}
        >
          <h2>{t("WeeklyContestTitle")}</h2>
          <p>
            {t("WeeklyContestDesc")}
            {getNextMonday(weekOfYear, currentYear)}
          </p>
          <img
            src={require(`../assets/level-${
              contestOfTheWeek.match(/\d+/)[0]
            }-thumb.jpg`)}
            alt={`Level ${contestOfTheWeek.match(/\d+/)[0]}`}
            onLoad={handleImageLoad}
          />
        </div>
      )}
      {userLevelsData.map((levelData) => {
        const level = levelData.level;
        const isHighlighted = hoveredLevel === level;
        const handleClick = () => {
          setOpenedNumber(level !== openedNumber ? level : -1);
        };
        const hideStyle = {
          height: "0",
          paddingTop: "0",
          paddingBottom: "0",
        };
        return (
          <div
            className={`level${
              level === highlight || minimalMode ? " highlight" : ""
            }`}
            onMouseEnter={() => setHoveredLevel(level)} // Set hovered level on mouse enter
            onMouseLeave={() => setHoveredLevel(null)} // Clear hovered level on mouse leave
            key={level}
          >
            {minimalMode ? (
              <div
                onClick={() => {
                  if (useClickFunction) {
                    clickFunction(level);
                    handleClick();
                  } else handleClick();
                }}
              >
                <h2>{`${levelData.name.toUpperCase()}`}</h2>
              </div>
            ) : (
              <div
                className="image-container"
                onClick={() => {
                  if (useClickFunction) {
                    clickFunction(level);
                    handleClick();
                  } else handleClick();
                }}
              >
                <img
                  src={require(`../assets/level-${level}-thumb.jpg`)}
                  alt={`Level ${level}`}
                  style={{
                    opacity: level === highlight || isHighlighted ? 1 : 0.5,
                  }}
                  onLoad={handleImageLoad}
                />{" "}
                {isHighlighted && (
                  <div className="type-animation">
                    <TypeAnimation
                      sequence={`${levelData.name.toUpperCase()}`}
                      speed={50}
                      repeat={0}
                      cursor={false}
                      style={{ fontSize: "2em" }}
                    />
                  </div>
                )}{" "}
              </div>
            )}

            <div
              className="gamemode-select"
              style={openedNumber === level ? showStyle : hideStyle}
            >
              <div className="icons">
                <span style={{ paddingRight: "10px" }}>
                  <img
                    style={{
                      height: "50px",
                      cursor: "pointer",
                      transition: "opacity 0.3s",
                      opacity: selectedMode === "10-quests" ? 1 : 0.3,
                    }}
                    src={require("../assets/10Icon.png")}
                    alt="10-quests"
                    onClick={() => {
                      if (useClickFunction) {
                        overrideIconClick(GAME_MODE_10_QUESTS);
                        setSelectedMode("10-quests");
                      } else {
                        setSelectedMode("10-quests");
                        setGameMode(GAME_MODE_10_QUESTS);
                      }
                    }}
                    title="Duplicate Mode" // Add a tooltip description
                  />
                </span>
                <span style={{ paddingRight: "10px" }}>
                  <img
                    style={{
                      height: "50px",
                      cursor: "pointer",
                      transition: "opacity 0.3s",
                      opacity: selectedMode === "duplicate" ? 1 : 0.3,
                    }}
                    src={require("../assets/DuplicateIcon.png")}
                    alt="Duplicate"
                    title="Duplicate Mode" // Add a tooltip description
                    onClick={() => {
                      if (useClickFunction) {
                        overrideIconClick(GAME_MODE_DUPLICATE);
                        setSelectedMode("duplicate");
                      } else {
                        setSelectedMode("duplicate");
                        setGameMode(GAME_MODE_DUPLICATE);
                      }
                    }}
                  />
                </span>
                <span style={{ paddingRight: "10px" }}>
                  <img
                    style={{
                      height: "50px",
                      cursor: "pointer",
                      transition: "opacity 0.3s",
                      opacity: selectedMode === "time-attack" ? 1 : 0.3,
                    }}
                    src={require("../assets/TimerIcon.png")}
                    alt="Duplicate"
                    onClick={() => {
                      if (useClickFunction) {
                        overrideIconClick(GAME_MODE_TIMEATTACK);
                        setSelectedMode("time-attack");
                      } else {
                        setSelectedMode("time-attack");
                        setGameMode(GAME_MODE_TIMEATTACK);
                      }
                    }}
                    title="Duplicate Mode" // Add a tooltip description
                  />
                </span>
                <span style={{ paddingRight: "10px" }}>
                  <img
                    style={{
                      height: "50px",
                      cursor: "pointer",
                      transition: "opacity 0.3s",
                      opacity: selectedMode === "all-quests" ? 1 : 0.3,
                    }}
                    src={require("../assets/UntilEndIcon.png")}
                    alt="Duplicate"
                    onClick={() => {
                      if (useClickFunction) {
                        overrideIconClick(GAME_MODE_ALLQUESTS);
                        setSelectedMode("all-quests");
                      } else {
                        setSelectedMode("all-quests");
                        setGameMode(GAME_MODE_ALLQUESTS);
                      }
                    }}
                    title="Duplicate Mode" // Add a tooltip description
                  />
                </span>{" "}
              </div>
              {nestedComponent && (
                <div className="nested-component-container">
                  {nestedComponent}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LevelsDisplay;
