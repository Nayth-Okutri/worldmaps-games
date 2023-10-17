import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import "../styles/PopupForm.css";
const PopupRepliesTable = () => {
  const [replies, setReplies] = useState([]);
  const [result, setResult] = useState("");
  const getTimeStamp = (FBTimestamp) => {
    if (typeof FBTimestamp === "undefined") return "";
    if (FBTimestamp.hasOwnProperty("seconds")) return FBTimestamp.seconds;
    else return FBTimestamp;
  };
  const getDateFromFBTimestamp = (FBTimestamp) => {
    const dateObject = new Date(getTimeStamp(FBTimestamp) * 1000);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = String(dateObject.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const repliesCollectionRef = collection(db, "popupReplies");
      const repliesSnapshot = await getDocs(repliesCollectionRef);
      const repliesData = repliesSnapshot.docs.map((doc) => {
        const data = doc.data();
        let [username, domain] = data.email.split("@");

        // Remplace les trois derniers caractères du nom d'utilisateur par des étoiles
        let maskedUsername = username.slice(0, -3) + "***";

        // Reconstitue l'adresse e-mail
        let maskedEmail = maskedUsername + "@" + domain;
        data.maskedEmail = maskedEmail;
        return { ...data, vote: 0 };
      });
      setReplies(repliesData);
    };

    fetchData();
  }, []);
  function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
  }
  const getOneResult = () => {
    const randomIndex = getRandomIndex(replies);
    const newrepliesData = replies;
    if (newrepliesData[randomIndex].vote === 1) {
      alert(`Gagnant !! ${newrepliesData[randomIndex].email}`);
    }
    newrepliesData[randomIndex].vote += 1;
    setReplies(newrepliesData);
    setResult(replies[randomIndex]);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        whiteSpace: "nowrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2>Nombre de participants {replies.length}</h2>
      <button onClick={getOneResult}>Tirer au sort</button>
      <table>
        <thead>
          <tr>
            <th>MAIL</th>
            <th>DATE</th>
            <th>POINTS</th>
            <th>NEWSLETTER</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {replies.map((reply, index) => (
            <tr key={index}>
              <td>{reply.email}</td>
              <td>{getDateFromFBTimestamp(reply.date)}</td>
              <td>
                {" "}
                <div className="vote-icon">
                  {[...Array(reply.vote)].map((_, i) => (
                    <span
                      key={i}
                      className={reply.vote === 2 ? "yellow-dot" : "green-dot"}
                    ></span>
                  ))}
                </div>
              </td>
              <td>
                {reply.newsletterChecked ? "Inscrit à la newsletter" : ""}
              </td>
              {/* Add more table data cells as needed */}
            </tr>
          ))}
        </tbody>
      </table>
      {result && (
        <p
          className="success-message"
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {result.email}
        </p>
      )}
    </div>
  );
};

export default PopupRepliesTable;
