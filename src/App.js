import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { format, getISOWeek } from "date-fns";
import GameLevel from "./components/GameLevel";
import Profile from "./components/Profile";
import Heading from "./components/Heading";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Leaderboard from "./components/Leaderboard";
import PopupForm from "./components/PopupForm";
import PopupResults from "./components/PopupResults";
import SlotMachine from "./components/SlotMachine";
import WeeklyContestDraw from "./components/WeeklyContestDraw";
import WeeklyRanking from "./components/WeeklyRanking";
import Catalog from "./components/Catalog";
import Weekly from "./components/Weekly";
import "./styles/app.css";
import "./assets/fonts/Oswald-Bold.ttf";

import en from "./i18n/en";
import fr from "./i18n/fr";
import { weeklyContests } from "./gameLevelConfig";

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
  const [contestOfTheWeek, setContestOfTheWeek] = useState();
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
      newLevelData.push(level.data());
    });
    setLevelsData(newLevelData);
  };
  const gameIndexToName = {
    1: "pokemon",
    2: "ghibli",
    3: "jrpg",
    4: "jrpg",
    5: "90s",
    6: "tezuka",
    7: "onepiece",
    8: "naruto",
    9: "gundam",
    10: "metalgear",
    11: "dragonball",
    12: "sailormoon",
    13: "berserk",
    14: "nier",
    15: "demonslayers",
    16: "hunterxhunter",
    17: "jojo",
    18: "persona",
    19: "gainax",
    20: "attackontitan",
    21: "clamp",
  };
  const gameRoutes = Object.entries(gameIndexToName).map(
    ([index, gameName]) => (
      <Route
        key={index}
        path={`/worldmaps/game/${gameName}`}
        element={
          <>
            <Heading />
            <GameLevel
              levelsData={levelsData}
              weekOfYear={weekOfYear}
              inputLevel={index}
            />
          </>
        }
      />
    )
  );
  useEffect(() => {
    if (typeof weeklyContests[weekOfYear] !== "undefined")
      setContestOfTheWeek(weeklyContests[weekOfYear]);
    const currentDate = new Date();
    setWeekOfYear(getISOWeek(currentDate));
    getLevelData();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/worldmaps/catalog"
          element={<Catalog levelsData={levelsData} weekOfYear={weekOfYear} />}
        />
        <Route path="/" element={<Heading />} />
        <Route
          path="/worldmaps"
          element={
            <>
              <Heading />
              <Home levelsData={levelsData} weekOfYear={weekOfYear} />{" "}
            </>
          }
        />
        <Route path="/worldmaps/popupform" element={<PopupForm />} />
        <Route
          path="/worldmaps/popupresults"
          element={<WeeklyContestDraw weekOfYear={weekOfYear} />}
        />
        <Route
          path="/worldmaps/weeklyResults"
          element={<WeeklyContestDraw weekOfYear={weekOfYear} />}
        />
        <Route
          path="/worldmaps/weeklyRanking"
          element={
            <>
              <Heading />
              <WeeklyRanking weekOfYear={weekOfYear} />{" "}
            </>
          }
        />
        <Route
          path="/worldmaps/profile"
          element={
            <>
              <Heading />
              <Profile levelsData={levelsData} weekOfYear={weekOfYear} />
            </>
          }
        />
        <Route
          path="worldmaps/weekly"
          element={
            <>
              <Weekly weekOfYear={weekOfYear} />
            </>
          }
        />
        <Route
          path="worldmaps/leaderboard"
          element={
            <>
              <Heading />
              <Leaderboard
                levelsData={levelsData}
                weekOfYear={weekOfYear}
                leaderboardData={leaderboardData}
                minimalMode={false}
              />
            </>
          }
        >
          <Route path=":level" element={<div></div>} />
        </Route>
        <Route path="/worldmaps/game">
          <Route
            path=":level"
            element={
              <>
                <Heading />
                <GameLevel
                  levelsData={levelsData}
                  updateLeaderboardData={getLeaderboardData}
                  weekOfYear={weekOfYear}
                />
              </>
            }
          />
        </Route>
        {gameRoutes}
        <Route
          path="*"
          element={
            <>
              <Heading />
              <NotFound />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export const auth = getAuth(app);
export default App;
