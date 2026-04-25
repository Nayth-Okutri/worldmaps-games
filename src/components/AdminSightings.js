import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

const sightingsRef = collection(db, "sightings");

const AdminSightings = () => {
  const [pending, setPending] = useState([]);
  const [passphrase, setPassphrase] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const btnTagStyle = (bg, color) => ({
    flex: 1,
    padding: "8px",
    background: bg,
    color: color,
    border: `1px solid ${color}`,
    borderRadius: "4px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "100px",
  });
  const checkPass = (e) => {
    if (e.target.value.toUpperCase() === "RACCOON") {
      setIsAuthorized(true);
    }
    setPassphrase(e.target.value);
  };

  const fetchPending = async () => {
    try {
      // J'ai enlevé le "orderBy" pour éviter l'erreur d'index Firebase
      const q = query(sightingsRef, where("approved", "==", false));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // On trie manuellement en JS pour éviter de casser Firebase
      const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
      setPending(sortedData);
    } catch (error) {
      console.error("Erreur Firebase:", error);
      alert("Erreur de chargement. Vérifie la console.");
    }
  };

  useEffect(() => {
    if (isAuthorized) fetchPending();
  }, [isAuthorized]);

  const approve = async (id) => {
    const ref = doc(db, "sightings", id);
    await updateDoc(ref, { approved: true });
    setPending(pending.filter((p) => p.id !== id));
  };
  const approveWithTag = async (id, tag = "guestbook") => {
    try {
      const ref = doc(db, "sightings", id);
      await updateDoc(ref, {
        approved: true,
        category: tag,
      });
      // On retire de la liste "pending" localement
      setPending(pending.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erreur approbation:", error);
    }
  };

  const remove = async (id) => {
    if (window.confirm("Supprimer définitivement ?")) {
      const ref = doc(db, "sightings", id);
      await deleteDoc(ref);
      setPending(pending.filter((p) => p.id !== id));
    }
  };

  if (!isAuthorized) {
    return (
      <div
        style={{
          textAlign: "center",
          paddingTop: "20vh",
          fontFamily: "sans-serif",
        }}
      >
        <h2>Sceau de l'Archiviste</h2>
        <input
          type="password"
          placeholder="Mot de passe..."
          value={passphrase}
          onChange={checkPass}
          style={{
            border: "none",
            borderBottom: "2px solid #d4af37",
            textAlign: "center",
            fontSize: "1.5rem",
            outline: "none",
            padding: "10px",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#1a2a44" }}>
        Archives en attente
      </h2>
      <p style={{ textAlign: "center", color: "#d4af37" }}>
        {pending.length} message(s) à examiner.
      </p>

      {pending.length === 0 && (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          Tout est en ordre ! 👌
        </p>
      )}

      <div style={{ display: "grid", gap: "20px" }}>
        {pending.map((entry) => (
          <div
            key={entry.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "4px",
              background: "#fff",
            }}
          >
            {entry.imageUrl && (
              <img
                src={entry.imageUrl}
                alt=""
                style={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  marginBottom: "10px",
                }}
              />
            )}
            <p style={{ fontSize: "1.1rem", margin: "0 0 10px 0" }}>
              "{entry.message}"
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              — {entry.name} ({entry.email})
            </p>

            <div
              style={{
                marginTop: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {/* Première ligne : Approbation par catégorie */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => approveWithTag(entry.id, "commission")}
                  style={btnTagStyle("#e3f2fd", "#0d47a1")} // Bleu clair
                >
                  🎨 Commission
                </button>
                <button
                  onClick={() => approveWithTag(entry.id, "artbook")}
                  style={btnTagStyle("#f3e5f5", "#4a148c")} // Violet
                >
                  📖 Artbook
                </button>
                <button
                  onClick={() => approveWithTag(entry.id, "saigon")}
                  style={btnTagStyle("#f3e5f5", "#4a148c")} // Violet
                >
                  🏮Saigon
                </button>
                <button
                  onClick={() => approveWithTag(entry.id, "print")}
                  style={btnTagStyle("#e8f5e9", "#1b5e20")} // Vert
                >
                  🖼️ Print
                </button>
              </div>

              {/* Deuxième ligne : Approbation standard et Suppression */}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => approveWithTag(entry.id, "guestbook")}
                  style={{
                    flex: 2,
                    padding: "12px",
                    background: "#1a2a44",
                    color: "#d4af37",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                    borderRadius: "4px",
                  }}
                >
                  APPROUVER (Standard)
                </button>
                <button
                  onClick={() => remove(entry.id)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#fdeaea",
                    color: "#9e1a1a",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSightings;
