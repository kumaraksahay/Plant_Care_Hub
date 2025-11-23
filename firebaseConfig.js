// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

// // TODO: Replace the following with your app's Firebase project configuration
// // See: https://firebase.google.com/docs/web/learn-more#config-object
// const firebaseConfig = {
//         apiKey: "AIzaSyBS1CkM-2qPQYmw4dyqqLDeDxdcitGPGyg",
//         authDomain: "plantpal-505af.firebaseapp.com",
//         projectId: "plantpal-505af",
//         storageBucket: "plantpal-505af.firebasestorage.app",
//         messagingSenderId: "40008911862",
//         appId: "1:40008911862:web:8008e108f6a920a63495d7",
//         measurementId: "G-SKVEG4L7WJ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


// // Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);





// import { initializeApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// // Your Firebase configuration object
// const firebaseConfig = {
//         apiKey: "AIzaSyBS1CkM-2qPQYmw4dyqqLDeDxdcitGPGyg",
//         authDomain: "plantpal-505af.firebaseapp.com",
//         projectId: "plantpal-505af",
//         storageBucket: "plantpal-505af.firebasestorage.app",
//         messagingSenderId: "40008911862",
//         appId: "1:40008911862:web:8008e108f6a920a63495d7",
//         measurementId: "G-SKVEG4L7WJ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Auth with AsyncStorage persistence
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

// // Initialize Firestore
// const db = getFirestore(app);

// // Export the initialized instances
// export { app, auth, db };



// firebaseConfig.js


// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
        apiKey: "AIzaSyBS1CkM-2qPQYmw4dyqqLDeDxdcitGPGyg",
        authDomain: "plantpal-505af.firebaseapp.com",
        projectId: "plantpal-505af",
        storageBucket: "plantpal-505af.firebasestorage.app",
        databaseURL: "https://plantpal-505af-default-rtdb.firebaseio.com/",
        messagingSenderId: "40008911862",
        appId: "1:40008911862:web:8008e108f6a920a63495d7",
        measurementId: "G-SKVEG4L7WJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage =getStorage(app);
const db1 = getDatabase(app);

export {auth,db,storage,db1};

// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(ReactNativeAsyncStorage)
//   });

