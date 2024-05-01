import { signOut } from "firebase/auth";
import { authentication } from "../config/firebase";

export const logout = async () => {
    localStorage.clear();
    await signOut(authentication);
  };