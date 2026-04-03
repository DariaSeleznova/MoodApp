// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyAObowASfmc0WRiLV60WO5_HJtoHMJYg_E",
    authDomain: "moodapp-1142d.firebaseapp.com",
    projectId: "moodapp-1142d",
    storageBucket: "moodapp-1142d.firebasestorage.app",
    messagingSenderId: "115804229949",
    appId: "1:115804229949:web:43fab371628a0aab3eb554"
};

export { app, auth, googleProvider };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);