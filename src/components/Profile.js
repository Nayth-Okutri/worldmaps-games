import React, { useEffect, useState } from "react";
import { useAuth } from "../auth"; // Import your authentication context or method
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Profile.css";
import {
  getFirestore,
  collection,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  getDocs,
  orderBy,
  limit,
  deleteDoc,
} from "firebase/firestore";
import {
  level1Data,
  level2Data,
  level3Data,
  level4Data,
  level5Data,
  level6Data,
  level7Data,
  level8Data,
  level9Data,
  level10Data,
} from "./LevelData";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import Leaderboard from "./Leaderboard";
import { useUser } from "../userContext";
import { useTranslation } from "react-i18next";
const Profile = ({ levelsData, weekOfYear }) => {
  const { currentUser, setCurrentUser } = useAuth(); // Get the current user from your authentication context
  const { player, setPlayer } = useUser();
  const [avatarFile, setAvatarFile] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [isEditingUsername, setIsEditingUsername] = useState(false); // Track if the username is being edited
  const [error, setError] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  // State to store user information
  const [userProfile, setUserProfile] = useState(null);
  const db = getFirestore();
  const { t } = useTranslation("menu");
  let navigate = useNavigate();
  const fetchUserProfile = async (uid) => {
    const q = query(collection(db, "users"), where("userId", "==", uid));
    await getDocs(q).then((snap) => {
      console.log(snap.docs[0].data());
      if (snap.docs.length > 0) {
        setUserProfile(snap.docs[0].data());
        setPlayer(snap.docs[0].data());
        console.log("currentUser " + currentUser);
        return snap.docs[0].data().userName;
      } else {
        console.log("Soucis");
      }
    });
  };

  const convertFBTimestampAsString = (FBTimestamp) => {
    if (typeof FBTimestamp === "undefined") return "";
    if (FBTimestamp.hasOwnProperty("seconds"))
      return FBTimestamp.seconds.toString();
    else return FBTimestamp;
  };

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
  const fetchUserActivities = async () => {
    console.log("fetchUserActivities for " + player.userName);
    if (player.userName !== "") {
      const userActivitiesCollectionRef = collection(
        getFirestore(),
        "users",
        player.userName + "/userActivities"
      );

      const activitiesSnapshot = await getDocs(
        query(userActivitiesCollectionRef, orderBy("date", "desc"), limit(100)),
        { source: "server" }
      ).then((snap) => {
        const newActivities = snap.docs.map((doc) => doc.data());
        setUserActivities(newActivities);
        console.log("userActivities " + JSON.stringify(userActivities));
        snap.docs.forEach((doc) => {});
      });
    }
  };
  useEffect(() => {
    // Fetch user profile data when the component mounts (you might need to adjust the data source)
    console.log(player);
    if (currentUser) {
      if (!userProfile) {
        console.log(currentUser.email);
        // Assuming you have a way to fetch user data based on the current user's ID
        // Replace this with your actual user data fetching logic
        fetchUserProfile(currentUser.uid)
          .then(() => {})
          .catch((error) => {
            console.error("Error fetching user profile:", error);
          });
      } else fetchUserActivities();
    }
  }, [currentUser, player]);

  const importLevels = async () => {
    try {
      //<button onClick={importLevels}>UPLOAD DATA</button>
      const levelsData = [
        level1Data,
        level2Data,
        level3Data,
        level4Data,
        level5Data,
        level6Data,
        level7Data,
        level8Data,
        level9Data,
        level10Data,
      ];
      const dataLevelCollectionRef = collection(getFirestore(), "levelData");
      let docRef;
      levelsData.forEach((levelData) => {
        docRef = doc(getFirestore(), "levelData", "level" + levelData.level);

        setDoc(docRef, levelData, { merge: true })
          .then(() => {
            console.log("Document added or updated successfully!");
          })
          .catch((error) => {
            console.error("Error adding or updating document: ", error);
          });
      });
    } catch (error) {
      console.error("Error writing new score to Firebase Database", error);
    }
  };
  const handleUsernameChange = async () => {
    // Update the username in Firebase Firestore
    setError("");
    const userDocRef = doc(db, `users/${player.userName}`);
    const NewUserDocRef = doc(db, `users/${newUsername}`);
    try {
      await getDoc(NewUserDocRef)
        .then((doc) => {
          if (doc.exists()) {
            setError(t("error.LoginUserAlreadyExists"));
          } else {
            return setDoc(
              NewUserDocRef,
              { ...player, userName: newUsername },
              { merge: true }
            )
              .then((snap) => {
                console.log("deleting ", snap);
                deleteDoc(userDocRef);
              })
              .then(() => {
                console.log("refresh");
                fetchUserProfile(currentUser.uid);
              });
          }
        })
        .catch((error) => {
          console.error("Error :", error);
        });

      setIsEditingUsername(false);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };
  return (
    <div className="profile">
      {currentUser !== null &&
        currentUser.uid === "0UwsYLspB9Z0Vke5KrWUdkRHZps1" && (
          <div>
            <button
              onClick={() => {
                navigate(`/worldmaps/weeklyResults`);
              }}
            >
              weekly contest
            </button>
            <button onClick={importLevels}>UPLOAD DATA</button>{" "}
          </div>
        )}
      {userProfile ? (
        <>
          <img
            src={
              userProfile.imageUrl !== ""
                ? userProfile.imageUrl
                : require("../assets/ProfileIcon.png")
            }
            alt="Avatar"
          />
          <h1>
            {" "}
            {isEditingUsername ? (
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            ) : (
              <span>{userProfile.userName}</span>
            )}
            {/* Display Edit and Save buttons for username */}
            {isEditingUsername ? (
              <>
                <button onClick={handleUsernameChange}>Save</button>
              </>
            ) : (
              <>
                <button onClick={() => setIsEditingUsername(true)}>Edit</button>
              </>
            )}
          </h1>
          {error && <p className="error-message">{error}</p>}
          <p>Email: {userProfile.email}</p>
          <h2>User Activities</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                {/* Add more table headers as needed */}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(userActivities) &&
                userActivities.length > 0 &&
                userActivities.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.activity}</td>
                    <td>{getDateFromFBTimestamp(activity.date)}</td>

                    {/* Add more table data cells as needed */}
                  </tr>
                ))}
            </tbody>
          </table>
          <h2>{t("ProfileMyScore")}</h2>
          <Leaderboard
            levelsData={levelsData}
            weekOfYear={weekOfYear}
            userId={userProfile.userId}
            minimalMode={true}
          />
        </>
      ) : (
        <p>{t("LoadingUserProfile")}</p>
      )}
    </div>
  );
};

export default Profile;
