import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";
import LevelsDisplay from "./LevelsDisplay";

const Home = ({ levelsData }) => {
  let navigate = useNavigate();

  const levelClick = (level) => {
    navigate(`/worldmaps/game/${level}`);
  };

  return (
    <div className="home">
      <LevelsDisplay levelsData={levelsData} clickFunction={levelClick} />
    </div>
  );
};

export default Home;
