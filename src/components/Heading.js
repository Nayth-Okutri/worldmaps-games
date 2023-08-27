import { Link } from "react-router-dom";
import "../styles/heading.css";

const Heading = () => {
  return (
    <div className="heading">
      <div className="title">
        <Link to="/worldmaps">
          <img src={require("../assets/GameTitle.png")} alt="Worldmaps" />
        </Link>
      </div>
    </div>
  );
};

export default Heading;
