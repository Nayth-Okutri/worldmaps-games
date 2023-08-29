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
      question: "Find Hayao Miyazaki",
      positions: [{ top: { x: 991, y: 859 }, bottom: { x: 1024, y: 949 } }],
    },
    {
      question: "Find Baron",
      positions: [{ top: { x: 1048, y: 1234 }, bottom: { x: 1086, y: 1284 } }],
    },
    {
      question: "Find Isao Takahata",
      positions: [{ top: { x: 955, y: 857 }, bottom: { x: 987, y: 965 } }],
    },
    {
      question: "Find Dora (Laputa)",
      positions: [{ top: { x: 628, y: 94 }, bottom: { x: 663, y: 127 } }],
    },
    {
      question: "Find Curtis (Porco Rosso)",
      positions: [{ top: { x: 936, y: 1131 }, bottom: { x: 979, y: 1244 } }],
    },
    {
      question: "Find Nonoko (Yamada)",
      positions: [{ top: { x: 590, y: 1092 }, bottom: { x: 615, y: 1121 } }],
    },
    {
      question: "Find Boh (Chihiro)",
      positions: [{ top: { x: 905, y: 1018 }, bottom: { x: 924, y: 1042 } }],
    },
    {
      question: "Find all characters of Whisper of the Heart",
      positions: [
        { top: { x: 810, y: 941 }, bottom: { x: 888, y: 1028 } },
        { top: { x: 1048, y: 1238 }, bottom: { x: 1085, y: 1290 } },
        { top: { x: 1427, y: 691 }, bottom: { x: 1453, y: 764 } },
      ],
    },
    {
      question: "Find Howl",
      positions: [{ top: { x: 1616, y: 58 }, bottom: { x: 1696, y: 150 } }],
    },
    {
      question: "Find all the Totoros",
      positions: [
        { top: { x: 1330, y: 434 }, bottom: { x: 1414, y: 557 } },
        { top: { x: 1154, y: 814 }, bottom: { x: 1216, y: 872 } },
      ],
    },
    {
      question: "Find Lili (Kiki)",
      positions: [{ top: { x: 930, y: 660 }, bottom: { x: 960, y: 690 } }],
    },
    {
      question: "Find Tombo (Kiki)",
      positions: [{ top: { x: 622, y: 1084 }, bottom: { x: 857, y: 1170 } }],
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
