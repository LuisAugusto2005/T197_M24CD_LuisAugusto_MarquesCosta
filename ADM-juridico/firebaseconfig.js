
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
//import { getFirestore } from 'firebase/firestore';
//import { getAuth } from 'firebase/auth';
//import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAEQ7yYkQcPLCZ9qejSmlsljCDlnSQbHwI",
    authDomain: "dadosaplicacaojuridica.firebaseapp.com",
    databaseURL: "https://dadosaplicacaojuridica-default-rtdb.firebaseio.com",
    projectId: "dadosaplicacaojuridica",
    storageBucket: "dadosaplicacaojuridica.firebasestorage.app",
    messagingSenderId: "210906460406",
    appId: "1:210906460406:web:3693096eb54671ab1bfcd7"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
//const auth = getAuth(app);
//const storage = getStorage(app);

export { app, db };