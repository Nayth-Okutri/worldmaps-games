import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/RegistrationModal.css"; // Import the modal styles
import { useTranslation } from "react-i18next";
const ErrorModalWindow = (errorMessage) => {
  let navigate = useNavigate();
  const { t } = useTranslation("menu");
  useEffect(() => {
    console.log("errorMessage " + JSON.stringify(errorMessage));
    console.log(errorMessage.errorMessage);
  }, []);
  return (
    <div className="registration-modal">
      <div className="modal-content">
        <h2>Error</h2>
        <div className="info-section">
          <p>{t(`${errorMessage.errorMessage}`)}</p>
        </div>

        <button
          onClick={() => {
            navigate(`/worldmaps`);
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModalWindow;
