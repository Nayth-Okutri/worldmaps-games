import "../styles/selectionMenu.css";
import { useTranslation } from "react-i18next";

const GameCommandIcons = ({
  handleZoomIn,
  handleZoomOut,
  handleHint,
  skipQuestion,
}) => {
  const { t } = useTranslation("gamequests");

  return (
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
          title={t("hint")} // Add a tooltip description
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
          title={t("skip")} // Add a tooltip description
          onMouseOver={(e) => {
            e.target.style.opacity = 0.7; // Change opacity on hover
          }}
          onMouseOut={(e) => {
            e.target.style.opacity = 1; // Restore opacity when not hovering
          }}
        />
      </span>
    </div>
  );
};

export default GameCommandIcons;
