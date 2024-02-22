import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import CatalogSlider from "./CatalogSlider"; // Import your CatalogSlider component
import GameLevel from "./GameLevel"; // Import your GameLevel component
import "../styles/Catalog.css";
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
}) => {
  const { t } = useTranslation("gamequests");
  const [translationSpace, setTranslationSpace] = useState();

  const [questCount, setQuestCount] = useState(null);
  const [workingQuests, setWorkingQuests] = useState([]);
  const [selectedQuestIndex, setSelectedQuestIndex] = useState(null);
  const [selectedMap, setSelectedMap] = useState(null);
  const [sortedLevelsData, setSortedLevelsData] = useState([]);

  const levelData = levelsData.filter((value) => value.level === level)[0];
  useEffect(() => {
    // Sort levels data and update sortedLevelsData
    const sortedData = levelsData
      .slice()
      .sort((a, b) => a.catalogOrder - b.catalogOrder);
    setSortedLevelsData(sortedData);
  }, [levelsData]);
  useEffect(() => {
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
  }, [level, levelData]);
  const handleQuestClick = (index) => {
    // Call the onQuestClick function with the clicked quest's index
    console.log("test");
    setSelectedQuestIndex(index); // Update the selected index
    onQuestClick(workingQuests[index].quest);
  };
  const handleMapSelection = (index) => {
    console.log("test " + index);
    if (selectedMap === index) {
      // If clicking on the same map, clear the selected map and reset the quest list
      console.log("ici " + index);
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
    <div>
      <h2>CARTES</h2>
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
  const [inputQuest, setInputQuest] = useState("quest1");
  const [forceReload, setForceReload] = useState(false);
  const [completedQuests, setCompletedQuests] = useState([]);
  const handleThumbClick = (index) => {
    // Update the inputLevel state with the clicked index
    console.log("update to ", index);
    setCompletedQuests([]);
    setInputLevel(index);
  };
  const onQuestClick = (index) => {
    // Update the inputLevel state with the clicked index
    console.log("update to ", index);
    setInputQuest(index);
    setForceReload(true);
  };
  const reloadDone = () => {
    // Update the inputLevel state with the clicked index

    setForceReload(false);
  };

  const onQuestSuccess = (questName) => {
    console.log("onQuestSuccess");
    setCompletedQuests((prevCompletedQuests) => [
      ...prevCompletedQuests,
      questName,
    ]);
  };
  useEffect(() => {
    console.log("update to ");
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
