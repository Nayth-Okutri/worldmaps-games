import React from "react";
import "../styles/LanguageDropdown.css";
import { useTranslation } from "react-i18next";

const LanguageDropdown = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
  };

  return (
    <select
      className="language-dropdown"
      onChange={handleLanguageChange}
      value={i18n.language}
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
    </select>
  );
};

export default LanguageDropdown;
