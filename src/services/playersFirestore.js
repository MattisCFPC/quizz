// src/services/playersFirestore.js
import { db } from "../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";

const playersRef = collection(db, "players");

// Abonnement temps réel
export function subscribePlayers(callback) {
  return onSnapshot(playersRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(data);
  });
}

// Ajouter un joueur avec email et phone
export async function addFullPlayer(name, score, email, phone) {
  await addDoc(playersRef, {
    name,
    score,
    email,
    phone,
    createdAt: new Date()
  });
}

// Optionnel : Ajouter un joueur sans email et phone
export async function addPlayer(name, score) {
  await addDoc(playersRef, {
    name,
    score,
    createdAt: new Date()
  });
}
