import React, { useState, useEffect, useRef } from "react";
import "../styles/SlotMachine.css";

const SlotMachine = () => {
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
  const [selectedItem, setSelectedItem] = useState(null);
  const [rolling, setRolling] = useState(false);
  const slotRef = [useRef()];

  const handleStart = () => {
    if (!rolling) {
      setRolling(true);

      let spins = 0;
      let interval = setInterval(() => {
        slotRef.forEach((ref, i) => {
          const selected = triggerSlotRotation(ref);
          setSelectedItem((prev) => ({ ...prev, [`fruit${i + 1}`]: selected }));
        });

        spins += 1;
        if (spins === 50) {
          clearInterval(interval);
          setTimeout(() => {
            setRolling(false);
          }, 3000); // Set the duration for how long you want the rolling effect to continue
        }
      }, 100); // Set the speed of the rolling effect
    }
  };
  const triggerSlotRotation = (ref) => {
    const setTransform = (transform) => {
      ref.current.style.transform = transform;
    };

    let options = ref.current.children;
    let randomOption = Math.floor(Math.random() * items.length);
    let chosenOption = options[randomOption];
    const offset = -chosenOption.offsetTop + 2;
    setTransform(`translateY(${offset}px)`);

    return items[randomOption];
  };

  return (
    <div className="SlotMachine">
      <div className="slot">
        <section>
          <div className="container" ref={slotRef[0]}>
            {items.map((item, i) => (
              <div key={i}>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div
        className={!rolling ? "roll rolling" : "roll"}
        onClick={handleStart}
        disabled={rolling}
      >
        {rolling ? "Rolling..." : "ROLL"}
      </div>
    </div>
  );
};

export default SlotMachine;
