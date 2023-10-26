import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/userForm.css";
import { useTranslation } from "react-i18next";
import { GAME_MODE_TIMEATTACK } from "./Constants";
const UserForm = ({
  shouldDisplay,
  time,
  submitScore,
  handleInput,
  userName,
  feedback,
  handleEmailInput,
  handleFeedbackInput,
  showErrorMessage = false,
  numberOfRightHits,
  gameMode,
  player,
  isContestOfTheWeek,
}) => {
  const { t } = useTranslation("menu");

  const [error, setError] = useState(null);
  const positionStyle = {};
  const [email, setEmail] = useState("");
  const handleForm = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      submitScore(e);
    }
  };
  if (!shouldDisplay) positionStyle["display"] = "none";
  const validateForm = () => {
    // Validate the email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError(t("error.EmailNotValid"));
      return false;
    }

    setError("");
    return true;
  };
  return (
    <div
      className="overlay"
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={positionStyle}
    >
      {isContestOfTheWeek === false ? (
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
              {player ? (
                <h2>{player.userName}</h2>
              ) : (
                <input
                  name="username"
                  value={userName}
                  onInput={handleInput}
                  className={showErrorMessage ? "error" : ""}
                />
              )}

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
                  handleForm(e);
                }}
              >
                Submit Score
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="user-form">
          {" "}
          <h3>{t("WeeklyContestTitle")}</h3>
          <form>
            <div className="input-section">
              <p>{t("UserFormScoreDescription")}</p>
              <label htmlFor="username">Username</label>
              {player ? (
                <h2>{player.userName}</h2>
              ) : (
                <input
                  name="username"
                  value={userName}
                  onInput={handleInput}
                  className={showErrorMessage ? "error" : ""}
                />
              )}

              <input
                type="email"
                placeholder="Email"
                onInput={handleEmailInput}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="error-message">{error}</p>}
            </div>
            <div className="button-section">
              <Link to="/worldmaps">
                <button type="button" className="cancel">
                  Cancel
                </button>
              </Link>
              <button
                //type="submit"
                className="submit"
                onClick={(e) => {
                  handleForm(e);
                }}
              >
                Submit Score
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserForm;
