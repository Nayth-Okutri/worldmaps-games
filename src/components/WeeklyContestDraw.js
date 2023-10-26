import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../auth"; // Import your authentication context or method
import SlotMachine from "./SlotMachine";
import "../styles/PopupForm.css";
const WeeklyContestDraw = ({ weekOfYear }) => {
  const [replies, setReplies] = useState([]);
  const [result, setResult] = useState("");
  const getTimeStamp = (FBTimestamp) => {
    if (typeof FBTimestamp === "undefined") return "";
    if (FBTimestamp.hasOwnProperty("seconds")) return FBTimestamp.seconds;
    else return FBTimestamp;
  };
  const { currentUser, setCurrentUser } = useAuth(); // Get the current user from your authentication context
  const getDateFromFBTimestamp = (FBTimestamp) => {
    const dateObject = new Date(getTimeStamp(FBTimestamp) * 1000);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = String(dateObject.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
  };
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paramWeekOfYear = parseInt(queryParams.get("weekOfYear"));
    console.log("currentUser " + JSON.stringify(currentUser));
    const fetchData = async () => {
      const db = getFirestore();
      console.log(weekOfYear);
      const weekToFetch = !isNaN(paramWeekOfYear)
        ? paramWeekOfYear
        : weekOfYear;
      console.log(weekToFetch);
      const repliesCollectionRef = collection(
        db,
        "weeklyContest/" + weekToFetch + "/Results"
      );
      //const repliesCollectionRef = collection(db, "popupReplies");
      const repliesSnapshot = await getDocs(repliesCollectionRef);
      const repliesData = repliesSnapshot.docs.map((doc) => {
        const data = doc.data();
        let [username, domain] = data.email.split("@");

        // Remplace les trois derniers caractères du nom d'utilisateur par des étoiles
        let maskedUsername = username.slice(0, -3) + "***";

        // Reconstitue l'adresse e-mail
        let maskedEmail = maskedUsername + "@" + domain;
        data.maskedEmail = maskedEmail;
        return { ...data };
      });
      setReplies(repliesData);
    };

    fetchData();
  }, [weekOfYear]);
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
      {currentUser !== null &&
        currentUser.uid === "0UwsYLspB9Z0Vke5KrWUdkRHZps1" && (
          <h2>Nombre de participants {replies.length}</h2>
        )}
      {currentUser !== null &&
        currentUser.uid === "0UwsYLspB9Z0Vke5KrWUdkRHZps1" && (
          <table>
            <thead>
              <tr>
                <th>MAIL</th>
                <th>DATE</th>

                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {replies.map((reply, index) => (
                <tr key={index}>
                  <td>{reply.email}</td>
                  <td>{getDateFromFBTimestamp(reply.date)}</td>

                  {/* Add more table data cells as needed */}
                </tr>
              ))}
            </tbody>
          </table>
        )}

      {currentUser !== null &&
        currentUser.uid === "0UwsYLspB9Z0Vke5KrWUdkRHZps1" && (
          <SlotMachine items={replies} />
        )}
    </div>
  );
};

export default WeeklyContestDraw;
