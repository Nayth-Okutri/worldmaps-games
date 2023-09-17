import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
      const repliesData = repliesSnapshot.docs.map((doc) => doc.data());
      setReplies(repliesData);
    };

    fetchData();
  }, []);
  function getRandomIndex(array) {
    return Math.floor(Math.random() * array.length);
  }
  const getOneResult = () => {
    const randomIndex = getRandomIndex(replies);
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
      {result && (
        <p
          className="success-message"
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {result.email}
        </p>
      )}
      <button onClick={getOneResult}>Tirer au sort</button>
    </div>
  );
};

export default PopupRepliesTable;
