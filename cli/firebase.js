import admin from "firebase-admin";
admin.initializeApp({
  credential: admin.credential.cert("./admin.json"),
  databaseURL: "https://test-6c980-default-rtdb.asia-southeast1.firebasedatabase.app"
});
export const db = admin.firestore();
