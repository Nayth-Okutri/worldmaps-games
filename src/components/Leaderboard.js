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
const Leaderboard = ({ levelsData, leaderboardData, weekOfYear }) => {
  const [levelLeaderboardData, setLevelLeaderboardData] = useState([]);
  const level = +useParams().level || 1;
  const [currentLevel, setCurrentLevel] = useState(level);
  const [weekDates, setWeekDates] = useState({
    start: new Date(),
    end: new Date(),
  });
  console.log(weekOfYear);
  leaderboardData = leaderboardData.filter(
    (data) => data.level === currentLevel
  );
  leaderboardData.sort((a, b) => a.time - b.time);

  const changeLevelInDisplay = (level) => {
    setCurrentLevel(level);
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

    const docRef = doc(getFirestore(), "leaderboard", String(weekOfYear));
    const docSnap = await getDoc(docRef);
    //const levelCount = docSnap.data().levelCount;

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
  }, [currentLevel]);
  return (
    <div className="leaderboard">
      <div>
        <h1>{`Leaderboard ${weekDates.start
          .toDateString()
          .slice(0, -4)} - ${weekDates.end.toDateString()}`}</h1>
        <div className="buttons">
          <Link to={`/worldmaps/game/${currentLevel}`}>
            <button className="play">Play This Level</button>
          </Link>
        </div>
      </div>
      <LevelsDisplay
        levelsData={levelsData}
        clickFunction={changeLevelInDisplay}
        displayIcons={false}
        highlight={currentLevel}
      />
      <div className="data">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>TIME (SECONDS)</th>
            </tr>
          </thead>
          <tbody>
            {levelLeaderboardData &&
              levelLeaderboardData.map((data) => {
                return (
                  <tr key={data.name}>
                    <td>{data.name}</td>
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
