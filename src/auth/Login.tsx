import { authentication } from "../config/firebase";
import { signInWithEmailAndPassword, } from "firebase/auth";

async function login(email: string, password: string) {
        try {
          const userCredential = await signInWithEmailAndPassword(authentication, email, password);
          
          // Check if the user's email is verified
         // if (!user.emailVerified) {
           // throw new Error('Please verify your email before logging in.');
         // }
      
          return userCredential.user;
        } catch (error) {
          console.error("Error logging in:", error);
          throw error; // re-throw the error to propagate it to the caller
        }
      }

export default login;