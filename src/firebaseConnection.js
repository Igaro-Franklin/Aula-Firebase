import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyAbYYGNrtDubIIu_QL7_ixAzj_B4SPeeqs",
    authDomain: "cursosp-b0e82.firebaseapp.com",
    projectId: "cursosp-b0e82",
    storageBucket: "cursosp-b0e82.appspot.com",
    messagingSenderId: "712267453122",
    appId: "1:712267453122:web:fb103381dc2e9e66f4215b",
    measurementId: "G-N9BL1G6SB4"
  };

  const firebaseApp = initializeApp(firebaseConfig);

  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)

  export { db, auth };