import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getFirestore,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import "../styles/PopupForm.css";
const PopupForm = () => {
  const [characters, setCharacters] = useState(Array(14).fill(""));
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);
  const [prevchar, setPrevchar] = useState("");
  const [inputValue, setInputValue] = useState("");
  const correctAnswer = [
    "o",
    "c",
    "c",
    "u",
    "r",
    "i",
    "a",
    "t",
    "r",
    "i",
    "g",
    "g",
    "e",
    "r",
  ];
  const db = getFirestore();
  const inputRefs = Array(16)
    .fill(null)
    .map(() => React.createRef());
  const validateForm = () => {
    // Validate the email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.log("email nok");
      setError("Email non valide");
      return false;
    }

    // Validate the password (add your custom validation rules)
    console.log("email ok");
    setError("");
    return true;
  };
  const handleKeyDown = (index, value, e) => {
    const validAlpha = /^[A-Za-z]$/;
    console.log("characters[index] " + characters[index]);
    console.log("prevchar " + prevchar);
    const updatedCharacters = [...characters];
    if (characters[index] !== null && characters[index] === prevchar)
      console.log("_______________handleKeyDown");
    if (e.key === "Backspace" && index > 0) {
      updatedCharacters[index] = "";
      setCharacters(updatedCharacters);
      inputRefs[index - 1].current.focus();
    } else if (e.key.match(validAlpha)) {
      updatedCharacters[index] = e.key;
      setCharacters(updatedCharacters);
      if (e.key.length > 0 && index < inputRefs.length - 1) {
        console.log(inputRefs[index + 1].current);
        inputRefs[index + 1].current.focus();
      }
    }
  };
  const handleChange = (index, value, e) => {
    const updatedCharacters = [...characters];
    //updatedCharacters[index] = "";
    //setCharacters(updatedCharacters);
    const validAlpha = /^[A-Za-z]$/;
    console.log(e.nativeEvent.data);
    console.log(e.nativeEvent.inputType);
    //setError(e.nativeEvent.data);
    //setError(JSON.stringify(e));
    if (e.nativeEvent.data !== null && !e.nativeEvent.data.match(validAlpha)) {
      e.preventDefault(); // Prevents the input of non-alphabetical characters
    }
    //if (e.key === "Backspace" && index > 0) {
    if (
      e.nativeEvent.data === null &&
      e.nativeEvent.inputType === "deleteContentBackward" &&
      index > 0
    ) {
      updatedCharacters[index] = "";
      setCharacters(updatedCharacters);
      inputRefs[index - 1].current.focus();
      //} else if (e.key.match(validAlpha)) {
    } else if (e.nativeEvent.data.match(validAlpha)) {
      updatedCharacters[index] = e.nativeEvent.data;
      setCharacters(updatedCharacters);
      if (e.nativeEvent.data.length > 0 && index < inputRefs.length - 1) {
        console.log(inputRefs[index + 1].current);
        inputRefs[index + 1].current.focus();
      }
    }
  };
  useEffect(() => {}, [email]);
  const saveReply = async (email) => {
    try {
      console.log("saving score");
      const leaderboardCollectionRef = collection(
        getFirestore(),
        "popupReplies"
      );
      const q = query(
        collection(db, "popupReplies"),
        where("email", "==", email)
      );
      await getDocs(q).then((snap) => {
        if (snap.docs.length === 0) {
          const newScore = {
            email,
            date: new Date(),
          };
          console.log("newScore " + newScore);
          return addDoc(leaderboardCollectionRef, newScore);
        } else {
          console.log("Deja fait");
          setError("email déjà utilisée");
        }
      });
    } catch (error) {
      console.error("Error writing new score to Firebase Database", error);
    }
  };
  const handleSubmit = (e) => {
    setError(null);
    e.preventDefault();
    if (validateForm()) {
      if (
        characters.every(
          (val, index) =>
            val.toLowerCase() === correctAnswer[index].toLowerCase()
        )
      ) {
        console.log("Submitting");
        saveReply(email);
        setCharacters(Array(14).fill(""));
        setEmail("");
        setSuccessMessage("La réponse a été enregistrée!");
        setError("");
      } else {
        //setError("Réponse incorrecte");
        setError(characters);
      }
    }
    console.log("Submitted characters:", characters);
  };

  return (
    <form className="form-section" onSubmit={handleSubmit}>
      <h2>POPUP FORM</h2>
      <div className="info-section">
        <p>Ecrire le mot mystère pour gagner un tableau de votre choix</p>
      </div>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="character-form">
        {characters.map((char, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={char}
            className={
              char !== "" &&
              char.toLowerCase() !== correctAnswer[index].toLowerCase()
                ? "invalid"
                : ""
            }
            onFocus={() => {
              const updatedCharacters = [...characters];

              setPrevchar(characters[index]);
              updatedCharacters[index] = "";
              //setCharacters(updatedCharacters);
            }}
            onBlur={() => {
              console.log("Le champ a perdu le focus");
            }}
            //onKeyDown={(e) => handleKeyDown(index, e.target.value, e)}
            onChange={(e) => handleChange(index, e.target.value, e)}
            ref={inputRefs[index]}
          />
        ))}
        {error && (
          <p
            className="error-message"
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {error}
          </p>
        )}
        {successMessage && (
          <p
            className="success-message"
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {successMessage}
          </p>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PopupForm;