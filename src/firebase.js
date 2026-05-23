import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBdriAdMX7C763wro60zYFGfXfXQE27q-g",
  authDomain: "darul-noor-education-hub.firebaseapp.com",
  projectId: "darul-noor-education-hub",
  storageBucket: "darul-noor-education-hub.firebasestorage.app",
  messagingSenderId: "706880553337",
  appId: "1:706880553337:web:5fb2eee4d75f2c7cab2fa8"
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export { doc, setDoc, onSnapshot };
