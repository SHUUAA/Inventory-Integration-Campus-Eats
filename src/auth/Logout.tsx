import { signOut } from "firebase/auth";
import { authentication } from "../config/firebase";

export const logout = async () => {
    await signOut(authentication);
  };