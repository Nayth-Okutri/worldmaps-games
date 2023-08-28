import "../styles/levelsDisplay.css";
import { collection, getFirestore, setDoc, doc } from "firebase/firestore";

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
  return (
    <div className="levels-display">
      {levelsData.map((levelData) => {
        const level = levelData.level;
        return (
          <div
            className={`level${level === highlight ? " highlight" : ""}`}
            onClick={() => {
              clickFunction(level);
            }}
            key={level}
          >
            <img
              src={require(`../assets/level-${level}.jpg`)}
              alt={`Level ${level}`}
              style={{ opacity: level === highlight ? 1 : 0.5 }}
            />
            <div className="description">{`Level ${level} : ${levelData.name}`}</div>
          </div>
        );
      })}
    </div>
  );
};

export default LevelsDisplay;
