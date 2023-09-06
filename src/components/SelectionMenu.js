import "../styles/selectionMenu.css";
import { clickResults } from "./Constants";
import { useTranslation } from "react-i18next";

const SelectionMenu = ({ x, y, shouldDisplay, questResult }) => {
  const { t } = useTranslation("menu");
  const positionStyle = {
    top: y + 15,
    left: x + 15,
  };

  if (!shouldDisplay) positionStyle["display"] = "none";
  //console.log("questResult " + questResult);
  const imgSource =
    questResult === clickResults.Correct ? "Okdesu.png" : "NOkdesu.png";

  return (
    <div className="selection-menu" style={positionStyle}>
      <img
        src={require(`../assets/${imgSource}`)}
        alt={
          questResult === clickResults.Correct ? t("OKResult") : t("NOKResult")
        }
      />
      <p>
        {questResult === clickResults.Correct ? t("OKResult") : t("NOKResult")}
      </p>
    </div>
  );
};

export default SelectionMenu;

/* {Object.keys(levelData.positions).map((character) => {
          return (
            <div
              onClick={(e) => {
                handleSelection(e, character);
              }}
              key={character}
              className={hits[character] ? "disabled" : ""}
            >
              <img
                src={require(`../assets/${character}.jpg`)}
                alt={character}
              />
              {character[0].toUpperCase() + character.substring(1)}
            </div>
          );
        })} */
