import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import GameLevel from "./components/GameLevel";
import Heading from "./components/Heading";
import Home from "./components/Home";
import Leaderboard from "./components/Leaderboard";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import "./styles/app.css";
import "./assets/fonts/Oswald-Bold.ttf";

function App() {
  initializeApp(firebaseConfig);

  const [levelsData, setLevelsData] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [weekOfYear, setWeekOfYear] = useState(0);
  const getLeaderboardData = async () => {
    console.log("weekOfYear " + weekOfYear);
    const leaderboardCollectionRef = collection(getFirestore(), "leaderboard");
    //const scoresCollectionRef = collection(leaderboardCollectionRef, String(week)+"/level"+String(level));
    const leaderboardQuery = query(
      collection(getFirestore(), "leaderboard"),
      orderBy("level", "asc")
    );

    const leaderboardSnapshot = await getDocs(leaderboardQuery);
    let newLeaderboardData = [];
    leaderboardSnapshot.forEach((score) => {
      newLeaderboardData.push(score.data());
      //console.log(score.data());
    });
    setLeaderboardData(newLeaderboardData);
  };
  const getLevelData = async () => {
    const levelsQuery = query(
      collection(getFirestore(), "levelData"),
      orderBy("level", "asc")
    );

    const levelsSnapshot = await getDocs(levelsQuery);
    let newLevelData = [];
    levelsSnapshot.forEach((level) => {
      console.log(level.data());
      newLevelData.push(level.data());
    });
    setLevelsData(newLevelData);
  };

  useEffect(() => {
    const currentDate = new Date();
    setWeekOfYear(
      Math.ceil(
        (currentDate.getDay() +
          Math.floor(
            (currentDate - new Date(currentDate.getFullYear(), 0, 1)) /
              (24 * 60 * 60 * 1000)
          )) /
          7
      )
    );
    getLevelData();
    getLeaderboardData();
  }, []);

  const isNameInLeaderboardRepeated = (name, level) => {
    const scoresFromLevel = leaderboardData.filter(
      (data) => data.level === level
    );
    const hasName =
      scoresFromLevel.filter(
        (score) => score.name.toLowerCase() === name.toLowerCase()
      ).length > 0;

    return hasName;
  };

  return (
    <BrowserRouter>
      <Heading />
      <Routes>
        <Route path="/worldmaps" element={<Home levelsData={levelsData} />} />
        <Route
          path="worldmaps/leaderboard"
          element={
            <Leaderboard
              levelsData={levelsData}
              leaderboardData={leaderboardData}
              weekOfYear={weekOfYear}
            />
          }
        >
          <Route path=":level" element={<div></div>} />
        </Route>
        <Route path="game">
          <Route
            path=":level"
            element={
              <GameLevel
                levelsData={levelsData}
                isNameInLeaderboardRepeated={isNameInLeaderboardRepeated}
                updateLeaderboardData={getLeaderboardData}
                weekOfYear={weekOfYear}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// TODOS:
// Add X mark in hit spots
// Add start button before game starts
