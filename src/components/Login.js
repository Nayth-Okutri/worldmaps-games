import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../App";
import "../styles/RegistrationModal.css"; // Import the modal styles
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then((data) => {
        refreshToken = data.user.refreshToken;
        return data.user.getIdToken();
      });
    } catch (error) {
      // Handle login error
    }
  };

  return (
    <div className="registration-modal">
      <div className="modal-content">
        <h2>Register</h2>
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
        <button onClick={handleRegistration}>Register</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Login;
