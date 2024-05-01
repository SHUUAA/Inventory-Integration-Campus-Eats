import { useState, useEffect } from 'react';
import { authentication, database } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, where, query } from 'firebase/firestore';


export function DataFetch() {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      onAuthStateChanged(authentication, async (user) => {
        if (user) {
          const userRef = collection(database, 'users');
          const q = query(userRef, where('email', '==', user.email));
          const snapshot = await getDocs(q);

          // Extract the 'type' field:
          const userDoc = snapshot.docs[0]; // Assuming only one matching document
          if (userDoc) {
            setUserType(userDoc.data().type);
          } else {
            setUserType(null); // User document not found
          }
        } else {
          setUserType(null);
        }
      });
    };

    fetchUserData();
  }, []);
  return userType;
}



export default DataFetch; 
