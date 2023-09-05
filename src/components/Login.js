import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../App";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/RegistrationModal.css"; // Import the modal styles
import { useTranslation } from "react-i18next";
const Login = ({ onClose, onRegistration }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  let navigate = useNavigate();
  const { t } = useTranslation("menu");
  const validateForm = () => {
    // Validate the email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError(t("error.EmailNotValid"));
      return false;
    }

    // Validate the password (add your custom validation rules)
    if (password.length < 6) {
      setError(t("error.PassWordTooShort"));
      return false;
    }

    setError("");
    return true;
  };
  const handleLogin = async () => {
    if (validateForm()) {
      try {
        await signInWithEmailAndPassword(auth, email, password).then((data) => {
          const refreshToken = data.user.refreshToken;

          return data.user.getIdToken().then((idToken) => {
            navigate(`/worldmaps/profile`);
          });
        });
      } catch (error) {
        switch (error.code) {
          case "auth/wrong-password":
            setError("Wrong password");
            break;
          case "auth/user-not-found":
            setError("User not found");
            break;
          default:
            setError(error.message);
        }
      }
    }
  };

  return (
    <div className="registration-modal">
      <div className="modal-content">
        <h2>Login</h2>
        <div className="info-section">
          <p>{t("InfoNoticeLogin")}</p>
        </div>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={onRegistration}>Registration</button>
        <button onClick={handleLogin}>Login</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Login;
