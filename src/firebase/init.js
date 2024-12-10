// firebase/init.js
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAk12WqSD-YvLzkKT3OblcqjSLUF71qdEs",
    authDomain: "sounds-of-life.firebaseapp.com",
    projectId: "sounds-of-life",
    storageBucket: "sounds-of-life.firebasestorage.app",
    messagingSenderId: "509209012765",
    appId: "1:509209012765:web:fd9d7a5abd51c67fc8f4f4",
    measurementId: "G-HJ85SP240N"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };