import LevelsDisplay from "./LevelsDisplay";
import "../styles/leaderboard.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
  ALLGAMEMODES,
  TIMEATTACK_TIME,
} from "./Constants";
import RankingTable from "./RankingTable";

import { useTranslation } from "react-i18next";
const Leaderboard = ({
  levelsData,
  weekOfYear,
  userId,
  minimalMode = false,
}) => {
  const [levelLeaderboardData, setLevelLeaderboardData] = useState([]);

  const [displayedLeaderboardData, setDisplayedLeaderboardData] = useState([]);
  const level = +useParams().level || 1;
  const [currentLevel, setCurrentLevel] = useState(level);
  const [prevLevel, setPrevLevel] = useState(0);
  const [prevWeek, setPrevWeek] = useState(0);
  const [gameMode, setGameMode] = useState(0);
  const [weekDates, setWeekDates] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [displayedWeek, setDisplayedWeek] = useState(0);
  console.log(weekOfYear);
  const { t } = useTranslation("menu");
  const changeLevelInDisplay = (level) => {
    setDisplayedLeaderboardData([]);
    setCurrentLevel(level);
  };
  const changeGameModeInDisplay = (mode) => {
    setGameMode(mode);
  };
  const getWeekDates = (year, weekNumber) => {
    const date = new Date(year, 0, 1); // January 1st of the year
    const dayOfWeek = date.getDay(); // Day of the week of January 1st
    const daysToAdd = 1 - dayOfWeek + (weekNumber - 1) * 7; // Number of days to add to get to the start of the requested week

    date.setDate(date.getDate() + daysToAdd);

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 6); // End date is 6 days after the start date

    return {
      start: startDate,
      end: endDate,
    };
  };
  const changeWeek = (direction) => {
    if (direction === "prev") {
      setPrevWeek(displayedWeek);
      setDisplayedWeek(displayedWeek - 1);
    } else if (direction === "next") {
      setPrevWeek(displayedWeek);
      setDisplayedWeek(displayedWeek + 1);
    }
  };
  const getLeaderboardDates = () => {
    const date = new Date();
    const newWeekDates = getWeekDates(date.getFullYear(), displayedWeek);
    setWeekDates(newWeekDates);
    //console.log("Start date:", weekDates.start.toDateString());
    //console.log("End date:", weekDates.end.toDateString());
  };
  const getLeaderboardDataForLevel = async (level) => {
    setLevelLeaderboardData([]);
    const gameModeArrays = {};
    let newLeaderboardData = [];
    const leaderboardCollectionRef = collection(getFirestore(), "leaderboard");

    const scoresCollectionRef = collection(
      leaderboardCollectionRef,
      String(displayedWeek) + "/level" + String(level)
    );
    //A CHANGER

    const leaderboardSnapshot = await getDocs(
      query(scoresCollectionRef, orderBy("score"), limit(100)),
      { source: "server" }
    );
    //console.log("leaderboardSnapshot " + leaderboardSnapshot);
    ALLGAMEMODES.forEach((gameMode) => {
      gameModeArrays[gameMode] = [];
    });
    leaderboardSnapshot.forEach((score) => {
      const scoreData = score.data();
      const gameMode = scoreData.gameMode;
      if (!gameModeArrays[gameMode]) {
        gameModeArrays[gameMode] = [];
      }
      const exists = gameModeArrays[gameMode].some(
        (existingScore) => existingScore.name === scoreData.name
      );
      if (!exists) {
        gameModeArrays[gameMode].push(scoreData);
        console.log(gameModeArrays);
      }
    });
    console.log(gameModeArrays);

    setLevelLeaderboardData(gameModeArrays);
    setPrevWeek(displayedWeek);
    return gameModeArrays;
  };
  useEffect(() => {
    if (displayedWeek === 0) setDisplayedWeek(weekOfYear);
    getLeaderboardDates();
    console.log(userId);

    //Charge a tous les changements de gamemode au lieu de lire dans le level data !!
    getLeaderboardDataForLevel(currentLevel)
      .then((newLevelLeaderboardData) => {
        if (gameMode !== 0) {
          console.log("gameMode " + gameMode);

          let subList = newLevelLeaderboardData[gameMode];
          if (gameMode === GAME_MODE_TIMEATTACK)
            subList = [...subList].sort((a, b) => b.score - a.score);
          else subList = [...subList].sort((a, b) => a.time - b.time);
          if (typeof userId !== "undefined")
            subList = subList.filter((data) => data.userId === userId);
          console.log("subList " + JSON.stringify(subList));
          setDisplayedLeaderboardData(subList);
        } else {
          //setDisplayedLeaderboardData(newLevelLeaderboardData);
        }
      })
      .catch((error) => {
        console.error("Error fetching leaderboard data:", error);
      });
  }, [currentLevel, gameMode, displayedWeek]);
  return (
    <div className="leaderboard">
      <div>
        <h3>{`Leaderboard ${weekDates.start
          .toDateString()
          .slice(0, -4)} - ${weekDates.end.toDateString()}`}</h3>
        <div>
          <button
            style={{
              padding: "6px",
              borderRadius: "8px",
            }}
            onClick={() => changeWeek("prev")}
          >
            {t("LeaderBoardPrevWeek")}
          </button>
          <button
            style={{
              padding: "6px",
              borderRadius: "8px",
            }}
            onClick={() => changeWeek("next")}
            disabled={displayedWeek === weekOfYear}
          >
            {t("LeaderBoardNextWeek")}
          </button>
          <div className="buttons">
            {currentLevel && gameMode ? (
              <Link to={`/worldmaps/game/${currentLevel}?mode=${gameMode}`}>
                <button className="play">Play This Level</button>
              </Link>
            ) : (
              <button className="play" disabled>
                Select a Game Mode
              </button>
            )}
          </div>
        </div>
      </div>

      <LevelsDisplay
        levelsData={levelsData}
        clickFunction={changeLevelInDisplay}
        useClickFunction={true}
        highlight={currentLevel}
        bareMode={true}
        overrideIconClick={changeGameModeInDisplay}
        nestedComponent={
          <RankingTable
            gameMode={gameMode}
            displayedLeaderboardData={displayedLeaderboardData}
            minimalMode={minimalMode}
          />
        }
        minimalMode={minimalMode}
      />
    </div>
  );
};

export default Leaderboard;
