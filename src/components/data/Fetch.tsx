import { useState } from "react";
import { authentication, database } from "../../firebase/Config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, where, query } from "firebase/firestore";

const DataFetch = () => {
  const [userData, setUserData] = useState({});

  onAuthStateChanged(authentication, async (user) => {
    if (user) {
      const userRef = collection(database, "users");
      const q = query(userRef, where("email", "==", user.email));
      const snapshot = await getDocs(q);

      const userDoc = snapshot.docs[0]; // Assuming only one matching document
      if (userDoc) {
        setUserData(userDoc.data());
      } else {
        setUserData(""); // User document not found
      }
    } else {
      setUserData("");
    }
  });

  return userData;
};

export default DataFetch;
