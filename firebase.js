import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBDVDHMn81lz6VR5x_CvnXkd8iIRNQ_Xcs",
  authDomain: "image-community-9eaff.firebaseapp.com",
  projectId: "image-community-9eaff",
  storageBucket: "image-community-9eaff.appspot.com",
  messagingSenderId: "1013791043630",
  appId: "1:1013791043630:web:11a54bf7120b7fff48efbf",
  measurementId: "G-Q0XCHMQ11Q"
  };

  firebase.initializeApp(firebaseConfig);

  const apiKey = firebaseConfig.apiKey;
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  const storage = firebase.storage();
  
  export{auth, apiKey, firestore, storage};