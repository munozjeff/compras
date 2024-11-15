// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDWHHE317d13rLY3MfIJ-Df8-HhyHnuur4",
    authDomain: "compras-48f90.firebaseapp.com",
    projectId: "compras-48f90",
    storageBucket: "compras-48f90.firebasestorage.app",
    messagingSenderId: "799571262440",
    appId: "1:799571262440:web:b249ba6368d98d9e71025d"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
