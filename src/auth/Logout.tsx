import { signOut } from "firebase/auth";
import { authentication } from "../firebase/Config";

export const logout = async () => {
    localStorage.clear();
    await signOut(authentication);
  };