import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "../config/firebase";

export const useAuthState = (callback: (user: User | null) => void) => {
    onAuthStateChanged(authentication, callback);
  };