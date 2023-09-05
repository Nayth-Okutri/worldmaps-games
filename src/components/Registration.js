import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../App";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import "../styles/RegistrationModal.css";
const Registration = ({ onClose }) => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null); // State variable to store the error message
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = getFirestore();
  const { t } = useTranslation("menu");

  const validateForm = () => {
    // Validate the email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError(t("error.EmailNotValid"));
      return false;
    }

    // Validate the username (add your custom validation rules)
    if (userName.length < 3) {
      setError(t("error.UserNameTooShort"));
      return false;
    }

    // Validate the password (add your custom validation rules)
    if (password.length < 6) {
      setError(t("error.PassWordTooShort"));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t("error.PasswordMustMatch"));
      return false;
    }
    setError("");
    return true;
  };
  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let token, userId;
    console.log(userName);
    const userDocRef = doc(db, `users/${userName}`);
    if (validateForm()) {
      try {
        console.log(email);
        console.log(password);
        await getDoc(userDocRef).then((doc) => {
          console.log(doc);
          console.log(doc.exists);
          if (doc.exists()) {
            setError(t("error.LoginUserAlreadyExists"));
            setIsSubmitting(false);
          } else {
            return createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                userId = userCredential.user.uid;
                console.log(user);
                return userCredential.user.getIdToken();
              })
              .then((idToken) => {
                token = idToken;
                const userCredentials = {
                  userName: userName,
                  email: email,
                  createdAt: new Date().toISOString(),
                  imageUrl: ``,
                  userId,
                };

                return setDoc(userDocRef, userCredentials);
              });
          }
        });

        // Handle successful registration
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setError(t("error.EmailAlreadyInUse"));
            break;
          default:
            setError(error.message);
        }
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-modal">
      <form onSubmit={handleRegistration}>
        <div className="modal-content">
          <h2>Register</h2>
          {error && <p className="error-message">{error}</p>}

          <input
            type="text"
            placeholder="UserName"
            onChange={(e) => setUserName(e.target.value)}
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" disabled={isSubmitting}>
            Register
          </button>

          <button onClick={onClose}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
