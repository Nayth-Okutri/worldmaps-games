import "../styles/levelsDisplay.css";
import { useState } from "react";
import { collection, getFirestore, setDoc, doc } from "firebase/firestore";
import { TypeAnimation } from "react-type-animation";
import { Link, useNavigate } from "react-router-dom";

import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
} from "./Constants";
import { level1Data, level2Data, level3Data, level4Data } from "./LevelData";

const importLevels = async () => {
  try {
    //<button onClick={importLevels}>UPLOAD DATA</button>
    const levelsData = [level1Data, level2Data, level3Data, level4Data];
    const dataLevelCollectionRef = collection(getFirestore(), "levelData");
    let docRef;
    levelsData.forEach((levelData) => {
      docRef = doc(getFirestore(), "levelData", "level" + levelData.level);

      setDoc(docRef, levelData, { merge: true })
        .then(() => {
          console.log("Document added or updated successfully!");
        })
        .catch((error) => {
          console.error("Error adding or updating document: ", error);
        });
    });
  } catch (error) {
    console.error("Error writing new score to Firebase Database", error);
  }
};
const LevelsDisplay = ({
  levelsData,
  clickFunction,
  displayIcons = true,
  useClickFunction = false,
  highlight,
}) => {
  const [openedNumber, setOpenedNumber] = useState(-1);
  const [hoveredLevel, setHoveredLevel] = useState(0); // State for tracking hovered level
  const [isSlidingDown, setIsSlidingDown] = useState(false); // State for sliding div visibility
  const [selectedMode, setSelectedMode] = useState("duplicate");
  const [show, setShow] = useState(false);
  const [gameMode, setGameMode] = useState();
  let navigate = useNavigate();
  const showStyle = {
    height: "auto",
  };
  const levelClick = (level, gameMode = 2) => {
    const mode = gameMode !== undefined ? gameMode : 2;
    navigate(`/worldmaps/game/${level}?mode=${mode}`);
  };
  return (
    <div className="levels-display">
      {levelsData.map((levelData) => {
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
            className={`level${level === highlight ? " highlight" : ""}`}
            onMouseEnter={() => setHoveredLevel(level)} // Set hovered level on mouse enter
            onMouseLeave={() => setHoveredLevel(null)} // Clear hovered level on mouse leave
            key={level}
          >
            <div
              className="image-container"
              onClick={() => {
                if (useClickFunction) clickFunction(level);
                else handleClick();
              }}
            >
              <img
                src={require(`../assets/level-${level}.jpg`)}
                alt={`Level ${level}`}
                style={{
                  opacity: level === highlight || isHighlighted ? 1 : 0.5,
                }}
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
            <div
              className="gamemode-select"
              style={openedNumber === level ? showStyle : hideStyle}
            >
              <div className="modes">
                <div className="icons">
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
                        setSelectedMode("duplicate");
                        setGameMode(GAME_MODE_DUPLICATE);
                      }}
                    />
                  </span>
                  <span style={{ paddingRight: "10px" }}>
                    <img
                      style={{
                        height: "50px",
                        cursor: "pointer",
                        transition: "opacity 0.3s",
                        opacity: selectedMode === "10-quests" ? 1 : 0.3,
                      }}
                      src={require("../assets/10Icon.png")}
                      alt="Duplicate"
                      onClick={() => {
                        setSelectedMode("10-quests");
                        setGameMode(GAME_MODE_10_QUESTS);
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
                        opacity: selectedMode === "time-attack" ? 1 : 0.3,
                      }}
                      src={require("../assets/TimerIcon.png")}
                      alt="Duplicate"
                      onClick={() => {
                        setSelectedMode("time-attack");
                        setGameMode(GAME_MODE_TIMEATTACK);
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
                        setSelectedMode("all-quests");
                        setGameMode(GAME_MODE_ALLQUESTS);
                      }}
                      title="Duplicate Mode" // Add a tooltip description
                    />
                  </span>{" "}
                </div>
                {selectedMode === "duplicate" && (
                  <div className="mode-description">
                    <p>
                      Selected Mode: Duplicate Hunt. Find duplicate in an image
                      filled with various objects, characters, or elements.
                    </p>
                  </div>
                )}
                {selectedMode === "10-quests" && (
                  <div className="mode-description">
                    <p>
                      Selected Mode: 10 Random Questions. Put your Geek
                      knowledge to the test and locate the elements that match
                      the given questions.
                    </p>
                  </div>
                )}
                {selectedMode === "time-attack" && (
                  <div className="mode-description">
                    <p>
                      Selected Mode: Time Attack. Take on the clock and respond
                      to as many questions as you can within a single minute.
                    </p>
                  </div>
                )}
                {selectedMode === "all-quests" && (
                  <div className="mode-description">
                    <p>
                      Selected Mode: Otaku Mastery. Demonstrate your expertise
                      by swiftly answering all the questions from the deck.
                    </p>
                  </div>
                )}
                <button
                  className="play"
                  onClick={() => levelClick(level, gameMode)}
                >
                  Play Game
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LevelsDisplay;
