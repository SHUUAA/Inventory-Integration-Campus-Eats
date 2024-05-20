//@ts-nocheck
import { onAuthStateChanged } from "firebase/auth";
import { authentication } from "../firebase/Config";

export const useAuthState = (callback: (user: User | undefined) => void) => {
    onAuthStateChanged(authentication, callback);
  };