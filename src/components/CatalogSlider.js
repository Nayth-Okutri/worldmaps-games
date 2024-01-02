import React, { useState, useEffect } from "react";
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
import "../styles/CatalogSlider.css"; // Import your slider styles

const CatalogSlider = ({
  levelsData,
  weekOfYear,
  clickFunction,
  displayIcons = true,
  useClickFunction = true,
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

  let navigate = useNavigate();
  useEffect(() => {
    if (typeof weeklyContests[weekOfYear] !== "undefined")
      setContestOfTheWeek(weeklyContests[weekOfYear]);
    console.log(contestOfTheWeek);

    setUserLevelsData(levelsData);
  }, [currentUser, levelsData, weekOfYear]);
  return (
    <div className="levels-display-hor">
      {loading && <LoadingSpinner />}

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
                <h2>{levelData.name.toUpperCase()}</h2>
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
          </div>
        );
      })}
    </div>
  );
};

export default CatalogSlider;
