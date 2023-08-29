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
    {
      question: "Find Snubbull",
      positions: [{ top: { x: 1017, y: 1142 }, bottom: { x: 1075, y: 1211 } }],
    },
    {
      question: "Find Slowpoke",
      positions: [{ top: { x: 785, y: 792 }, bottom: { x: 840, y: 842 } }],
    },
    {
      question: "Find all starter Pokemons (4 groups)",
      positions: [
        { top: { x: 1150, y: 620 }, bottom: { x: 1253, y: 689 } },
        { top: { x: 875, y: 858 }, bottom: { x: 969, y: 963 } },
        { top: { x: 946, y: 789 }, bottom: { x: 1000, y: 865 } },
        { top: { x: 1344, y: 1303 }, bottom: { x: 1430, y: 1355 } },
      ],
    },
    {
      question: "Find Furret",
      positions: [{ top: { x: 412, y: 635 }, bottom: { x: 480, y: 687 } }],
    },
    {
      question: "Find Pinsir",
      positions: [{ top: { x: 0, y: 420 }, bottom: { x: 38, y: 483 } }],
    },
    {
      question: "Find Moltress",
      positions: [{ top: { x: 994, y: 1 }, bottom: { x: 1102, y: 94 } }],
    },
    {
      question: "Find Mareep",
      positions: [{ top: { x: 1113, y: 1165 }, bottom: { x: 1207, y: 1238 } }],
    },
    {
      question: "Find Grimer",
      positions: [{ top: { x: 568, y: 731 }, bottom: { x: 635, y: 783 } }],
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
const level3Data = {
  quests: [
    {
      question: "Find Sora",
      positions: [{ top: { x: 1344, y: 1230 }, bottom: { x: 1388, y: 1278 } }],
    },
    {
      question: "Find the Highwind",
      positions: [{ top: { x: 523, y: 223 }, bottom: { x: 626, y: 275 } }],
    },
    {
      question: "Find Cloud",
      positions: [{ top: { x: 712, y: 998 }, bottom: { x: 740, y: 1042 } }],
    },
    {
      question: "Find Ashley (Vagrant Story)",
      positions: [{ top: { x: 928, y: 998 }, bottom: { x: 959, y: 1042 } }],
    },
    {
      question: "Find Terra (Final Fantasy)",
      positions: [{ top: { x: 1130, y: 673 }, bottom: { x: 1195, y: 742 } }],
    },
    {
      question: "Find Bombo (Final Fantasy)",
      positions: [{ top: { x: 1295, y: 1213 }, bottom: { x: 1322, y: 1249 } }],
    },
    {
      question: "Find Justin (Grandia)",
      positions: [{ top: { x: 1787, y: 1154 }, bottom: { x: 1819, y: 1195 } }],
    },
    {
      question: "Find 2B, 9s (Nier)",
      positions: [{ top: { x: 275, y: 1120 }, bottom: { x: 308, y: 1168 } }],
    },
    {
      question: "Find Vivi (Final Fantasy)",
      positions: [{ top: { x: 386, y: 916 }, bottom: { x: 410, y: 950 } }],
    },
    {
      question: "Find Flamy (Legend of Mana)",
      positions: [{ top: { x: 439, y: 92 }, bottom: { x: 523, y: 188 } }],
    },
    {
      question: "Find Nina (Breath of Fire)",
      positions: [{ top: { x: 1496, y: 1226 }, bottom: { x: 1511, y: 1261 } }],
    },
  ],
  name: "JRPG",
  level: 3,
  updateDate: new Date(),
};
const level4Data = {
  quests: [
    {
      question: "Find Link",
      positions: [{ top: { x: 1107, y: 775 }, bottom: { x: 1144, y: 846 } }],
    },
    {
      question: "Find Niko",
      positions: [{ top: { x: 1278, y: 929 }, bottom: { x: 1319, y: 992 } }],
    },
    {
      question: "Find Malon",
      positions: [{ top: { x: 1488, y: 485 }, bottom: { x: 1520, y: 543 } }],
    },
    {
      question: "Find King of Red Lions",
      positions: [{ top: { x: 330, y: 677 }, bottom: { x: 426, y: 1063 } }],
    },
    {
      question: "Find 4 Zelda princesses",
      hint: "From Wind waker, Breath of the Wild, Ocarina of Time and Spirit Tracks",
      positions: [
        { top: { x: 144, y: 1138 }, bottom: { x: 178, y: 1196 } },
        { top: { x: 460, y: 533 }, bottom: { x: 508, y: 600 } },
        { top: { x: 1357, y: 205 }, bottom: { x: 1393, y: 266 } },
        { top: { x: 833, y: 90 }, bottom: { x: 904, y: 180 } },
      ],
    },
    {
      question: "Find Medli",
      hint: "Priestress from Wind Waker",
      positions: [{ top: { x: 648, y: 456 }, bottom: { x: 695, y: 526 } }],
    },
  ],
  name: "ZELDA",
  level: 4,
  updateDate: new Date(),
};
const importLevels = async () => {
  try {
    //<button onClick={importLevels}>UPLOAD DATA</button>
    const levelsData = [level1Data, level2Data, level3Data, level4Data];
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
const LevelsDisplay = ({
  levelsData,
  clickFunction,
  displayIcons = true,
  highlight,
}) => {
  const [hoveredLevel, setHoveredLevel] = useState(0); // State for tracking hovered level

  return (
    <div className="levels-display">
      <button onClick={importLevels}>UPLOAD DATA</button>
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
