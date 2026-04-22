import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAaPIoTXn09_uYHdrCi0XS3P4nnCSzMbEM",
  authDomain: "crop-companion-ee589.firebaseapp.com",
  projectId: "crop-companion-ee589",
  storageBucket: "crop-companion-ee589.firebasestorage.app",
  messagingSenderId: "261559538656",
  appId: "1:261559538656:web:f8c145231d8c2672c3d185",
  measurementId: "G-7WQ4S23KC5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);