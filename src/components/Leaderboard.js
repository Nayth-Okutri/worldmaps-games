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
} from "firebase/firestore";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
  TIMEATTACK_TIME,
} from "./Constants";
import RankingTable from "./RankingTable";
const Leaderboard = ({ levelsData, weekOfYear }) => {
  const [levelLeaderboardData, setLevelLeaderboardData] = useState([]);
  const [displayedLeaderboardData, setDisplayedLeaderboardData] = useState([]);
  const level = +useParams().level || 1;
  const [currentLevel, setCurrentLevel] = useState(level);
  const [gameMode, setGameMode] = useState(0);
  const [weekDates, setWeekDates] = useState({
    start: new Date(),
    end: new Date(),
  });

  console.log(weekOfYear);

  const changeLevelInDisplay = (level) => {
    setDisplayedLeaderboardData([]);
    setCurrentLevel(level);
  };
  const changeGameModeInDisplay = (mode) => {
    setGameMode(mode);
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
  const getLeaderboardDates = () => {
    const date = new Date();
    const newWeekDates = getWeekDates(date.getFullYear(), weekOfYear);
    setWeekDates(newWeekDates);
    //console.log("Start date:", weekDates.start.toDateString());
    //console.log("End date:", weekDates.end.toDateString());
  };
  const getLeaderboardDataForLevel = async (level) => {
    setLevelLeaderboardData([]);

    let newLeaderboardData = [];
    const leaderboardCollectionRef = collection(getFirestore(), "leaderboard");

    const scoresCollectionRef = collection(
      leaderboardCollectionRef,
      String(weekOfYear) + "/level" + String(level)
    );
    //A CHANGER
    const leaderboardSnapshot = await getDocs(
      query(scoresCollectionRef, orderBy("score"), limit(100))
    );
    leaderboardSnapshot.forEach((score) => {
      const scoreData = score.data();
      if (
        !newLeaderboardData.some(
          (existingScore) => existingScore.name === scoreData.name
        )
      ) {
        newLeaderboardData.push(score.data());
        console.log(score.data());
      }
    });
    const sortedLevelLeaderboardData = [...newLeaderboardData].sort(
      (a, b) => a.time - b.time
    );
    setLevelLeaderboardData(sortedLevelLeaderboardData);
    return sortedLevelLeaderboardData;
  };
  useEffect(() => {
    getLeaderboardDates();
    //Charge a tous les changements de gamemode au lieu de lire dans le level data !!
    getLeaderboardDataForLevel(currentLevel)
      .then((newLevelLeaderboardData) => {
        if (gameMode !== 0) {
          console.log("gameMode " + gameMode);
          let subList = newLevelLeaderboardData.filter(
            (data) => data.gameMode === gameMode
          );
          if (gameMode === GAME_MODE_TIMEATTACK)
            subList = [...subList].sort((a, b) => b.score - a.score);
          console.log(JSON.stringify(subList));
          setDisplayedLeaderboardData(subList);
        } else {
          setDisplayedLeaderboardData(newLevelLeaderboardData);
        }
      })
      .catch((error) => {
        console.error("Error fetching leaderboard data:", error);
      });
  }, [currentLevel, gameMode]);
  return (
    <div className="leaderboard">
      <div>
        <h1>{`Leaderboard ${weekDates.start
          .toDateString()
          .slice(0, -4)} - ${weekDates.end.toDateString()}`}</h1>
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
          />
        }
      />
    </div>
  );
};

export default Leaderboard;
