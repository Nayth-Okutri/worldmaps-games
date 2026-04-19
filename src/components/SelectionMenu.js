import { useEffect, useState } from "react"; // N'oublie pas d'importer useEffect et useState
import "../styles/selectionMenu.css";
import { clickResults } from "./Constants";
import { useTranslation } from "react-i18next";

const SelectionMenu = ({ x, y, shouldDisplay, questResult }) => {
  const { t } = useTranslation("menu");
  const [isVisible, setIsVisible] = useState(false);

  // Dès que le parent dit "affiche-toi", on passe isVisible à true
  // et on lance un timer pour repasser à false après 3s.
  useEffect(() => {
    if (shouldDisplay) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2000); // 3 secondes

      return () => clearTimeout(timer); // Nettoyage du timer si on reclique vite
    }
  }, [shouldDisplay, x, y]); // On surveille aussi x et y pour relancer l'effet si on clique ailleurs

  // Si le parent dit non, ou si notre timer est fini, on n'affiche rien
  if (!shouldDisplay || !isVisible) return null;

  const isCorrect = questResult === clickResults.Correct;
  const imgSource = isCorrect ? "Okdesu.png" : "NOkdesu.png";

  const positionStyle = {
    top: y - 20,
    left: x + 20,
  };

  return (
    <div
      className={`selection-menu ${isCorrect ? "is-correct" : "is-error"}`}
      style={positionStyle}
    >
      <img
        src={require(`../assets/${imgSource}`)}
        alt={isCorrect ? t("OKResult") : t("NOKResult")}
      />
      <p>{isCorrect ? t("OKResult") : t("NOKResult")}</p>
    </div>
  );
};

export default SelectionMenu;
