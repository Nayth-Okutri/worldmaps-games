import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../App";

import "../styles/AuthForm.css"; // Import the shared styles
import "../styles/RegistrationModal.css"; // Import the modal styles
const Registration = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = async () => {
    try {
      console.log(email);
      console.log(password);
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
        }
      );
      // Handle successful registration
    } catch (error) {
      // Handle registration error
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

export default Registration;
