import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAOVC12T1IRbiBpF7F7xN0Q61nznSyuh7g",

  authDomain: "worldmaps-game.firebaseapp.com",

  projectId: "worldmaps-game",

  storageBucket: "worldmaps-game.appspot.com",

  messagingSenderId: "692759015609",

  appId: "1:692759015609:web:0a5924edd8aeb62d97ab68",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
