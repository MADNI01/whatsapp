import firebase from "firebase";
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
const firebaseConfig = {
  apiKey: "AIzaSyAfV0vCmXCMDpBJUVSVfLTVXYFvZydXFxo",
  authDomain: "whatsapp-96d01.firebaseapp.com",
  projectId: "whatsapp-96d01",
  storageBucket: "whatsapp-96d01.appspot.com",
  messagingSenderId: "250823554587",
  appId: "1:250823554587:web:f8032f20b08d69cedb2abe",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export const auth = firebase.auth()
export const db = firebase.firestore()
export const storage = firebase.storage()
export const provider = new firebase.auth.GoogleAuthProvider()