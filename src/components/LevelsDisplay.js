import "../styles/levelsDisplay.css";
import { collection, getFirestore, setDoc, doc } from "firebase/firestore";

const level1Data = {
  quests: [
    {
      type: 2,
      question: "Find duplicate Pokemon",
      positions: [
        { top: { x: 463, y: 1487 }, bottom: { x: 579, y: 1716 } },
        { top: { x: 1713, y: 247 }, bottom: { x: 1788, y: 333 } },
      ],
    },
    {
      type: 1,
      question: "Find Evee",
      position: { top: { x: 688, y: 690 }, bottom: { x: 773, y: 758 } },
    },
  ],
  name: "Pokemon Fair",
  level: 1,
  updateDate: new Date(),
};
const level2Data = {
  quests: [
    {
      type: 1,
      question: "Find Miyazaki",
      position: { top: { x: 1300, y: 1120 }, bottom: { x: 1330, y: 1230 } },
    },
    {
      type: 1,
      question: "Find Baron",
      position: { top: { x: 1337, y: 1615 }, bottom: { x: 1415, y: 1671 } },
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
            />
            <div className="description">{`Level ${level} : ${levelData.name}`}</div>
          </div>
        );
      })}
    </div>
  );
};

export default LevelsDisplay;
