// // Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD5DB8L2EeuZ54E7vhoREBjF-r2r9HVFJc",
//   authDomain: "arsonasentinel.firebaseapp.com",
//   projectId: "arsonasentinel",
//   storageBucket: "arsonasentinel.firebasestorage.app",
//   messagingSenderId: "768241820640",
//   appId: "1:768241820640:web:b688b5a48ff6bebf5f8185",
//   measurementId: "G-9L502DJ3YV",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// utils/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD5DB8L2EeuZ54E7vhoREBjF-r2r9HVFJc",
  authDomain: "arsonasentinel.firebaseapp.com",
  projectId: "arsonasentinel",
  storageBucket: "arsonasentinel.firebasestorage.app",
  messagingSenderId: "768241820640",
  appId: "1:768241820640:web:b688b5a48ff6bebf5f8185",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
