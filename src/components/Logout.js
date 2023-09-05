import { auth } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../userContext";
const Logout = () => {
  const { player, setPlayer } = useUser();
  let navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await auth.signOut().then(() => {
        setPlayer(null);
        navigate(`/worldmaps/`);
      });
      // Add any additional logout actions or redirects as needed
    } catch (error) {}
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img
        style={{
          height: "25px",
          cursor: "pointer",
          transition: "opacity 0.3s",
        }}
        src={require("../assets/LogoutIcon.png")}
        alt="Logout"
        onClick={handleLogout}
        title="Logout" // Add a tooltip description
      />
    </div>
  );
};

export default Logout;
