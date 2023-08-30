import { useState, useRef, useEffect } from "react";
import "../styles/gamelevel.css";
import SelectionMenu from "./SelectionMenu";
import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import UserForm from "./UserForm";
import HintPop from "./HintPop";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
  TIMEATTACK_TIME,
} from "./Constants";
const GameLevel = ({
  levelsData,
  isNameInLeaderboardRepeated,
  updateLeaderboardData,
  weekOfYear,
}) => {
  const level = +useParams().level;
  const levelData = levelsData.filter((value) => value.level === level)[0];

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
  const [questResult, setQuestResult] = useState(false);
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
  const [timerStarted, setTimerStarted] = useState(false);
  const [workingQuests, setWorkingQuests] = useState([]);
  const [descriptionIsSticky, setDescriptionIsSticky] = useState(false);
  const descriptionRef = useRef();
  useEffect(() => {
    const cachedRef = descriptionRef.current;
    const queryParams = new URLSearchParams(window.location.search);
    const modeParam = parseInt(queryParams.get("mode"));
    setGameMode(modeParam); // This will set the value of the 'mode' parameter
    if (isNaN(modeParam)) setGameMode(GAME_MODE_10_QUESTS);
    const observer = new IntersectionObserver(
      ([e]) => setDescriptionIsSticky(e.intersectionRatio < 1),
      {
        threshold: [1],
      }
    );

    observer.observe(cachedRef);
    const image = document.getElementById("levelImage");
    const container = document.querySelector(".game-container");

    const toggleCenteringClass = () => {
      if (image && container) {
        const isImageWiderThanViewport = image.clientWidth > window.innerWidth;
        //console.log(image.naturalWidth);
        //console.log(window.innerWidth);
        //console.log("isImageTallerThanViewport " + isImageWiderThanViewport);
        if (isImageWiderThanViewport) {
          container.classList.remove("center-only-when-fit");
        } else {
          container.classList.add("center-only-when-fit");
        }
      }
    };
    if (!timerStarted) setZoomLevel(window.innerWidth > 768 ? 70 : 60);
    setScaledWidth(image.naturalWidth * (zoomLevel / 100));
    setScaledHeight(image.naturalHeight * (zoomLevel / 100));

    toggleCenteringClass();
    window.addEventListener("resize", toggleCenteringClass);

    switch (gameMode) {
      case GAME_MODE_DUPLICATE:
        if (levelData) {
          let duplicateQuests;
          //console.log("levelData " + JSON.stringify(levelData.quests));
          if (questCount === 0) {
            duplicateQuests = levelData.quests.filter(
              (quest) => quest.type === 1
            );

            setWorkingQuests(duplicateQuests);
            const duplicateQuestCount = Object.keys(duplicateQuests).length;
            console.log("duplicateQuestCount " + duplicateQuestCount);

            if (duplicateQuestCount === 0) endGame();
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
        if (levelData) {
          let regularQuests;

          if (!timerStarted) {
            regularQuests = levelData.quests.filter(
              (quest) => typeof quest.type === "undefined" || quest.type !== 1
            );
            setWorkingQuests(regularQuests);
          }
          const currentQuestCount = Object.keys(workingQuests).length;
          setQuestCount(currentQuestCount);
          console.log("currentQuestCount " + currentQuestCount);
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
            setQuestHits([]);
            setCurrentQuest(newQuest);
            getImageSource(newQuest);
            console.log("newQuest " + newQuest);
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
      default:
    }

    switch (gameMode) {
      case GAME_MODE_DUPLICATE:
      case GAME_MODE_10_QUESTS:
      case GAME_MODE_ALLQUESTS:
        if (!gameEnded) {
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
          setTimerStarted(true);
          const initialTime = TIMEATTACK_TIME; // 1 minute in seconds
          if (!timerStarted) setCurrentTime(initialTime);

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
          console.log("currentTime " + currentTime);

          return () => clearInterval(interval);
        }
        break;
      case GAME_MODE_DUPLICATE:
        // Handle timer behavior for game mode 1
        break;
      default:
        break;
    }

    return () => {
      observer.unobserve(cachedRef);

      window.removeEventListener("resize", toggleCenteringClass);
    };
  }, [
    levelData,
    hits,
    currentQuest,
    questCount,
    gameEnded,
    numberOfRightHits,
    indicators,
    zoomLevel,
    gameMode,
    workingQuests,
    scaledWidth,
  ]);
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

    console.log(x);
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
      if (isNameInLeaderboardRepeated(newUserName, level)) {
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
  const saveScore = async (name, time) => {
    try {
      if (numberOfRightHits >= 1) {
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
        await addDoc(scoresCollectionRef, {
          name: name,
          feedback: feedback,
          time: reccordedTime,
          gameMode: gameMode,
          score: numberOfRightHits,
          level: level,
          date: new Date(),
        });
      }
    } catch (error) {
      console.error("Error writing new score to Firebase Database", error);
    }
  };

  const endGame = () => {
    setGameEnded(true);
    setEndTime((Date.now() - startTime.current) / 1000); // To milliseconds to seconds
    setShouldDisplayForm(true);
  };

  const submitScore = (event) => {
    event.preventDefault();
    if (userName) {
      let reccordedTime;
      if (gameMode !== GAME_MODE_TIMEATTACK) reccordedTime = endTime;
      else reccordedTime = currentTime;
      saveScore(userName, reccordedTime);
      updateLeaderboardData();
      navigate(`/worldmaps/leaderboard/${level}`);
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
    setNumberOfRightHits(numberOfRightQuestHits);
    switch (gameMode) {
      case GAME_MODE_10_QUESTS:
        if (numberOfRightQuestHits === 10) {
          endGame();
        }
        break;
      case GAME_MODE_DUPLICATE:
      case GAME_MODE_ALLQUESTS:
        if (numberOfRightQuestHits === Object.keys(workingQuests).length) {
          endGame();
        }
        break;
      case GAME_MODE_TIMEATTACK:
        if (currentTime <= 0) endGame();
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
    const prevIndicator = clickNumber === 1 ? [] : indicators;
    if (clickNumber === 1) {
      setIndicators([]);
      //console.log("indicators " + JSON.stringify(indicators));
    }
    setClickNumber(clickNumber + 1);
    for (let i = 0; i < maxQuestHit; i++) {
      if (
        isClickWithinElement(
          workingQuests[currentQuest].positions[i].top,
          workingQuests[currentQuest].positions[i].bottom,
          xPositionOnImage,
          yPositionOnImage
        )
      ) {
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
      if (numberOfRightQuestHits === maxQuestHit) {
        console.log("done");
        setQuestResult(true);
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
      } else setQuestResult(false);
    } else {
      setShouldDisplayMenu(false);

      //setClickNumber(clickNumber + 1);
    }

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
    console.log(filename);
    //const hashedFilename = require(`../assets/level-${level}.jpg`);
    const hashedFilename = require(`../assets/${filename}.jpg`);
    return hashedFilename; // In case you're using ES modules
  };
  const getImageSource = (currentquest) => {
    console.log("getImageSource " + workingQuests);
    console.log("workingQuests[currentQuest] " + currentquest);
    console.log("gameMode " + gameMode);
    console.log(workingQuests);
    if (
      typeof workingQuests !== "undefined" &&
      typeof workingQuests[currentquest] !== "undefined" &&
      gameMode !== GAME_MODE_DUPLICATE
    ) {
      {
        console.log("ici");
        const image = new Image();

        const hashedImagePath = getHashedAssetPath(`level-${level}`);
        console.log("hashedImagePath " + hashedImagePath);
        image.src = hashedImagePath;
        image.onload = () => {
          console.log("image.naturalWidth " + image.naturalWidth);
          setScaledWidth(image.naturalWidth * (zoomLevel / 100));
          setScaledHeight(image.naturalHeight * (zoomLevel / 100));
        };

        setImageSource(hashedImagePath);
      }
    } else if (
      typeof workingQuests !== "undefined" &&
      typeof workingQuests[currentquest] !== "undefined" &&
      typeof workingQuests[currentquest].image !== "undefined"
    ) {
      {
        console.log("la");
        const image = new Image();
        const hashedImagePath = getHashedAssetPath(
          `${workingQuests[currentquest].image}`
        );
        image.src = hashedImagePath;
        console.log("image " + image.naturalWidth);
        console.log("hashedImagePath " + hashedImagePath);
        image.onload = () => {
          console.log("image.naturalWidth" + image.naturalWidth);
          setScaledWidth(image.naturalWidth * (zoomLevel / 100));
          setScaledHeight(image.naturalHeight * (zoomLevel / 100));
        };
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
      {" "}
      {levelData &&
        typeof currentQuest !== "undefined" &&
        !isNaN(currentQuest) &&
        workingQuests[currentQuest] && (
          <HintPop
            x={menuX}
            y={window.innerWidth > 768 ? menuY + 120 : menuY + 130}
            shouldDisplay={showHint}
            content={
              typeof workingQuests[currentQuest].hint !== "undefined"
                ? workingQuests[currentQuest].hint
                : "No hints"
            }
          />
        )}
      <div
        ref={descriptionRef}
        className={`level-description ${descriptionIsSticky ? "sticky" : ""}`}
      >
        <div className="column">
          {levelData &&
            typeof currentQuest !== "undefined" &&
            !isNaN(currentQuest) &&
            workingQuests[currentQuest] && (
              <p
                className={`question ${showRedQuestion ? "red-question" : ""}`}
              >
                {`quest ${
                  !gameEnded ? numberOfRightHits + 1 : numberOfRightHits
                }` +
                  "/" +
                  `${gameMode !== GAME_MODE_10_QUESTS ? questCount : 10}` +
                  " " +
                  workingQuests[currentQuest].question}
              </p>
            )}
          <div>
            <span style={{ paddingRight: "10px" }}>
              <img
                style={{
                  height: "20px",
                  cursor: "pointer",
                  transition: "opacity 0.3s",
                }}
                src={require("../assets/ZoomInIcon.png")}
                alt="ZoomIn"
                onClick={handleZoomIn}
                title="ZoomIn" // Add a tooltip description
                onMouseOver={(e) => {
                  e.target.style.opacity = 0.7; // Change opacity on hover
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = 1; // Restore opacity when not hovering
                }}
              />
            </span>
            <span style={{ paddingRight: "10px" }}>
              <img
                style={{
                  height: "20px",
                  cursor: "pointer",
                  transition: "opacity 0.3s",
                }}
                src={require("../assets/ZoomOutIcon.png")}
                alt="ZoomOut"
                onClick={handleZoomOut}
                title="ZoomOut" // Add a tooltip description
                onMouseOver={(e) => {
                  e.target.style.opacity = 0.7; // Change opacity on hover
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = 1; // Restore opacity when not hovering
                }}
              />
            </span>
            <span style={{ paddingRight: "10px" }}>
              <img
                style={{
                  height: "20px",
                  cursor: "pointer",
                  transition: "opacity 0.3s",
                }}
                src={require("../assets/HintIcon.png")}
                alt="Hint"
                onClick={handleHint}
                title="Hint" // Add a tooltip description
                onMouseOver={(e) => {
                  e.target.style.opacity = 0.7; // Change opacity on hover
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = 1; // Restore opacity when not hovering
                }}
              />
            </span>
            <span style={{ paddingRight: "10px" }}>
              <img
                style={{
                  height: "20px",
                  cursor: "pointer",
                  transition: "opacity 0.3s",
                }}
                src={require("../assets/SkipIcon.png")}
                alt="Skip"
                onClick={skipQuestion}
                title="Skip this question" // Add a tooltip description
                onMouseOver={(e) => {
                  e.target.style.opacity = 0.7; // Change opacity on hover
                }}
                onMouseOut={(e) => {
                  e.target.style.opacity = 1; // Restore opacity when not hovering
                }}
              />
            </span>
          </div>
        </div>
        <div className="divider"></div> {/* Empty divider */}
        <div className="column">
          <div className="timer">{currentTime}s</div>
        </div>
      </div>
      <div className="game" onClick={handleImageClick}>
        {maxQuestHit === 1 && indicators.length > 0 && showHitTarget && (
          <div
            style={{
              position: "absolute",
              left: `${indicators[0].x - 20}px`,
              top: `${indicators[0].y - 20}px`,
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: questResult
                ? "rgba(0, 0, 255, 0.2)"
                : "rgba(255, 0, 0, 0.2)",
              border: questResult ? "2px dashed blue" : "2px dashed red",
            }}
          ></div>
        )}

        {maxQuestHit > 1 &&
          showHitTarget &&
          indicators.map((indicator, index) => (
            <div
              key={index}
              className="circular-indicator"
              style={{
                position: "absolute",
                left: `${indicator.x}px`,
                top: `${indicator.y}px`,
              }}
            >
              {indicator.clickNumber}
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
          handleFeedbackInput={handleFeedbackInput}
          showErrorMessage={showErrorMessage}
          numberOfRightHits={numberOfRightHits}
          gameMode={gameMode}
        />
        <img
          id="levelImage"
          src={`${imageSource}`}
          alt={`Level ${level}`}
          width={scaledWidth}
          height={scaledHeight}
        />
      </div>
    </div>
  );
};
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
export default GameLevel;
