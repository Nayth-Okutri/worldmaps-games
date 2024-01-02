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

const LeftSidebar = ({ levelsData, level, onQuestClick }) => {
  const { t } = useTranslation("gamequests");
  const [translationSpace, setTranslationSpace] = useState();
  const levelData = levelsData.filter((value) => value.level === level)[0];
  const [questCount, setQuestCount] = useState(0);
  const [workingQuests, setWorkingQuests] = useState([]);
  const [selectedQuestIndex, setSelectedQuestIndex] = useState(null);

  useEffect(() => {
    let regularQuests;
    if (levelData) {
      setTranslationSpace(levelData.translationSpace);
      if (questCount === 0) {
        regularQuests = levelData.quests.filter(
          (quest) => typeof quest.type === "undefined" || quest.type !== 1
        );
        setWorkingQuests(regularQuests);
      }
      const currentQuestCount = Object.keys(workingQuests).length;
      setQuestCount(currentQuestCount);
    }
  }, [level]);
  const handleQuestClick = (index) => {
    // Call the onQuestClick function with the clicked quest's index
    console.log("test");
    setSelectedQuestIndex(index); // Update the selected index
    onQuestClick(workingQuests[index].quest);
  };
  return (
    <div>
      <h2>CHERCHE</h2>
      <ul className="quest-list">
        {workingQuests.map((quest, index) => (
          <li key={index}>
            <a
              href="#"
              className={`quest-link ${
                selectedQuestIndex === index ? "selected" : ""
              }`}
              onClick={() => handleQuestClick(index)}
            >
              {t(`${translationSpace}.${workingQuests[index].quest}.title`)}
            </a>
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
  const handleThumbClick = (index) => {
    // Update the inputLevel state with the clicked index
    console.log("update to ", index);
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
  useEffect(() => {
    console.log("update to ");
  }, [inputLevel, forceReload]);
  return (
    <div className="app-container">
      <CatalogSlider levelsData={levelsData} clickFunction={handleThumbClick} />
      <div className="main-content">
        <div className="sidebar">
          <LeftSidebar
            levelsData={levelsData}
            level={inputLevel}
            onQuestClick={onQuestClick}
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
          />
        </div>
      </div>
    </div>
  );
};

export default Catalog;
