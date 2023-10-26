import React, { useState } from "react";
import { useSpring, animated, config } from "react-spring";

const RandomSelection = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [startAnimation, setStartAnimation] = useState(false);

  const selectRandomItem = () => {
    setStartAnimation(true);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setSelectedItem(items[randomIndex]);
      setStartAnimation(false);
    }, 10000); // Délai pour l'animation (2 secondes ici)
  };

  const animationProps = useSpring({
    transform: `translateY(${startAnimation ? "-100%" : "0"})`, // Défilement vertical
    config: config.wobbly,
    onRest: () => {
      if (startAnimation) {
        selectRandomItem();
      }
    },
  });

  return (
    <div>
      <button onClick={selectRandomItem} disabled={startAnimation}>
        Tirage au sort
      </button>
      <div style={{ overflow: "hidden", height: "100px" }}>
        <animated.div style={animationProps}>
          {items.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </animated.div>
      </div>
      {selectedItem && <h2>Élément sélectionné : {selectedItem}</h2>}
    </div>
  );
};

export default RandomSelection;
