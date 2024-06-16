import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import CatalogSlider from "./CatalogSlider"; // Import your CatalogSlider component
import GameLevel from "./GameLevel"; // Import your GameLevel component

import "../styles/Catalog.css";
import LanguageDropdown from "./LanguageDropdown";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
  GAME_MODE_ONEQUEST,
} from "./Constants";

const LeftSidebar = ({
  levelsData,
  level,
  onQuestClick,
  completedQuests,
  handleMapClick,
  selectedMapIndex,
}) => {
  const { t } = useTranslation("gamequests");
  const [translationSpace, setTranslationSpace] = useState();

  const [questCount, setQuestCount] = useState(null);
  const [workingQuests, setWorkingQuests] = useState([]);
  const [selectedQuestIndex, setSelectedQuestIndex] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  const [sortedLevelsData, setSortedLevelsData] = useState([]);
  const catalogDisplayToGameIndex = {
    1: 2,
    2: 13,
    3: 4,
    4: 3,
    5: 7,
    6: 17,
    7: 20,
    8: 1,
    9: 19,
    10: 18,
    11: 8,
    12: 15,
    13: 16,
    14: 14,
    15: 12,
    16: 21,
    17: 11,
    18: 9,
    19: 10,
    20: 6,
    21: 5,
    22: 22,
  };
  const levelData = levelsData.filter((value) => value.level === level)[0];
  useEffect(() => {
    // Sort levels data and update sortedLevelsData
    const sortedData = levelsData
      .slice()
      .sort((a, b) => a.catalogOrder - b.catalogOrder);
    setSortedLevelsData(sortedData);
  }, [levelsData]);
  useEffect(() => {
    if (selectedMapIndex !== null) {
      setSelectedMap(
        parseInt(
          Object.keys(catalogDisplayToGameIndex).find(
            (key) => catalogDisplayToGameIndex[key] === selectedMapIndex
          )
        ) - 1
      );
    }
    console.log("____________selectedMap " + selectedMapIndex);
    console.log("____________selectedMap " + selectedMap);

    let regularQuests;
    if (levelData) {
      setTranslationSpace(levelData.translationSpace);

      regularQuests = levelData.quests.filter(
        (quest) => typeof quest.type === "undefined" || quest.type !== 1
      );
      setWorkingQuests(regularQuests);

      const currentQuestCount = Object.keys(workingQuests).length;
      setQuestCount(currentQuestCount);
    }
  }, [level, levelData, selectedMap]);
  const handleQuestClick = (index) => {
    // Call the onQuestClick function with the clicked quest's index
    console.log("handleQuestClick");
    setSelectedQuestIndex(index); // Update the selected index
    onQuestClick(workingQuests[index].quest);
  };
  const handleMapSelection = (index) => {
    console.log("handleMapSelection " + index);
    if (selectedMap === index) {
      // If clicking on the same map, clear the selected map and reset the quest list
      console.log("handleMapSelection ici " + index);
      setSelectedMap(null);
      setSelectedQuestIndex(null);
    } else {
      console.log("la " + index);
      // If clicking on a different map, update the selected map
      setSelectedMap(index);
      setSelectedQuestIndex(null);
    }
  };
  return (
    <div className="left-sidebar-container">
      <div
        className="Header-Link"
        style={{ display: "flex", alignItems: "center" }}
      >
        <a
          href="https://nayth.art/shop/"
          className="external-link"
          style={{
            marginRight: "10px",
            textDecoration: "none",
            color: "#333",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          SHOP
        </a>
        <div className="Language-Dropdown">
          <LanguageDropdown />
        </div>
      </div>
      <h3>WORLDMAPS</h3>
      <ul className="map-list">
        {/* Affichage de la liste des cartes */}
        {typeof sortedLevelsData !== "undefined" &&
          sortedLevelsData.map((mapData, index) => (
            <li key={index}>
              <a
                className={selectedMap === index ? "selected" : ""}
                onClick={() => {
                  const originalIndex = levelsData.findIndex(
                    (item) => item.level === mapData.level
                  );
                  handleMapClick(originalIndex + 1);
                  handleMapSelection(index);
                }}
              >
                {mapData.name.toUpperCase()}
              </a>
              {selectedMap === index && (
                <div>
                  <ul className="quest-list">
                    {sortedLevelsData[selectedMap].quests.map(
                      (quest, index) => (
                        <li key={index}>
                          <a
                            href="#"
                            className={`quest-link ${
                              selectedQuestIndex === index ? "selected" : ""
                            } ${
                              completedQuests.includes(quest.quest)
                                ? "completed"
                                : ""
                            }`}
                            onClick={() => handleQuestClick(index)}
                          >
                            {t(`${translationSpace}.${quest.quest}.title`)}
                          </a>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
const Catalog = ({
  levelsData,

  weekOfYear,
}) => {
  const [inputLevel, setInputLevel] = useState(1);
  const [inputQuest, setInputQuest] = useState("none");
  const [forceReload, setForceReload] = useState(false);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [timerStarted, setTimerStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [selectedMapIndex, setSelectedMapIndex] = useState(null);
  const gameIndexToName = {
    1: "pokemon",
    2: "ghibli",
    3: "jrpg",
    4: "zelda",
    5: "90s",
    6: "tezuka",
    7: "onepiece",
    8: "naruto",
    9: "gundam",
    10: "metalgear",
    11: "dragonball",
    12: "sailormoon",
    13: "berserk",
    14: "nier",
    15: "demonslayers",
    16: "hunterxhunter",
    17: "jojo",
    18: "persona",
    19: "gainax",
    20: "attackontitan",
    21: "clamp",
    22: "xenoblade",
  };
  const handleThumbClick = (index) => {
    // Update the inputLevel state with the clicked index
    console.log("update to ", index);
    setSelectedMapIndex(null);
    setCompletedQuests([]);
    setInputQuest("none");
    setForceReload(true);
    setInputLevel(index);
    setTimerStarted(true);
    setStartTime(Date.now());
  };
  const onQuestClick = (index) => {
    // Update the inputLevel state with the clicked index
    console.log("update to ", index);
    setInputQuest(index);
    setForceReload(true);
  };
  const reloadDone = () => {
    // Update the inputLevel state with the clicked index
    console.log("reloadDone but forceReload " + forceReload);
    if (forceReload !== false) setForceReload(false);
  };

  const onQuestSuccess = (questName) => {
    console.log("onQuestSuccess");
    setCompletedQuests((prevCompletedQuests) => [
      ...prevCompletedQuests,
      questName,
    ]);
  };
  useEffect(() => {
    if (
      typeof levelsData[inputLevel] !== "undefined" &&
      levelsData[inputLevel].quests
        .filter((quest) => !quest.type || quest.type !== 1)
        .every((quest) => completedQuests.includes(quest.quest))
    ) {
      // Stop the timer and calculate completion time
      const endTime = Date.now();
      const completionTime = Math.floor((endTime - startTime) / 1000); // in seconds
      alert(`All quests completed in ${completionTime} seconds.`);
      // Reset the timer state
      setCompletedQuests([]);
      setTimerStarted(false);
      setStartTime(Date.now());
    }
  }, [completedQuests, levelsData, inputLevel, startTime]);
  const toggleCenteringClass = () => {};
  useEffect(() => {
    console.log("useEffect Catalog ");
    const queryParams = new URLSearchParams(window.location.search);
    const paramName = queryParams.get("game");
    const index = Object.keys(gameIndexToName).find(
      (key) => gameIndexToName[key] === paramName
    );
    console.log("index " + index);
    if (index) {
      setInputLevel(parseInt(index));
      setSelectedMapIndex(parseInt(index));
    }
    const urlWithoutParam = window.location.href.split("?")[0];
    window.history.replaceState(null, null, urlWithoutParam);
    window.addEventListener("resize", toggleCenteringClass);
    return () => {
      window.removeEventListener("resize", toggleCenteringClass);
    };
  }, [inputLevel, forceReload]);
  return (
    <div className="app-container">
      <div className="main-content">
        <div className="sidebar">
          <LeftSidebar
            completedQuests={completedQuests}
            levelsData={levelsData}
            level={inputLevel}
            onQuestClick={onQuestClick}
            selectedMapIndex={selectedMapIndex}
            handleMapClick={handleThumbClick}
          />
        </div>
        <div className="game-level">
          <GameLevel
            levelsData={levelsData}
            weekOfYear={weekOfYear}
            inputLevel={inputLevel}
            inputGameMode={GAME_MODE_ONEQUEST}
            inputQuest={inputQuest}
            minimalMode={true}
            forceReload={forceReload}
            reloadDone={reloadDone}
            onQuestSuccess={onQuestSuccess}
            targetImageRatio={0.8}
          />
        </div>
      </div>
    </div>
  );
};

export default Catalog;
