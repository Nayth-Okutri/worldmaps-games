import React, { useEffect, useState } from "react";
import { useAuth } from "../auth"; // Import your authentication context or method
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
  deleteDoc,
} from "firebase/firestore";
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
  // State to store user information
  const [userProfile, setUserProfile] = useState(null);
  const db = getFirestore();
  const { t } = useTranslation("menu");
  const fetchUserProfile = async (uid) => {
    const q = query(collection(db, "users"), where("userId", "==", uid));
    await getDocs(q).then((snap) => {
      console.log(snap.docs[0].data());
      if (snap.docs.length > 0) {
        setUserProfile(snap.docs[0].data());
        setPlayer(snap.docs[0].data());
        console.log("currentUser " + currentUser);
      } else {
        console.log("Soucis");
      }
    });
  };

  useEffect(() => {
    // Fetch user profile data when the component mounts (you might need to adjust the data source)
    if (currentUser) {
      console.log(currentUser.email);
      // Assuming you have a way to fetch user data based on the current user's ID
      // Replace this with your actual user data fetching logic
      fetchUserProfile(currentUser.uid)
        .then(() => {})
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [currentUser]);
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