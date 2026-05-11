import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {initializeFirestore, doc, getDocFromServer} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore to set experimentalAutoDetectLongPolling for better connectivity in restricted environments
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  ignoreUndefinedProperties: true,
}, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();

export let isFirestoreReady = false;

async function testConnection() {
  // Wait a bit to ensure network is fully initialized in the environment
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Attempting to reach the server to verify connectivity
    await getDocFromServer(doc(db, 'test', 'connection'));
    isFirestoreReady = true;
    console.log("Firestore connection verified.");
  } catch (error: any) {
    if (error?.message?.includes('the client is offline') || error?.code === 'unavailable') {
      console.warn("Firestore appears to be offline or unreachable. It may still be provisioning.");
    } else {
      console.error("Firestore connectivity issue:", error);
    }
  }
}

// Only test connection once, quietly
testConnection();
