import { Link, useLocation } from "react-router-dom";
import "../styles/heading.css";
import { useState, useRef, useEffect } from "react";
import LanguageDropdown from "./LanguageDropdown";
import Registration from "./Registration";
const Heading = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const openRegistrationModal = () => {
    setShowRegistrationModal(true);
  };

  const closeRegistrationModal = () => {
    setShowRegistrationModal(false);
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const location = useLocation();
  useEffect(() => {
    const handleMenuLinkClick = () => {
      setMenuOpen(false);
    };

    const menuLinks = document.querySelectorAll(".Header-Link a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", handleMenuLinkClick);
    });
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      menuLinks.forEach((link) => {
        link.removeEventListener("click", handleMenuLinkClick);
      });
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const isGameScreen = /^\/worldmaps\/game\/\d+$/.test(location.pathname);

  return (
    <div className="heading">
      <div className={`${isGameScreen ? "classic-hidden" : "classic-menu"}`}>
        <div className="logo-container">
          <img src={require("../assets/Logo.png")} alt="Logo" />{" "}
          <div className="title">
            <Link to="/worldmaps">Worldmaps</Link>
            <div className="stroke"></div>
            <p>Geek Seek Quest</p>
          </div>
        </div>
        <div className="divider"></div> {/* Empty divider */}
        <div className="Header-Link">
          <a
            href="https://www.instagram.com/n.a.y.t.h/"
            className="external-link"
          >
            INSTAGRAM
          </a>
        </div>
        <div className="Header-Link">
          <a href="https://nayth.art/shop/" className="external-link">
            SHOP
          </a>
        </div>
        <div className="Header-Link">
          <Link to="/worldmaps/leaderboard">RANKING</Link>
        </div>
        <LanguageDropdown />
      </div>
      {isGameScreen && (
        <div
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      )}

      <div className={`menu ${menuOpen ? "active" : ""}`}>
        <div className="Header-Link">
          <Link to="/worldmaps">HOME</Link>
        </div>

        <div className="Header-Link">
          <a
            href="https://www.instagram.com/n.a.y.t.h/"
            className="external-link"
          >
            INSTAGRAM
          </a>
        </div>
        <div className="Header-Link">
          <a href="https://nayth.art/shop/" className="external-link">
            SHOP
          </a>
        </div>
        <div className="Header-Link">
          <Link to="/worldmaps/leaderboard">RANKING</Link>
        </div>
        <div className="Header-Link">
          <LanguageDropdown />
        </div>
      </div>
    </div>
  );
};

export default Heading;
