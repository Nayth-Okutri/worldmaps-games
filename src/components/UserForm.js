import { Link } from "react-router-dom";
import "../styles/userForm.css";
import {
  GAME_MODE_DUPLICATE,
  GAME_MODE_10_QUESTS,
  GAME_MODE_TIMEATTACK,
  GAME_MODE_ALLQUESTS,
} from "./Constants";
const UserForm = ({
  shouldDisplay,
  time,
  submitScore,
  handleInput,
  userName,
  feedback,
  handleFeedbackInput,
  showErrorMessage = false,
  numberOfRightHits,
  gameMode,
}) => {
  const positionStyle = {};
  if (!shouldDisplay) positionStyle["display"] = "none";

  return (
    <div
      className="overlay"
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={positionStyle}
    >
      <div className="user-form">
        {gameMode !== GAME_MODE_TIMEATTACK ? (
          <h3>
            You finished in {time} seconds with a score {numberOfRightHits}
          </h3>
        ) : (
          <h3>You got {numberOfRightHits} answers!</h3>
        )}

        <form>
          <div className="input-section">
            <p>Enter your name to save your score on the global leaderboard.</p>
            <label htmlFor="username">Username</label>
            <input
              name="username"
              value={userName}
              onInput={handleInput}
              className={showErrorMessage ? "error" : ""}
            />
            <div style={{ padding: "10px 0" }}>
              <label htmlFor="feedback to Nayth">Feedback to Nayth</label>
              <textarea
                name="feedback to Nayth"
                value={feedback}
                onChange={handleFeedbackInput}
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  overflowY: "auto", // Add vertical scroll
                }}
              />
            </div>
            <span
              className={"error-message" + (showErrorMessage ? "" : " hide")}
            >
              Use another username
            </span>
          </div>
          <div className="button-section">
            <Link to="/worldmaps">
              <button type="button" className="cancel">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="submit"
              onClick={(e) => {
                submitScore(e);
              }}
            >
              Submit Score
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
