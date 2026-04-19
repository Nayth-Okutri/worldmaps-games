import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  CheckCircle,
  Map as MapIcon,
  ShoppingBag,
  Globe,
  Timer,
} from "lucide-react";
import GameLevel from "./GameLevel";
import LanguageDropdown from "./LanguageDropdown";
import { GAME_MODE_ONEQUEST } from "./Constants";
import "../styles/GameHub.css"; // On va créer ce CSS juste après

const GameHub = ({ levelsData, weekOfYear }) => {
  const { t } = useTranslation("gamequests");

  // --- ÉTATS DU JEU ---
  const [currentLevel, setCurrentLevel] = useState(1);
  const [inputQuest, setInputQuest] = useState("none");
  const [completedQuests, setCompletedQuests] = useState([]);
  const [forceReload, setForceReload] = useState(false);

  // --- ÉTATS UI ---
  const [mapOpen, setMapOpen] = useState(false);
  const [questOpen, setQuestOpen] = useState(false);

  // --- DATA TRANSFORMATION ---
  // On trie les maps une seule fois grâce à useMemo
  const sortedLevelsData = useMemo(() => {
    return [...levelsData].sort((a, b) => a.catalogOrder - b.catalogOrder);
  }, [levelsData]);

  const currentMapData = useMemo(() => {
    return sortedLevelsData.find((m) => m.level === currentLevel);
  }, [sortedLevelsData, currentLevel]);

  const translationSpace = currentMapData?.translationSpace;

  // --- LOGIQUE DE JEU ---
  const handleMapSelect = (levelId) => {
    setCurrentLevel(levelId);
    setCompletedQuests([]);
    setInputQuest("none");
    setForceReload(true);
    setMapOpen(false);
    setQuestOpen(false);
  };

  const handleQuestClick = (questId) => {
    setInputQuest(questId);
    setForceReload(true);
    setQuestOpen(false);
  };

  const onQuestSuccess = (questName) => {
    setCompletedQuests((prev) => {
      // Vérification ultra-stricte pour éviter le +2
      if (prev.includes(questName)) return prev;
      return [...prev, questName];
    });
  };

  const activeQuestData = useMemo(() => {
    return currentMapData?.quests?.find((q) => q.quest === inputQuest);
  }, [currentMapData, inputQuest]);

  const reloadDone = () => setForceReload(false);

  // --- RENDU ---
  return (
    <div className="game-hub-container">
      {/* 1. HEADER / NAVIGATION HUD */}
      <nav className="game-navbar">
        <div className="nav-left">
          <a href="https://nayth.art/shop/" className="nav-shop-btn">
            <ShoppingBag size={18} /> <span>SHOP</span>
          </a>
        </div>

        <div className="nav-center">
          {/* Menu des Mondes */}
          <div className="dropdown-container">
            <button
              className="dropdown-trigger"
              onClick={() => setMapOpen(!mapOpen)}
            >
              <MapIcon size={18} />
              <span className="current-name">
                {currentMapData?.name.toUpperCase()}
              </span>
              <ChevronDown size={14} className={mapOpen ? "rotate" : ""} />
            </button>
            {mapOpen && (
              <div className="dropdown-content grid-maps">
                {sortedLevelsData.map((map) => (
                  <div
                    key={map.level}
                    className={`map-item ${
                      map.level === currentLevel ? "active" : ""
                    }`}
                    onClick={() => handleMapSelect(map.level)}
                  >
                    {map.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Menu des Quêtes */}
          <div className="dropdown-container">
            <button
              className="dropdown-trigger"
              onClick={() => setQuestOpen(!questOpen)}
            >
              <Timer size={18} />
              <span>
                QUESTS ({completedQuests.length}/
                {
                  currentMapData?.quests?.filter((q) => !q.type || q.type !== 1)
                    .length
                }
                )
              </span>
              <ChevronDown size={14} className={questOpen ? "rotate" : ""} />
            </button>
            {questOpen && (
              <div className="dropdown-content list-quests">
                {currentMapData?.quests
                  .filter((q) => !q.type || q.type !== 1)
                  .map((q, idx) => (
                    <div
                      key={idx}
                      className={`quest-item ${
                        completedQuests.includes(q.quest) ? "is-done" : ""
                      } ${inputQuest === q.quest ? "selected" : ""}`}
                      onClick={() => handleQuestClick(q.quest)}
                    >
                      {completedQuests.includes(q.quest) ? (
                        <CheckCircle size={16} color="#4ade80" />
                      ) : (
                        <div className="dot" />
                      )}
                      {t(`${translationSpace}.${q.quest}.title`)}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="nav-right">
          <LanguageDropdown />
        </div>

        <div className="global-progress">
          <div
            className="progress-fill"
            style={{
              width: `${
                (completedQuests.length /
                  (currentMapData?.quests?.filter(
                    (q) => !q.type || q.type !== 1
                  ).length || 1)) *
                100
              }%`,
            }}
          />
        </div>
      </nav>
      {inputQuest !== "none" && !completedQuests.includes(inputQuest) && (
        <div className="active-quest-banner">
          <div className="quest-label">
            {t("current_objective") || "TARGET:"}
          </div>
          <div className="quest-title">
            {t(`${translationSpace}.${inputQuest}.title`)}
          </div>
        </div>
      )}
      {/* 2. ZONE DE JEU (GAME LEVEL) */}
      <main className="game-viewport">
        <GameLevel
          levelsData={levelsData}
          weekOfYear={weekOfYear}
          inputLevel={currentLevel}
          inputGameMode={GAME_MODE_ONEQUEST}
          inputQuest={inputQuest}
          minimalMode={true}
          forceReload={forceReload}
          reloadDone={reloadDone}
          onQuestSuccess={onQuestSuccess}
          targetImageRatio={0.8}
          completedQuests={completedQuests}
        />
      </main>
    </div>
  );
};

export default GameHub;
