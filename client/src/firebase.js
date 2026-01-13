import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHvftNrs4NsJDK2_uVFpbdCCpXagNhS5I",
  authDomain: "property-hub-d2e68.firebaseapp.com",
  projectId: "property-hub-d2e68",
  messagingSenderId: "802296754508",
  appId: "1:802296754508:web:af02d9afdcbd115e695fe9",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
