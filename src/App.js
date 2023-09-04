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
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import "./styles/app.css";
import "./assets/fonts/Oswald-Bold.ttf";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format, getISOWeek } from "date-fns";
import en from "./i18n/en";
import fr from "./i18n/fr";
const app = initializeApp(firebaseConfig);
function App() {
  i18n.init({
    lng: "fr", // Default language
    resources: {
      en,
      fr,
    }, // the files with the translations
  });
  // Initialize react-i18next
  i18n.use(initReactI18next).init({
    lng: "fr", // Default language
    resources: {
      en,
      fr,
    },
  });
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
    setWeekOfYear(getISOWeek(currentDate));
    getLevelData();
  }, []);

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
              weekOfYear={weekOfYear}
              leaderboardData={leaderboardData}
            />
          }
        >
          <Route path=":level" element={<div></div>} />
        </Route>
        <Route path="/worldmaps/game">
          <Route
            path=":level"
            element={
              <GameLevel
                levelsData={levelsData}
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
export const auth = getAuth(app);
export default App;
