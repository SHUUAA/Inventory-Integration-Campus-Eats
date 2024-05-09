import { authentication } from "../config/firebase";
import { database } from "../config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

async function signup(email: string, password: string, firstName: string, lastName: string, type: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(authentication, email, password);
    updateProfile(userCredential.user, { displayName: firstName + " " + lastName });
    await addDoc(collection(database, "users"), {
      firstName: firstName,
      lastName: lastName,
      email: email,
      type: type,
      bio: "",
      createdOn: Timestamp.now(),
    });
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('The email address is already in use by another account.');
    } else {
      throw error;
    }
  }
}

export default signup;
