import { Link } from "react-router-dom";
import "../styles/userForm.css";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("menu");
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
            {t("UserFormTitle1Part1")}
            {time}
            {t("UserFormTitle1Part2")}
            {numberOfRightHits}
          </h3>
        ) : (
          <h3>
            {t("UserFormTitle2Part1")}
            {numberOfRightHits} {t("UserFormTitle2Part2")}
          </h3>
        )}

        <form>
          <div className="input-section">
            <p>{t("UserFormScoreDescription")}</p>
            <label htmlFor="username">Username</label>
            <input
              name="username"
              value={userName}
              onInput={handleInput}
              className={showErrorMessage ? "error" : ""}
            />
            <div style={{ padding: "10px 0" }}>
              <label htmlFor="feedback to Nayth">
                {t("UserFormScoreFeedbackDescription")}
              </label>
              <textarea
                name={t("UserFormScoreFeedbackDescription")}
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
