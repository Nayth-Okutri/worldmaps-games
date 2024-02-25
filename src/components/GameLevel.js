import { useState, useRef, useEffect } from "react";
import "../styles/gamelevel.css";
import SelectionMenu from "./SelectionMenu";
import { useParams, useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  where,
  query,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import UserForm from "./UserForm";
import HintPop from "./HintPop";

import GameCommandIcons from "./GameCommandIcons";
import ErrorModalWindow from "./ErrorModalWindow";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
  TIMEATTACK_TIME,
  GAME_MODE_ONEQUEST,
  clickResults,
} from "./Constants";
import { useTranslation } from "react-i18next";
import { useAuth } from "../auth";
import { useUser } from "../userContext";
import LoadingSpinner from "./LoadingSpinner";
import { weeklyContests } from "../gameLevelConfig";
const GameLevel = ({
  levelsData,
  isNameInLeaderboardRepeated,
  updateLeaderboardData,
  weekOfYear,
  inputLevel,
  inputGameMode,
  inputQuest,
  minimalMode,
  forceReload = false,
  reloadDone,
  onQuestSuccess,
  targetImageRatio = 1,
}) => {
  //const level = +useParams().level;
  const { level: urlLevel } = useParams(); // Get the 'level' parameter from the URL

  // Set 'level' to the URL parameter if it exists, otherwise use the inputLevel
  const level = urlLevel ? +urlLevel : inputLevel;
  const levelData = levelsData.filter((value) => value.level === level)[0];

  const ALL_GAME_MODES = [
    GAME_MODE_DUPLICATE,
    GAME_MODE_10_QUESTS,
    GAME_MODE_TIMEATTACK,
    GAME_MODE_ALLQUESTS,
    TIMEATTACK_TIME,
    GAME_MODE_ONEQUEST,
  ];
  const [menuX, setMenuX] = useState(0);
  const [menuY, setMenuY] = useState(0);
  const [shouldDisplayMenu, setShouldDisplayMenu] = useState(false);
  const [lastClickX, setLastClickX] = useState(-10);
  const [lastClickY, setLastClickY] = useState(-10);
  const [hits, setHits] = useState({});

  const startTime = useRef(Date.now());
  const [endTime, setEndTime] = useState(startTime.current);
  const [shouldDisplayForm, setShouldDisplayForm] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [useFormValidation, setUseFormValidation] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [currentQuest, setCurrentQuest] = useState();
  const [numberOfRightHits, setNumberOfRightHits] = useState(0);
  const [showHitTarget, setShowHitTarget] = useState(true);
  const [questCount, setQuestCount] = useState(0);

  const [maxQuestHit, setMaxQuestHit] = useState(0);
  const [questHits, setQuestHits] = useState([]);
  const [clickNumber, setClickNumber] = useState(1);
  const [questResult, setQuestResult] = useState(clickResults.Pending);
  const [gameEnded, setGameEnded] = useState(false);
  const [clickCloseRight, setClickCloseRight] = useState(false);
  const [clickCloseBottom, setClickCloseBottom] = useState(false);
  const [indicators, setIndicators] = useState([]);
  const [showRedQuestion, setShowRedQuestion] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(70);
  const [scaledWidth, setScaledWidth] = useState(100); // Initial zoom level is 100%
  const [scaledHeight, setScaledHeight] = useState(100);
  const [imageSource, setImageSource] = useState(null);
  let navigate = useNavigate();
  const [gameMode, setGameMode] = useState(0);
  const [singleQuest, setSingleQuest] = useState(0);
  const [timerStarted, setTimerStarted] = useState(false);
  const [workingQuests, setWorkingQuests] = useState([]);
  const [descriptionIsSticky, setDescriptionIsSticky] = useState(false);
  const descriptionRef = useRef();
  const [translationSpace, setTranslationSpace] = useState();
  const { t } = useTranslation("gamequests");
  const { currentUser } = useAuth();
  const { player } = useUser();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [criticalError, setCriticalError] = useState("");
  const [loading, setLoading] = useState(true);
  const [contestOfTheWeek, setContestOfTheWeek] = useState();
  const [isContestOfTheWeek, setIsContestOfTheWeek] = useState(false);
  const [prevQuest, setPrevQuest] = useState();

  useEffect(() => {
    const cachedRef = descriptionRef.current;
    const queryParams = new URLSearchParams(window.location.search);
    const modeParam = parseInt(queryParams.get("mode"));
    const paramQuest = queryParams.get("quest");

    setGameMode(modeParam); // This will set the value of the 'mode' parameter
    setSingleQuest(paramQuest);
    if (typeof inputQuest !== "undefined") {
      console.log("restart quest");
      setSingleQuest(inputQuest);
    }
    console.log(inputGameMode);
    if (isNaN(modeParam) && isNaN(inputGameMode))
      setGameMode(GAME_MODE_10_QUESTS);
    else if (!isNaN(inputGameMode)) setGameMode(inputGameMode);

    if (!isNaN(inputLevel)) {
      const hashedImagePath = getHashedAssetPath(`level-${inputLevel}`);
      setImageSource(hashedImagePath);
    }

    const observer = new IntersectionObserver(
      ([e]) => setDescriptionIsSticky(e.intersectionRatio < 1),
      {
        threshold: [1],
      }
    );
    if (
      typeof contestOfTheWeek === "undefined" &&
      typeof weeklyContests[weekOfYear] !== "undefined"
    ) {
      setContestOfTheWeek(weeklyContests[weekOfYear]);
      const weeklyGameLevel = weeklyContests[weekOfYear].match(/\d+/)[0];
      const weeklyGameMode = weeklyContests[weekOfYear].match(/mode=(\d+)/)[1];
      let weeklyQuestParam;
      const match = weeklyContests[weekOfYear].match(/quest=(\w+)/);
      if (match) weeklyQuestParam = match[1];

      console.log(
        "params 0 : " + parseInt(weeklyGameLevel) + " " + parseInt(level)
      );
      console.log("params 1 : " + parseInt(weeklyGameMode) + " " + gameMode);

      console.log("questParam : " + weeklyQuestParam);
      if (
        parseInt(weeklyGameLevel) === parseInt(level) &&
        parseInt(weeklyGameMode) === modeParam
      )
        console.log(paramQuest);
      if (
        parseInt(weeklyGameMode) === GAME_MODE_ONEQUEST &&
        weeklyQuestParam !== paramQuest
      ) {
        console.log("NOP");
        setIsContestOfTheWeek(false);
      } else {
        console.log("-------CONTEST OF WEEK : ");
        setIsContestOfTheWeek(true);
      }
    }
    console.log("level " + level);

    if (!ALL_GAME_MODES.includes(gameMode) && gameMode !== 0)
      showCriticalError("error.GameModeIncorrect");
    if (
      levelsData.length > 0 &&
      !isNaN(level) &&
      levelsData.filter((value) => value.level === level).length === 0
    )
      showCriticalError("error.LevelNotFound");

    if (typeof cachedRef !== "undefined") observer.observe(cachedRef);
    const image = document.getElementById("levelImage");

    setScaledWidth(image.naturalWidth * targetImageRatio * (zoomLevel / 100));
    setScaledHeight(image.naturalHeight * targetImageRatio * (zoomLevel / 100));
    toggleCenteringClass();
    window.addEventListener("resize", toggleCenteringClass);
    //console.log("levelData" + JSON.stringify(levelData));
    switch (gameMode) {
      case GAME_MODE_DUPLICATE:
        if (levelData && !gameEnded) {
          setTranslationSpace(levelData.translationSpace);
          let duplicateQuests;
          //console.log("levelData " + JSON.stringify(levelData.quests));
          if (questCount === 0) {
            duplicateQuests = levelData.quests.filter(
              (quest) => quest.type === 1
            );

            setWorkingQuests(duplicateQuests);
            const duplicateQuestCount = Object.keys(duplicateQuests).length;
            console.log("duplicateQuestCount " + duplicateQuestCount);

            if (duplicateQuestCount === 0)
              showCriticalError("error.QuestNotFound");
          }

          const duplicateQuestCount = Object.keys(workingQuests).length;
          setQuestCount(duplicateQuestCount);
          console.log("workingQuests " + JSON.stringify(workingQuests));
          console.log("duplicateQuestCount " + duplicateQuestCount);
          if (
            duplicateQuestCount > 0 &&
            (typeof currentQuest === "undefined" ||
              hits[currentQuest] === true) &&
            Object.keys(hits).length !== duplicateQuestCount
          ) {
            let newQuest = Math.floor(Math.random() * duplicateQuestCount);
            if (Object.keys(hits).length !== 0) {
              do {
                newQuest = Math.floor(Math.random() * duplicateQuestCount);
              } while (
                Object.keys(hits).includes(newQuest) ||
                hits[newQuest] === true
              );
            }
            setQuestHits([]);
            setCurrentQuest(newQuest);
            console.log("newQuest " + newQuest);
            getImageSource(newQuest);
            setShowRedQuestion(true); // Set the showRedQuestion state to true
            setTimeout(() => {
              setShowRedQuestion(false); // Reset the showRedQuestion state after 1 second
            }, 1000);
          }
        }
        if (levelData && workingQuests[currentQuest]) {
          setMaxQuestHit(
            Object.keys(workingQuests[currentQuest].positions).length
          );
        }

        break;
      case GAME_MODE_10_QUESTS:
      case GAME_MODE_ALLQUESTS:
      case GAME_MODE_TIMEATTACK:
        if (levelData && !gameEnded) {
          let regularQuests;
          setTranslationSpace(levelData.translationSpace);
          if (questCount === 0) {
            regularQuests = levelData.quests.filter(
              (quest) => typeof quest.type === "undefined" || quest.type !== 1
            );
            setWorkingQuests(regularQuests);
          }
          const currentQuestCount = Object.keys(workingQuests).length;
          setQuestCount(currentQuestCount);
          //console.log("currentQuestCount " + currentQuestCount);
          if (
            currentQuestCount > 0 &&
            (typeof currentQuest === "undefined" ||
              hits[currentQuest] === true) &&
            Object.keys(hits).length !== currentQuestCount
          ) {
            let newQuest = Math.floor(Math.random() * currentQuestCount);
            if (Object.keys(hits).length !== 0) {
              do {
                newQuest = Math.floor(Math.random() * currentQuestCount);
              } while (
                Object.keys(hits).includes(newQuest) ||
                hits[newQuest] === true
              );
            }
            console.log("rince");
            setQuestHits([]);
            setCurrentQuest(newQuest);
            getImageSource(newQuest);
            //console.log("newQuest " + newQuest);
            setShowRedQuestion(true); // Set the showRedQuestion state to true
            setTimeout(() => {
              setShowRedQuestion(false); // Reset the showRedQuestion state after 1 second
            }, 1000);
          }
        }
        if (levelData && workingQuests[currentQuest]) {
          setMaxQuestHit(
            Object.keys(workingQuests[currentQuest].positions).length
          );
        }
        break;
      case GAME_MODE_ONEQUEST:
        console.log("singleQuest " + singleQuest);
        console.log("singleQuest " + prevQuest);
        if (levelData && !gameEnded) {
          if (questCount === 0 || singleQuest !== prevQuest || forceReload) {
            let regularQuests;
            setTranslationSpace(levelData.translationSpace);
            if (questCount === 0 || singleQuest !== prevQuest || forceReload) {
              regularQuests = levelData.quests.filter(
                (quest) => quest.quest === singleQuest
              );
              setWorkingQuests(regularQuests);
              const theQuestCount = Object.keys(regularQuests).length;
              console.log("theQuestCount " + theQuestCount);

              if (theQuestCount === 0) showCriticalError("error.QuestNotFound");
            }
            console.log("workingQuests " + workingQuests);
            const currentQuestCount = Object.keys(workingQuests).length;
            //if (currentQuestCount === 0) showCriticalError("NoQuestAvailable");
            setQuestCount(currentQuestCount);
            console.log(currentQuestCount);
            console.log(workingQuests[0]);
            setTranslationSpace(levelData.translationSpace);
            let newQuest = 0;
            setQuestHits([]);
            setCurrentQuest(newQuest);
            getImageSource(newQuest);
            //console.log("newQuest " + newQuest);
            setShowRedQuestion(true); // Set the showRedQuestion state to true
            setTimeout(() => {
              setShowRedQuestion(false); // Reset the showRedQuestion state after 1 second
            }, 1000);
            setPrevQuest(singleQuest);
            if (typeof reloadDone !== "undefined") reloadDone();
          }
        }
        if (levelData && workingQuests[currentQuest]) {
          setMaxQuestHit(
            Object.keys(workingQuests[currentQuest].positions).length
          );
        }
        break;
      default:
        break;
    }

    switch (gameMode) {
      case GAME_MODE_DUPLICATE:
      case GAME_MODE_10_QUESTS:
      case GAME_MODE_ALLQUESTS:
      case GAME_MODE_ONEQUEST:
        if (!gameEnded) {
          console.log(" timer");
          setTimerStarted(true);
          const interval = setInterval(() => {
            setCurrentTime(
              (Math.floor(Date.now() - startTime.current) / 1000).toFixed(1)
            );
          }, 1000);
          if (gameEnded) {
            clearInterval(interval);
          }
          return () => clearInterval(interval);
        }
        break;

      case GAME_MODE_TIMEATTACK:
        // Code to start the timer at one minute and count down to zero

        if (!gameEnded) {
          console.log("start timer");

          const initialTime = TIMEATTACK_TIME; // 1 minute in seconds
          console.log("timerStarted " + timerStarted);
          if (!timerStarted) setCurrentTime(initialTime);
          setTimerStarted(true);

          const interval = setInterval(() => {
            setCurrentTime((prevTime) => {
              if (prevTime > 0) {
                return prevTime - 1;
              } else {
                clearInterval(interval);
                endGame();
                return 0;
              }
            });
          }, 1000);
          //console.log("currentTime " + currentTime);

          return () => clearInterval(interval);
        }
        break;

      default:
        break;
    }

    return () => {
      observer.unobserve(cachedRef);

      window.removeEventListener("resize", toggleCenteringClass);
    };
  }, [
    levelsData,
    inputLevel,
    inputQuest,
    singleQuest,
    hits,
    currentQuest,
    questCount,
    gameEnded,
    numberOfRightHits,
    indicators,
    zoomLevel,
    gameMode,
    scaledWidth,
    workingQuests,
  ]);

  const onLevelImageLoad = () => {
    const image = document.getElementById("levelImage");
    const roundedZoomLevel = Math.floor(
      (window.innerWidth / image.naturalWidth) * 100
    );
    setLoading(false);
    setZoomLevel(Math.min(roundedZoomLevel, 100));
    //console.log("roundedZoomLevel " + roundedZoomLevel);
    setScaledWidth(image.naturalWidth * (roundedZoomLevel / 100));
    setScaledHeight(image.naturalHeight * (roundedZoomLevel / 100));
    toggleCenteringClass();
  };
  const toggleCenteringClass = () => {
    const image = document.getElementById("levelImage");
    const container = document.querySelector(".game-container");
    if (image && container) {
      const isImageWiderThanViewport = image.clientWidth > window.innerWidth;
      //console.log(image.naturalWidth);

      //console.log("isImageTallerThanViewport " + isImageWiderThanViewport);
      if (isImageWiderThanViewport) {
        container.classList.remove("center-only-when-fit");
      } else {
        //console.log("image.naturalWidth " + image.naturalWidth);
        //console.log("window.innerWidth " + window.innerWidth);
        if (image.naturalWidth !== 0)
          container.classList.add("center-only-when-fit");
      }
    } else if (container) container.classList.remove("center-only-when-fit");
  };
  const handleZoomIn = () => {
    setShouldDisplayMenu(false);
    setShowHitTarget(false);
    setShowHint(false);
    setZoomLevel((prevZoom) => Math.min(prevZoom + 10, 100)); // Increase zoom level by 10%
  };

  const handleZoomOut = () => {
    setShouldDisplayMenu(false);
    setShowHitTarget(false);
    setShowHint(false);
    setZoomLevel((prevZoom) =>
      Math.max(prevZoom - 10, window.innerWidth > 768 ? 50 : 30)
    ); // Decrease zoom level by 10%
  };
  const handleHint = (e) => {
    setShowHint(true);
    setShouldDisplayMenu(false);
    const x = e.clientX;
    const y = e.clientY;

    setMenuX(x);
    setMenuY(y);
  };
  function isClickWithinElement(topCoord, bottomCoord, clickX, clickY) {
    const isWithinXBoundary = clickX >= topCoord.x && clickX <= bottomCoord.x;
    const isWithinYBoundary = clickY >= topCoord.y && clickY <= bottomCoord.y;

    return isWithinXBoundary && isWithinYBoundary;
  }

  const handleUserNameInput = (e) => {
    const newUserName = e.target.value.slice(0, 20);
    if (useFormValidation) {
      if (newUserName === "") {
        setShowErrorMessage(true);
      } else {
        setShowErrorMessage(false);
      }
    }
    setUserName(e.target.value);
  };
  const handleFeedbackInput = (e) => {
    setFeedback(e.target.value);
  };
  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };
  const newActivityTitle = (time) => {
    const reccordedTime =
      gameMode !== GAME_MODE_TIMEATTACK ? time : TIMEATTACK_TIME - time;
    return `${t("LevelCompleted")} ${levelData.name} ${t(
      "InTime"
    )} ${reccordedTime}s ${
      gameMode === GAME_MODE_TIMEATTACK || gameMode === GAME_MODE_ALLQUESTS
        ? `${t("WithScore")}${numberOfRightHits}`
        : ""
    } ${t("ForGameMode")} ${
      gameMode === GAME_MODE_DUPLICATE
        ? t("GAME_MODE_DUPLICATE")
        : gameMode === GAME_MODE_10_QUESTS
        ? t("GAME_MODE_10_QUESTS")
        : gameMode === GAME_MODE_TIMEATTACK
        ? t("GAME_MODE_TIMEATTACK")
        : gameMode === GAME_MODE_ALLQUESTS
        ? t("GAME_MODE_ALLQUESTS")
        : gameMode === GAME_MODE_ONEQUEST
        ? t("GAME_MODE_ONEQUEST")
        : ""
    }`;
  };
  const logUserActivity = async (time) => {
    try {
      if (player) {
        console.log("saving activity");
        const usersCollectionRef = collection(getFirestore(), "users");
        const activitiesCollectionRef = collection(
          usersCollectionRef,
          player.userName,
          "userActivities"
        );
        console.log("activitiesCollectionRef " + activitiesCollectionRef);

        const newActivity = {
          type: "LevelCompleted",
          activity: newActivityTitle(time),
          time,
          gameMode: gameMode,
          score: numberOfRightHits,
          level: level,
          date: new Date(),
        };
        console.log("newActivity " + newActivity);
        await addDoc(activitiesCollectionRef, newActivity);
      }
    } catch (error) {
      console.error("Error writing new score to Firebase Database", error);
    }
  };
  const saveScore = async (name, time) => {
    try {
      if (numberOfRightHits >= 1) {
        console.log("saving score");
        const leaderboardCollectionRef = collection(
          getFirestore(),
          "leaderboard"
        );
        const scoresCollectionRef = collection(
          leaderboardCollectionRef,
          String(weekOfYear) + "/level" + String(level)
        );
        console.log("scoresCollectionRef " + scoresCollectionRef);
        const reccordedTime =
          gameMode !== GAME_MODE_TIMEATTACK ? time : TIMEATTACK_TIME - time;
        console.log("time " + time);
        const newScore = {
          name: player ? player.userName : name,
          feedback: feedback,
          time: reccordedTime,
          gameMode: gameMode,
          score: numberOfRightHits,
          level: level,
          date: new Date(),
          userId: currentUser ? currentUser.uid : "",
        };
        if (feedback.trim() !== "" && name.trim() !== "") {
          const commentsRef = collection(getFirestore(), "comments");
          const newComment = {
            text: feedback,
            name,
            date: new Date(),
          };
          await addDoc(commentsRef, newComment);
        }
        console.log("newScore " + newScore);
        await addDoc(scoresCollectionRef, newScore);
      }
    } catch (error) {
      console.error("Error writing new score to Firebase Database", error);
    }
  };

  const saveContestScore = async (name, time, email) => {
    try {
      if (numberOfRightHits >= 1) {
        console.log("saving score");
        const q = query(
          collection(
            getFirestore(),
            "weeklyContest/" + String(weekOfYear) + "/Results"
          ),
          where("email", "==", email)
        );
        await getDocs(q).then((snap) => {
          if (snap.docs.length <= 0) {
            const leaderboardCollectionRef = collection(
              getFirestore(),
              "weeklyContest"
            );
            const scoresCollectionRef = collection(
              leaderboardCollectionRef,
              String(weekOfYear) + "/Results"
            );
            console.log("scoresCollectionRef " + scoresCollectionRef);
            const reccordedTime =
              gameMode !== GAME_MODE_TIMEATTACK ? time : TIMEATTACK_TIME - time;
            console.log("time " + time);
            const newScore = {
              name: player ? player.userName : name,
              time: time,
              email: email,
              score: numberOfRightHits,
              level: level,
              date: new Date(),
              userId: currentUser ? currentUser.uid : "",
            };

            console.log("newScore " + newScore);
            return addDoc(scoresCollectionRef, newScore);
          } else {
            console.log("Soucis");
          }
        });
      }
    } catch (error) {
      console.error("Error writing new score to Firebase Database", error);
    }
  };
  const showCriticalError = (errorMessage) => {
    setGameEnded(true);
    setCriticalError(errorMessage);
    setGameEnded(true);
    setShowErrorModal(true);
  };
  const endGame = () => {
    if (!minimalMode) {
      setGameEnded(true);
      setEndTime((Date.now() - startTime.current) / 1000); // To milliseconds to seconds
      setShouldDisplayForm(true);
    } else {
      setNumberOfRightHits(0);
      setHits({});
      if (typeof onQuestSuccess !== "undefined") onQuestSuccess(singleQuest);
    }
  };

  const submitScore = (event) => {
    event.preventDefault();
    if (userName || player) {
      if (!isContestOfTheWeek) {
        let reccordedTime;
        if (gameMode !== GAME_MODE_TIMEATTACK) reccordedTime = endTime;
        else reccordedTime = currentTime;
        logUserActivity(reccordedTime);
        saveScore(userName, reccordedTime);
        updateLeaderboardData();
        navigate(`/worldmaps/leaderboard/${level}`);
      } else {
        let reccordedTime;
        if (gameMode !== GAME_MODE_TIMEATTACK) reccordedTime = endTime;
        else reccordedTime = currentTime;
        logUserActivity(reccordedTime);
        saveContestScore(userName, reccordedTime, email);
        updateLeaderboardData();
        navigate(`/worldmaps/weeklyRanking`);
      }
    } else {
      setUseFormValidation(true);
      setShowErrorMessage(true);
    }
  };

  const evaluateEndOfGame = () => {
    const hitObject = hits;
    console.log("hits" + JSON.stringify(hits));
    const numberOfRightQuestHits = Object.keys(hitObject).reduce(
      (previous, current) => {
        if (hitObject[current]) {
          return previous + 1;
        }
        return previous;
      },
      0
    );
    console.log("numberOfRightQuestHits " + numberOfRightQuestHits);
    setNumberOfRightHits(numberOfRightQuestHits);
    switch (gameMode) {
      case GAME_MODE_10_QUESTS:
        if (numberOfRightQuestHits === 10) {
          endGame();
        }
        break;
      case GAME_MODE_DUPLICATE:
      case GAME_MODE_ALLQUESTS:
      case GAME_MODE_ONEQUEST:
        if (numberOfRightQuestHits === Object.keys(workingQuests).length) {
          endGame();
        }
        break;
      case GAME_MODE_TIMEATTACK:
        if (currentTime <= 0) endGame();
        break;
      default:
        break;
    }
    if (numberOfRightQuestHits === Object.keys(workingQuests).length) {
      endGame();
    }
    console.log("numberOfRightHits " + numberOfRightQuestHits);
  };
  const skipQuestion = () => {
    let newQuest = Math.floor(Math.random() * questCount);
    setShouldDisplayMenu(false);
    setShowHitTarget(false);
    setShowHint(false);
    setIndicators([]);
    if (Object.keys(hits).length !== 0) {
      do {
        newQuest = Math.floor(Math.random() * questCount);
      } while (Object.keys(hits).includes(newQuest) || hits[newQuest] === true);
    }
    setQuestHits([]);
    setCurrentQuest(newQuest);
    getImageSource(newQuest);
    setShowRedQuestion(true); // Set the showRedQuestion state to true
    setTimeout(() => {
      setShowRedQuestion(false); // Reset the showRedQuestion state after 1 second
    }, 1000);
  };
  const evaluateMultipleTargetHit = (
    x,
    y,
    xPositionOnImage,
    yPositionOnImage
  ) => {
    console.log("_______________NEW CLICK ");
    const prevIndicator = clickNumber === 1 ? [] : indicators;
    setQuestResult(clickResults.Pending);
    if (clickNumber === 1) {
      setIndicators([]);
      //console.log("indicators " + JSON.stringify(indicators));
    }
    setClickNumber(clickNumber + 1);
    for (let i = 0; i < maxQuestHit; i++) {
      console.log(
        workingQuests[currentQuest].positions[i].top,
        workingQuests[currentQuest].positions[i].bottom
      );
      if (
        isClickWithinElement(
          workingQuests[currentQuest].positions[i].top,
          workingQuests[currentQuest].positions[i].bottom,
          xPositionOnImage,
          yPositionOnImage
        )
      ) {
        console.log("questHits avant " + questHits);
        const hitObject = questHits;

        hitObject[i] = true;
        setQuestHits(hitObject);
        console.log("ok " + i);
      }
    }
    if (clickNumber >= maxQuestHit) {
      if (!shouldDisplayMenu) setShouldDisplayMenu(true);
      if (!showHitTarget) setShowHitTarget(true);
      const hitObject = questHits;
      const numberOfRightQuestHits = Object.keys(hitObject).reduce(
        (previous, current) => {
          if (hitObject[current]) {
            return previous + 1;
          }
          return previous;
        },
        0
      );
      console.log("questHits " + JSON.stringify(questHits));
      if (numberOfRightQuestHits === maxQuestHit) {
        console.log("done");
        setQuestResult(clickResults.Correct);
        const hitObject = hits;
        //console.log(someHit);
        if (
          !Object.keys(hits).includes(currentQuest) ||
          hits[currentQuest] === false
        ) {
          hitObject[currentQuest] = true;
        }

        console.log(hitObject[currentQuest]);
        setHits(hitObject);
      } else setQuestResult(clickResults.Incorrect);
    } else {
      setShouldDisplayMenu(false);

      //setClickNumber(clickNumber + 1);
    }
    console.log("questResult " + questResult);
    //console.log([xPositionOnImage, yPositionOnImage]);
    const newIndicator = {
      x,
      y,
      clickNumber,
      display: "inline",
    };
    setIndicators([...prevIndicator, newIndicator]);
    console.log("indicators " + JSON.stringify(indicators));

    console.log("questHits" + JSON.stringify(questHits));
    console.log("clickNumber " + clickNumber);
    //console.log(clickResult);
    if (clickNumber >= maxQuestHit) {
      console.log("rince");
      setQuestHits([]);
      setClickNumber(1);
    }
  };
  const computeXPositionOnImage = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const cw = e.target.clientWidth;
    const iw = e.target.naturalWidth;
    const screenWidth = window.innerWidth;
    setMenuX(x);
    setLastClickX(x - 8);
    setClickCloseRight(screenWidth - x <= 150);
    return (x / cw) * iw;
  };
  const computeYPositionOnImage = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const y = e.clientY - bounds.top;
    const ch = e.target.clientHeight;
    const ih = e.target.naturalHeight;
    const screenHeight = window.innerHeight;
    setMenuY(y);
    setLastClickY(y - 8);
    console.log(screenHeight - y);
    setClickCloseBottom(screenHeight - y <= 150);
    return (y / ch) * ih;
  };
  const handleImageClick = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const xPositionOnImage = Math.floor(computeXPositionOnImage(e));
    const yPositionOnImage = Math.floor(computeYPositionOnImage(e));
    setShowHint(false);
    console.log([xPositionOnImage, yPositionOnImage]);
    let target = e.target;
    let isInsideSelectionMenu = false;

    while (target) {
      if (target.classList.contains("selection-menu")) {
        isInsideSelectionMenu = true;
        break;
      }
      target = target.parentElement;
    }
    setShowHitTarget(true);
    if (!isInsideSelectionMenu) {
      evaluateMultipleTargetHit(
        e.clientX - bounds.left,
        e.clientY - bounds.top,
        xPositionOnImage,
        yPositionOnImage
      );
    } else {
      console.log(isInsideSelectionMenu);
      setShouldDisplayMenu(false);
      setShowHitTarget(false);
    }
    evaluateEndOfGame();
  };
  // Helper function to generate hashed asset paths
  const getHashedAssetPath = (filename) => {
    const hashedFilename = require(`../assets/${filename}.jpg`);
    return hashedFilename; // In case you're using ES modules
  };
  const getImageSource = (currentquest) => {
    //console.log("getImageSource " + workingQuests);
    //console.log("workingQuests[currentQuest] " + currentquest);
    //console.log("gameMode " + gameMode);
    //console.log(workingQuests);
    if (
      typeof workingQuests !== "undefined" &&
      typeof workingQuests[currentquest] !== "undefined" &&
      typeof workingQuests[currentquest].image === "undefined"
    ) {
      {
        //console.log("ici");
        const image = new Image();

        const hashedImagePath = getHashedAssetPath(`level-${level}`);

        image.src = hashedImagePath;
        image.onload = () => {
          setScaledWidth(image.naturalWidth * (zoomLevel / 100));
          setScaledHeight(image.naturalHeight * (zoomLevel / 100));
        };
        toggleCenteringClass();
        setImageSource(hashedImagePath);
      }
    } else if (
      typeof workingQuests !== "undefined" &&
      typeof workingQuests[currentquest] !== "undefined" &&
      typeof workingQuests[currentquest].image !== "undefined"
    ) {
      {
        //console.log("la");
        const image = new Image();
        const hashedImagePath = getHashedAssetPath(
          `${workingQuests[currentquest].image}`
        );
        image.src = hashedImagePath;

        image.onload = () => {
          setScaledWidth(image.naturalWidth * (zoomLevel / 100));
          setScaledHeight(image.naturalHeight * (zoomLevel / 100));
        };
        toggleCenteringClass();
        setImageSource(hashedImagePath);
      }
    } else {
      console.log("nothing"); // or provide a default image source
    }
  };

  return (
    <div
      className="game-container"
      onClick={(e) => {
        if (!(e.target.tagName === "IMG")) {
          setShouldDisplayMenu(false);
          setShowHitTarget(false);
          setShowHint(false);
        }
      }}
    >
      {showErrorModal && <ErrorModalWindow errorMessage={criticalError} />}
      {levelData &&
        typeof currentQuest !== "undefined" &&
        !isNaN(currentQuest) &&
        workingQuests[currentQuest] && (
          <HintPop
            x={menuX}
            y={window.innerWidth > 768 ? menuY + 120 : menuY + 130}
            shouldDisplay={showHint}
            content={
              typeof workingQuests[currentQuest].quest !== "undefined"
                ? t(
                    `${translationSpace}.${workingQuests[currentQuest].quest}.hint`
                  )
                : "No hints"
            }
          />
        )}

      <div
        ref={descriptionRef}
        className={`level-description ${descriptionIsSticky ? "sticky" : ""} ${
          minimalMode ? "minimal" : ""
        }`}
      >
        <div className="column">
          {" "}
          {levelData &&
            typeof currentQuest !== "undefined" &&
            !isNaN(currentQuest) &&
            workingQuests[currentQuest] && (
              <p
                className={`question ${showRedQuestion ? "red-question" : ""}`}
              >
                {t("quest") +
                  ` ${!gameEnded ? numberOfRightHits + 1 : numberOfRightHits}` +
                  "/" +
                  `${gameMode !== GAME_MODE_10_QUESTS ? questCount : 10}` +
                  " " +
                  t(
                    `${translationSpace}.${workingQuests[currentQuest].quest}.title`
                  )}
              </p>
            )}
          <GameCommandIcons
            handleZoomIn={handleZoomIn}
            handleZoomOut={handleZoomOut}
            handleHint={handleHint}
            skipQuestion={skipQuestion}
          />
          <div className="timer">{currentTime}s</div>
        </div>
        <div className="divider"></div> {/* Empty divider */}
        <div className="column"></div>
      </div>

      <div className="game" onClick={handleImageClick}>
        {showHitTarget &&
          indicators.map((indicator, index) => (
            <div
              key={index}
              className="circular-indicator"
              style={{
                position: "absolute",
                left: `${indicator.x}px`,
                top: `${indicator.y}px`,
                backgroundColor:
                  questResult === clickResults.Pending
                    ? "rgba(70, 70, 70, 0.4)"
                    : questResult === clickResults.Incorrect
                    ? "rgba(255, 0, 0, 0.2)"
                    : "rgba(0, 255, 0, 0.2)",
                border:
                  questResult === clickResults.Pending
                    ? "2px dashed black"
                    : questResult === clickResults.Incorrect
                    ? "2px dashed red"
                    : "2px dashed green",
              }}
            >
              {maxQuestHit > 1 && indicator.clickNumber}
            </div>
          ))}
        <SelectionMenu
          x={clickCloseRight ? menuX - 100 : menuX}
          y={clickCloseBottom ? menuY - 120 : menuY}
          shouldDisplay={shouldDisplayMenu}
          questResult={questResult}
        />

        <UserForm
          shouldDisplay={shouldDisplayForm}
          time={endTime}
          submitScore={submitScore}
          handleInput={handleUserNameInput}
          handleEmailInput={handleEmailInput}
          handleFeedbackInput={handleFeedbackInput}
          showErrorMessage={showErrorMessage}
          numberOfRightHits={numberOfRightHits}
          gameMode={gameMode}
          player={player}
          isContestOfTheWeek={isContestOfTheWeek}
        />
        {loading && <LoadingSpinner />}
        <img
          id="levelImage"
          src={`${imageSource}`}
          alt={`Level ${level}`}
          width={scaledWidth}
          height={scaledHeight}
          onLoad={onLevelImageLoad}
        />
      </div>
    </div>
  );
};

export default GameLevel;

/*  <Link to="/waldo">
          <button className="back">Return Home</button>
        </Link>
        
        console.log("hits" + JSON.stringify(hits));
        console.log("Object.keys(hits).length !== 0 " +Object.keys(hits).length !== 0);
        console.log("Object.keys(hits).includes(newQuest) " + Object.keys(hits).includes(newQuest));
        console.log("hits[newQuest] " + hits[newQuest]);
        console.log("new quest " + newQuest);
                levelData.quests[currentQuest].positions.forEach((position) => {
         console.log(position);
          clickResult = clickResult || isClickWithinElement(
            position.top,
            position.bottom,
            xPositionOnImage,
            yPositionOnImage
          );
        });
        */
