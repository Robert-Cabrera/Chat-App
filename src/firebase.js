
import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBN-mpKufBBoJCPybULfkxGZuZEUrmK_4o",
  authDomain: "chat-app-2537c.firebaseapp.com",
  projectId: "chat-app-2537c",
  storageBucket: "chat-app-2537c.appspot.com",
  messagingSenderId: "1045675497907",
  appId: "1:1045675497907:web:fa3dffe91fe968fa2113c6",
  measurementId: "G-MEGDNX9QZC"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app);