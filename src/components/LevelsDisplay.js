import "../styles/levelsDisplay.css";
import { useState } from "react";
import { collection, getFirestore, setDoc, doc } from "firebase/firestore";
import { TypeAnimation } from "react-type-animation";
const level1Data = {
  quests: [
    {
      question: "Find duplicate Pokemon",
      positions: [
        { top: { x: 352, y: 1138 }, bottom: { x: 446, y: 1320 } },
        { top: { x: 1317, y: 190 }, bottom: { x: 1373, y: 255 } },
      ],
    },
    {
      question: "Find Evee",
      positions: [{ top: { x: 530, y: 521 }, bottom: { x: 589, y: 580 } }],
    },
  ],
  name: "Pokemon Fair",
  level: 1,
  updateDate: new Date(),
};
const level2Data = {
  quests: [
    {
      question: "Find Miyazaki",
      positions: [{ top: { x: 991, y: 859 }, bottom: { x: 1024, y: 949 } }],
    },
    {
      question: "Find Baron",
      positions: [{ top: { x: 1048, y: 1234 }, bottom: { x: 1086, y: 1284 } }],
    },
  ],
  name: "Ghibli",
  level: 2,
  updateDate: new Date(),
};
const importLevels = async () => {
  try {
    //<button onClick={importLevels}>UPLOAD DATA</button>
    const dataLevelCollectionRef = collection(getFirestore(), "levelData");
    let docRef = doc(getFirestore(), "levelData", "level1");
    console.log("dataLevelCollectionRef " + dataLevelCollectionRef);
    setDoc(docRef, level1Data, { merge: true })
      .then(() => {
        console.log("Document added or updated successfully!");
      })
      .catch((error) => {
        console.error("Error adding or updating document: ", error);
      });
    docRef = doc(getFirestore(), "levelData", "level2");
    console.log("dataLevelCollectionRef " + dataLevelCollectionRef);
    setDoc(docRef, level2Data, { merge: true })
      .then(() => {
        console.log("Document added or updated successfully!");
      })
      .catch((error) => {
        console.error("Error adding or updating document: ", error);
      });
  } catch (error) {
    console.error("Error writing new score to Firebase Database", error);
  }
};
const LevelsDisplay = ({
  levelsData,
  clickFunction,
  displayIcons = true,
  highlight,
}) => {
  const [hoveredLevel, setHoveredLevel] = useState(0); // State for tracking hovered level

  return (
    <div className="levels-display">
      {levelsData.map((levelData) => {
        const level = levelData.level;
        const isHighlighted = hoveredLevel === level;

        return (
          <div
            className={`level${level === highlight ? " highlight" : ""}`}
            onMouseEnter={() => setHoveredLevel(level)} // Set hovered level on mouse enter
            onMouseLeave={() => setHoveredLevel(null)} // Clear hovered level on mouse leave
            onClick={() => {
              clickFunction(level);
            }}
            key={level}
          >
            <div className="image-container">
              <img
                src={require(`../assets/level-${level}.jpg`)}
                alt={`Level ${level}`}
                style={{
                  opacity: level === highlight || isHighlighted ? 1 : 0.5,
                }}
              />
            </div>

            {isHighlighted && (
              <div className="type-animation">
                <TypeAnimation
                  sequence={`${levelData.name.toUpperCase()}`}
                  speed={50}
                  repeat={0}
                  cursor={false}
                  style={{ fontSize: "2em" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LevelsDisplay;
