import "../styles/selectionMenu.css";

const SelectionMenu = ({ x, y, shouldDisplay, questResult }) => {
  const positionStyle = {
    top: y + 15,
    left: x + 15,
  };

  if (!shouldDisplay) positionStyle["display"] = "none";

  return (
    <div className="selection-menu" style={positionStyle}>
      <img
        src={require(questResult
          ? "../assets/Okdesu.png"
          : "../assets/NOkdesu.png")}
        alt={questResult ? "Correct answer" : "Incorrect answer"}
      />
      <p>{questResult ? "Correct answer" : "Incorrect answer"}</p>
    </div>
  );
};

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
export default SelectionMenu;
