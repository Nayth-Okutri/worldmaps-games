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
  console.log(weekOfYear);
  leaderboardData = leaderboardData.filter(
    (data) => data.level === currentLevel
  );
  leaderboardData.sort((a, b) => a.time - b.time);

  const changeLevelInDisplay = (level) => {
    setCurrentLevel(level);
  };
  const getLeaderboardDataForLevel = async (level) => {
    setLevelLeaderboardData([]);
    const docRef = doc(getFirestore(), "leaderboard", String(weekOfYear));
    const docSnap = await getDoc(docRef);
    const levelCount = docSnap.data().levelCount;
    console.log(levelCount);
    let newLeaderboardData = [];
    const leaderboardCollectionRef = collection(getFirestore(), "leaderboard");

    const scoresCollectionRef = collection(
      leaderboardCollectionRef,
      String(weekOfYear) + "/level" + String(level)
    );

    const leaderboardSnapshot = await getDocs(scoresCollectionRef);
    leaderboardSnapshot.forEach((score) => {
      newLeaderboardData.push(score.data());
      console.log(score.data());
    });
    const sortedLevelLeaderboardData = [...newLeaderboardData].sort(
      (a, b) => a.time - b.time
    );
    setLevelLeaderboardData(sortedLevelLeaderboardData);
  };
  useEffect(() => {
    getLeaderboardDataForLevel(currentLevel);
  }, [currentLevel]);
  return (
    <div className="leaderboard">
      <div>
        <h1>Leaderboard</h1>
        <div className="buttons">
          <Link to={`/game/${currentLevel}`}>
            <button className="play">Play This Level</button>
          </Link>
          <Link to="/worldmaps">
            <button className="back">Back To Home</button>
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
