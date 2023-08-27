import { useState, useRef, useEffect } from "react";
import "../styles/gamelevel.css";
import SelectionMenu from "./SelectionMenu";
import { useParams, useNavigate } from "react-router-dom";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import UserForm from "./UserForm";

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
  const [useFormValidation, setUseFormValidation] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [currentQuest, setCurrentQuest] = useState();
  const [numberOfRightHits, setNumberOfRightHits] = useState(0);
  const [showHitTarget, setShowHitTarget] = useState(false);
  const [questCount, setQuestCount] = useState(0);

  const [maxQuestHit, setMaxQuestHit] = useState(0);
  const [questHits, setQuestHits] = useState([]);
  const [clickNumber, setClickNumber] = useState(1);
  const [questResult, setQuestResult] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [indicators, setIndicators] = useState([]);
  let navigate = useNavigate();

  const [descriptionIsSticky, setDescriptionIsSticky] = useState(false);
  const descriptionRef = useRef();
  useEffect(() => {
    const cachedRef = descriptionRef.current;

    const observer = new IntersectionObserver(
      ([e]) => setDescriptionIsSticky(e.intersectionRatio < 1),
      {
        threshold: [1],
      }
    );

    observer.observe(cachedRef);

    if (levelData) {
      const currentQuestCount = Object.keys(levelData.quests).length;
      setQuestCount(currentQuestCount);
      if (
        currentQuestCount > 0 &&
        (typeof currentQuest === "undefined" || hits[currentQuest] === true) &&
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
      }
    }
    if (levelData && levelData.quests[currentQuest]) {
      setMaxQuestHit(
        Object.keys(levelData.quests[currentQuest].positions).length
      );
    }
    const interval = setInterval(() => {
      setCurrentTime(
        (Math.floor(Date.now() - startTime.current) / 1000).toFixed(1)
      );
    }, 1000);
    if (gameEnded) {
      clearInterval(interval);
    }
    return () => {
      observer.unobserve(cachedRef);
      clearInterval(interval); // Nettoyer l'intervalle lorsque le composant est démonté
    };
  }, [
    levelData,
    hits,
    currentQuest,
    questCount,
    gameEnded,
    numberOfRightHits,
    indicators,
  ]);

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

  const saveScore = async (name, time) => {
    try {
      const leaderboardCollectionRef = collection(
        getFirestore(),
        "leaderboard"
      );
      const scoresCollectionRef = collection(
        leaderboardCollectionRef,
        String(weekOfYear) + "/level" + String(level)
      );
      console.log("scoresCollectionRef " + scoresCollectionRef);
      await addDoc(scoresCollectionRef, {
        name: name,
        time: time,
        level: level,
        date: new Date(),
      });
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
    if (userName && !isNameInLeaderboardRepeated(userName, level)) {
      saveScore(userName, endTime);
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
    if (numberOfRightQuestHits === Object.keys(levelData.quests).length) {
      endGame();
    }
    console.log("numberOfRightHits " + numberOfRightQuestHits);
  };
  const skipQuestion = () => {
    let newQuest = Math.floor(Math.random() * questCount);
    setShouldDisplayMenu(false);
    setIndicators([]);
    if (Object.keys(hits).length !== 0) {
      do {
        newQuest = Math.floor(Math.random() * questCount);
      } while (Object.keys(hits).includes(newQuest) || hits[newQuest] === true);
    }
    setQuestHits([]);
    setCurrentQuest(newQuest);
  };
  const evaluateSingleTargetHit = (xPositionOnImage, yPositionOnImage) => {
    console.log("eval for " + levelData.quests[currentQuest].position.top.x);
    const hit = isClickWithinElement(
      levelData.quests[currentQuest].position.top,
      levelData.quests[currentQuest].position.bottom,
      xPositionOnImage,
      yPositionOnImage
    );
    setQuestResult(hit);

    if (!shouldDisplayMenu) setShouldDisplayMenu(true);
    const hitObject = hits;
    //console.log(someHit);
    if (
      !Object.keys(hits).includes(currentQuest) ||
      hits[currentQuest] === false
    ) {
      hitObject[currentQuest] = hit;
    }

    console.log(hitObject[currentQuest]);
    setHits(hitObject);
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
      console.log("indicators " + JSON.stringify(indicators));
    }
    setClickNumber(clickNumber + 1);
    for (let i = 0; i < maxQuestHit; i++) {
      if (
        isClickWithinElement(
          levelData.quests[currentQuest].positions[i].top,
          levelData.quests[currentQuest].positions[i].bottom,
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
  const computexPositionOnImage = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const cw = e.target.clientWidth;
    const iw = e.target.naturalWidth;
    setMenuX(x);
    setLastClickX(x - 8);
    return (x / cw) * iw;
  };
  const computeyPositionOnImage = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const y = e.clientY - bounds.top;
    const ch = e.target.clientHeight;
    const ih = e.target.naturalHeight;
    setMenuY(y);
    setLastClickY(y - 8);
    return (y / ch) * ih;
  };
  const handleImageClick = (e) => {
    const bounds = e.target.getBoundingClientRect();
    const xPositionOnImage = Math.floor(computexPositionOnImage(e));
    const yPositionOnImage = Math.floor(computeyPositionOnImage(e));

    console.log([xPositionOnImage, yPositionOnImage]);

    evaluateMultipleTargetHit(
      e.clientX - bounds.left,
      e.clientY - bounds.top,
      xPositionOnImage,
      yPositionOnImage
    );

    evaluateEndOfGame();
  };

  return (
    <div
      className="game-container"
      onClick={(e) => {
        if (!(e.target.tagName === "IMG")) {
          setShouldDisplayMenu(false);
        }
      }}
    >
      <div
        ref={descriptionRef}
        className={`level-description ${descriptionIsSticky ? "sticky" : ""}`}
      >
        <div className="column">
          {levelData &&
            typeof currentQuest !== "undefined" &&
            !isNaN(currentQuest) &&
            levelData.quests[currentQuest] && (
              <p className="question">
                {`quest ${
                  !gameEnded ? numberOfRightHits + 1 : numberOfRightHits
                }` +
                  "/" +
                  questCount +
                  " " +
                  levelData.quests[currentQuest].question}
              </p>
            )}
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
        </div>
        <div className="divider"></div> {/* Empty divider */}
        <div className="column">
          <div className="timer">{currentTime}s</div>
        </div>
      </div>
      <div className="game" onClick={handleImageClick}>
        {maxQuestHit === 1 && indicators.length > 0 && (
          <div
            style={{
              position: "absolute",
              left: `${indicators[0].x}px`,
              top: `${indicators[0].y}px`,
              width: "20px",
              height: "20px",
              backgroundColor: questResult
                ? "rgba(0, 0, 255, 0.2)"
                : "rgba(255, 0, 0, 0.2)",
              border: questResult ? "2px dashed blue" : "2px dashed red",
            }}
          ></div>
        )}

        {maxQuestHit > 1 &&
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
          x={menuX}
          y={menuY}
          shouldDisplay={shouldDisplayMenu}
          questResult={questResult}
        />
        <UserForm
          shouldDisplay={shouldDisplayForm}
          time={endTime}
          submitScore={submitScore}
          handleInput={handleUserNameInput}
          showErrorMessage={showErrorMessage}
        />
        <img
          src={require(`../assets/level-${level}.jpg`)}
          alt={`Level ${level}`}
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
