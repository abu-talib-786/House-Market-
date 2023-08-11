import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAIM2xj0IgPKIxHrQzSuiq1fjLRu5bno3E",
  authDomain: "house-market-place-f8459.firebaseapp.com",
  projectId: "house-market-place-f8459",
  storageBucket: "house-market-place-f8459.appspot.com",
  messagingSenderId: "819155735731",
  appId: "1:819155735731:web:41b161f9504afbaf1bccc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()