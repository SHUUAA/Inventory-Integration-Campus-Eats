import { authentication } from "../firebase/Config";
import { signInWithEmailAndPassword, } from "firebase/auth";
import { logout } from "./Logout";

async function login(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(authentication, email, password);
    const user = userCredential.user

     if (!user.emailVerified) {
      logout();
     throw new Error('Please verify your email before logging in.');
     }
    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; 
  }
}

export default login;
