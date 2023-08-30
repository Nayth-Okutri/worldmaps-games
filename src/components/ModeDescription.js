import "../styles/ModeDescription.css";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
} from "./Constants";
import { Link } from "react-router-dom";
import { useEffect } from "react";
const ModeDescription = ({ level, gameMode }) => {
  useEffect(() => {
    console.log("gameMode updated:", gameMode);
  }, [level, gameMode]);

  return (
    <div>
      {gameMode === GAME_MODE_DUPLICATE && (
        <div className="mode-description">
          <p>
            Duplicate Hunt. Find duplicate in an image filled with various
            objects, characters, or elements.
          </p>
        </div>
      )}
      {gameMode === GAME_MODE_10_QUESTS && (
        <div className="mode-description">
          <p>
            10 Random Questions. Put your Geek knowledge to the test and locate
            the elements that match the given questions.
          </p>
        </div>
      )}
      {gameMode === GAME_MODE_TIMEATTACK && (
        <div className="mode-description">
          <p>
            Time Attack. Take on the clock and respond to as many questions as
            you can within a single minute.
          </p>
        </div>
      )}
      {gameMode === GAME_MODE_ALLQUESTS && (
        <div className="mode-description">
          <p>
            Otaku Mastery. Demonstrate your expertise by swiftly answering all
            the questions from the deck.
          </p>
        </div>
      )}
      {level && gameMode ? (
        <Link to={`/worldmaps/game/${level}?mode=${gameMode}`}>
          <button className="play">Play This Level</button>
        </Link>
      ) : (
        <button className="play" disabled>
          Select a Game Mode
        </button>
      )}
    </div>
  );
};

export default ModeDescription;
