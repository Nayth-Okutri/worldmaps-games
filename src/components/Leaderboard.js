import LevelsDisplay from "./LevelsDisplay";
import "../styles/leaderboard.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
  TIMEATTACK_TIME,
} from "./Constants";
const Leaderboard = ({ levelsData, leaderboardData, weekOfYear }) => {
  const [levelLeaderboardData, setLevelLeaderboardData] = useState([]);
  const [displayedLeaderboardData, setDisplayedLeaderboardData] = useState([]);
  const level = +useParams().level || 1;
  const [currentLevel, setCurrentLevel] = useState(level);
  const [weekDates, setWeekDates] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [gameMode, setGameMode] = useState(0);
  console.log(weekOfYear);
  leaderboardData = leaderboardData.filter(
    (data) => data.level === currentLevel
  );
  leaderboardData.sort((a, b) => a.time - b.time);

  const changeLevelInDisplay = (level) => {
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
    console.log("Start date:", weekDates.start.toDateString());
    console.log("End date:", weekDates.end.toDateString());
  };
  const getLeaderboardDataForLevel = async (level) => {
    setLevelLeaderboardData([]);

    let newLeaderboardData = [];
    const leaderboardCollectionRef = collection(getFirestore(), "leaderboard");

    const scoresCollectionRef = collection(
      leaderboardCollectionRef,
      String(weekOfYear) + "/level" + String(level)
    );

    const leaderboardSnapshot = await getDocs(scoresCollectionRef);
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
  };
  useEffect(() => {
    getLeaderboardDates();
    getLeaderboardDataForLevel(currentLevel);
    if (gameMode !== 0) {
      console.log("gameMode " + gameMode);
      const subList = levelLeaderboardData.filter(
        (data) => data.gameMode === gameMode
      );
      console.log(JSON.stringify(subList));
      setDisplayedLeaderboardData(subList);
    }
  }, [currentLevel, gameMode]);
  return (
    <div className="leaderboard">
      <div>
        <h1>{`Leaderboard ${weekDates.start
          .toDateString()
          .slice(0, -4)} - ${weekDates.end.toDateString()}`}</h1>
        <div className="buttons">
          {gameMode ? (
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
      />
      <div className="data">
        {gameMode === GAME_MODE_DUPLICATE && (
          <h1>High scores for the mode Duplicate Hunt</h1>
        )}
        {gameMode === GAME_MODE_10_QUESTS && (
          <h1>High scores for the mode Random 10 Quests</h1>
        )}
        {gameMode === GAME_MODE_TIMEATTACK && (
          <h1>High scores for the mode Time Attack</h1>
        )}
        {gameMode === GAME_MODE_ALLQUESTS && (
          <h1>High scores for the mode Otaku Mastery</h1>
        )}

        <table>
          <thead>
            <tr>
              <th>RANK</th>
              <th>NAME</th>
              <th>SCORE</th>
              <th>TIME (SECONDS)</th>
            </tr>
          </thead>
          <tbody>
            {displayedLeaderboardData &&
              displayedLeaderboardData.map((data, index) => {
                const rank = index + 1; // Rank starts from 1
                const isHighlight = index === 0;
                return (
                  <tr key={data.name}>
                    <td>
                      {rank}
                      {isHighlight && (
                        <img
                          src={require("../assets/ChampionIcon.png")}
                          alt="Image"
                          className="rank-image"
                          style={{ height: "15px" }}
                        />
                      )}
                    </td>
                    <td>{data.name}</td>
                    <td>{data.score}</td>
                    <td>{data.time}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
