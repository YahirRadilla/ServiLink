import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCtH36JBTzCsWHwtRt4DiHnUBSHrWmd_90",
  authDomain: "servilink-68398.firebaseapp.com",
  databaseURL: "https://servilink-68398-default-rtdb.firebaseio.com",
  projectId: "servilink-68398",
  storageBucket: "servilink-68398.firebasestorage.app",
  messagingSenderId: "441884552116",
  appId: "1:441884552116:web:f4fd44d1d49797b5df60e1",
};


const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export const db = getFirestore(app);
