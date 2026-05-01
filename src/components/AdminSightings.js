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

// 🔥 Composant Spoiler (click pour révéler)
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

// 🔥 Parser [spoiler]
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

const sightingsRef = collection(db, "sightings");

const AdminSightings = () => {
  const [pending, setPending] = useState([]);
  const [passphrase, setPassphrase] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ✏️ édition
  const [editingId, setEditingId] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");

  const checkPass = (e) => {
    if (e.target.value.toUpperCase() === "RACCOON") {
      setIsAuthorized(true);
    }
    setPassphrase(e.target.value);
  };

  const fetchPending = async () => {
    const q = query(sightingsRef, where("approved", "==", false));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    const sortedData = data.sort((a, b) => b.createdAt - a.createdAt);
    setPending(sortedData);
  };

  useEffect(() => {
    if (isAuthorized) fetchPending();
  }, [isAuthorized]);

  // 💾 save edit
  const saveEdit = async (id) => {
    const ref = doc(db, "sightings", id);

    await updateDoc(ref, {
      message: editedMessage,
    });

    setPending(
      pending.map((p) => (p.id === id ? { ...p, message: editedMessage } : p)),
    );

    setEditingId(null);
  };

  // 🏷️ approve
  const approveWithTag = async (id, tag = "guestbook") => {
    const ref = doc(db, "sightings", id);

    await updateDoc(ref, {
      approved: true,
      category: tag,
    });

    setPending(pending.filter((p) => p.id !== id));
  };

  // 🗑️ delete
  const remove = async (id) => {
    if (window.confirm("Supprimer définitivement ?")) {
      const ref = doc(db, "sightings", id);
      await deleteDoc(ref);
      setPending(pending.filter((p) => p.id !== id));
    }
  };

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
  });

  // 🔐 écran login
  if (!isAuthorized) {
    return (
      <div style={{ textAlign: "center", paddingTop: "20vh" }}>
        <h2>Sceau de l'Archiviste</h2>
        <input
          type="password"
          placeholder="Mot de passe..."
          value={passphrase}
          onChange={checkPass}
        />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h2>Archives en attente</h2>
      <p>{pending.length} message(s)</p>

      <div style={{ display: "grid", gap: 20 }}>
        {pending.map((entry) => (
          <div
            key={entry.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              borderRadius: 4,
            }}
          >
            {entry.imageUrl && (
              <img
                src={entry.imageUrl}
                alt=""
                style={{ width: "100%", marginBottom: 10 }}
              />
            )}

            {/* ✏️ édition ou affichage */}
            {editingId === entry.id ? (
              <>
                <textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  style={{ width: "100%", minHeight: 80 }}
                />

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() =>
                      setEditedMessage(`[spoiler]${editedMessage}[/spoiler]`)
                    }
                  >
                    🕶️ Spoiler
                  </button>

                  <button onClick={() => saveEdit(entry.id)}>💾 Save</button>

                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <p>"{renderMessage(entry.message)}"</p>

                <button
                  onClick={() => {
                    setEditingId(entry.id);
                    setEditedMessage(entry.message);
                  }}
                >
                  ✏️ Edit
                </button>
              </>
            )}

            <p>
              — {entry.name} ({entry.email})
            </p>

            {/* actions */}
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => approveWithTag(entry.id, "commission")}
                  style={btnTagStyle("#e3f2fd", "#0d47a1")}
                >
                  🎨 Commission
                </button>
                <button
                  onClick={() => approveWithTag(entry.id, "artbook")}
                  style={btnTagStyle("#f3e5f5", "#4a148c")}
                >
                  📖 Artbook
                </button>
                <button
                  onClick={() => approveWithTag(entry.id, "saigon")}
                  style={btnTagStyle("#f3e5f5", "#4a148c")}
                >
                  🏮 Saigon
                </button>
                <button
                  onClick={() => approveWithTag(entry.id, "print")}
                  style={btnTagStyle("#e8f5e9", "#1b5e20")}
                >
                  🖼️ Print
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  onClick={() => approveWithTag(entry.id)}
                  style={{
                    flex: 2,
                    background: "#1a2a44",
                    color: "#d4af37",
                  }}
                >
                  APPROUVER
                </button>

                <button onClick={() => remove(entry.id)} style={{ flex: 1 }}>
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
