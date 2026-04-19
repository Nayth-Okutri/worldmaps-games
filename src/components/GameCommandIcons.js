import React from "react";
import { ZoomIn, ZoomOut, Lightbulb, SkipForward } from "lucide-react";
import "../styles/GameCommands.css";

const GameCommandIcons = ({
  handleZoomIn,
  handleZoomOut,
  handleHint,
  skipQuestion,
  minimalMode,
}) => {
  return (
    <div className="game-commands-wrapper">
      <button className="command-btn" onClick={handleZoomIn} title="Zoom In">
        <ZoomIn size={20} />
      </button>

      <button className="command-btn" onClick={handleZoomOut} title="Zoom Out">
        <ZoomOut size={20} />
      </button>

      {!minimalMode && (
        <>
          <button
            className="command-btn hint"
            onClick={handleHint}
            title="Hint"
          >
            <Lightbulb size={20} />
          </button>
          <button
            className="command-btn skip"
            onClick={skipQuestion}
            title="Skip"
          >
            <SkipForward size={20} />
          </button>
        </>
      )}
    </div>
  );
};

export default GameCommandIcons;
