import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/GuestbookPage.css";
import { db, storage } from "../firebase";
import LanguageDropdown from "./LanguageDropdown";

const entriesCollectionRef = collection(db, "sightings");

const GuestbookPage = () => {
  const [entries, setEntries] = useState([]);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [translationSpace, setTranslationSpace] = useState();
  const { t } = useTranslation("guestbook");
  const [filter, setFilter] = useState("all");
  const [country, setCountry] = useState("");

  // Filtrage des entrées
  const filteredEntries = entries
    .filter((e) => e.approved) // On ne garde que les validés
    .filter((entry) => {
      if (filter === "all") return true;

      // Filtre par source (guestbook, twitter...)
      // OU par catégorie (commission, artbook...)
      return entry.source === filter || entry.category === filter;
    });
  // 📥 FETCH
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };
  const fetchEntries = async () => {
    const q = query(
      entriesCollectionRef,
      orderBy("createdAt", "desc"),
      limit(20),
    );

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setEntries(data);
  };

  useEffect(() => {
    fetchEntries();
  }, []);
  const Spoiler = ({ children }) => {
    const [revealed, setRevealed] = useState(false);

    return (
      <span
        onClick={() => setRevealed(!revealed)}
        style={{
          background: revealed ? "transparent" : "#000",
          color: revealed ? "#000" : "#000",
          borderBottom: "1px dashed #999",
          cursor: "pointer",
          padding: "2px 4px",
        }}
      >
        {children}
      </span>
    );
  };
  const renderMessage = (text) => {
    if (!text) return null;

    const parts = text.split(/(\[spoiler\].*?\[\/spoiler\])/g);

    return parts.map((part, index) => {
      if (part.startsWith("[spoiler]")) {
        const content = part.replace("[spoiler]", "").replace("[/spoiler]", "");

        return <Spoiler key={index}>{content}</Spoiler>;
      }

      return <span key={index}>{part}</span>;
    });
  };
  // ✍️ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !message || !image || !country) {
      alert(t("AlertRequired"));
      return;
    }
    if (email && !validateEmail(email)) {
      alert(t("AlertInvalidEmail")); // On ajoute cette clé dans ton JSON
      return;
    }
    try {
      let imageUrl = null;

      if (image) {
        const imageRef = ref(storage, `sightings/${Date.now()}-${image.name}`);

        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const newEntry = {
        name,
        country,
        message,
        email,
        imageUrl,
        source: "guestbook",
        createdAt: new Date(),
        approved: false,
      };

      await addDoc(entriesCollectionRef, newEntry);

      // reset
      setName("");
      setMessage("");
      setEmail("");
      setImage(null);
      setCountry("");
      fetchEntries();

      alert(t("AlertSuccess"));
    } catch (err) {
      console.error(err);
      alert(t("AlertError"));
    }
  };

  return (
    <div className="guestbook-container">
      <div className="guestbook-nav">
        <a href="https://nayth.art" className="back-link">
          ← nayth.art
        </a>
        <div className="nav-right">
          <LanguageDropdown />
        </div>
      </div>
      <h2 style={{ textAlign: "center", marginBottom: 40 }}>
        {t("GuestbookTitle")}
      </h2>

      {/* FORM */}
      <form className="guestbook-form" onSubmit={handleSubmit}>
        <input
          placeholder={t("PlaceholderName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <textarea
          placeholder={t("PlaceholderMessage")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <label className="file-label">{t("UploadAction")} *required</label>
        <input
          type="file"
          required
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <input
          type="email"
          placeholder={t("PlaceholderEmail")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="gift-info">
          Submit a sighting and receive the digital PDF artbook gift by email.
        </p>
        <button type="submit">{t("SubmitButton")}</button>
      </form>
      <div className="filter-bar">
        {/* Filtres Généraux */}
        <button
          onClick={() => setFilter("all")}
          className={filter === "all" ? "active" : ""}
        >
          All Lore
        </button>

        <span className="filter-separator">|</span>

        {/* Filtres par Produits (Tags manuels) */}
        <button
          onClick={() => setFilter("commission")}
          className={filter === "commission" ? "active" : ""}
        >
          🎨 Commissions
        </button>
        <button
          onClick={() => setFilter("artbook")}
          className={filter === "artbook" ? "active" : ""}
        >
          📖 Artbooks
        </button>
        <button
          onClick={() => setFilter("saigon")}
          className={filter === "saigon" ? "active" : ""}
        >
          🏮Saigon
        </button>
        <button
          onClick={() => setFilter("print")}
          className={filter === "print" ? "active" : ""}
        >
          🖼️ Prints
        </button>

        <span className="filter-separator">|</span>

        {/* Filtre par Source */}
        <button
          onClick={() => setFilter("twitter")}
          className={filter === "twitter" ? "active" : ""}
        >
          📜 Scrolls
        </button>
      </div>
      {/* WALL */}
      <div className="masonry-grid">
        {filteredEntries.map((entry) => {
          // Extraire l'année de l'objet Timestamp de Firebase
          const date = entry.createdAt?.toDate();

          const year = date ? date.getFullYear() : "2026";

          return (
            <article key={entry.id} className="log-card">
              {/* Le Badge de l'année */}
              <div className="year-stamp">{year}</div>

              {entry.imageUrl && (
                <img src={entry.imageUrl} alt={`Sighting by ${entry.name}`} />
              )}

              <div className="card-content">
                <p className="message">"{renderMessage(entry.message)}"</p>
                <p className="author">
                  {t("SightingBy")} — {entry.name} ({entry.country})
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default GuestbookPage;
