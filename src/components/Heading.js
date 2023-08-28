import { Link } from "react-router-dom";
import "../styles/heading.css";

const Heading = () => {
  return (
    <div className="heading">
      <div className="logo-container">
        <img src={require("../assets/Logo.png")} alt="Logo" />{" "}
        <div className="title">
          <Link to="/worldmaps">Worldmaps</Link>
          <div className="stroke"></div>
          <p>Nayth quizz game</p>
        </div>
      </div>
      <div className="divider"></div> {/* Empty divider */}
      <div className="Header-Link">
        <a
          href="https://www.instagram.com/n.a.y.t.h/"
          className="external-link"
        >
          INSTAGRAM
        </a>
      </div>
      <div className="Header-Link">
        <a href="https://nayth.art/shop/" className="external-link">
          SHOP
        </a>
      </div>
      <div className="Header-Link">
        <Link to="/worldmaps/leaderboard">RANKING</Link>
      </div>
    </div>
  );
};

export default Heading;
