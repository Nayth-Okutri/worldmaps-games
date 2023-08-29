import "../styles/HintPop .css";

const HintPop = ({ x, y, shouldDisplay, content }) => {
  const hintClass = shouldDisplay ? "hint show" : "hint";

  const positionStyle = {
    top: y,
    left: x,
  };

  return (
    <div className={hintClass} style={positionStyle}>
      <p>{content}</p>
    </div>
  );
};
export default HintPop;
