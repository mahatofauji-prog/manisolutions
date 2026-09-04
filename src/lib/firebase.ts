import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const dbId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId;
const dbIdToUse = dbId && dbId !== '(default)' ? dbId : undefined;

let firestoreDb: Firestore;

try {
  firestoreDb = dbIdToUse
    ? initializeFirestore(app, {
        experimentalForceLongPolling: true,
      }, dbIdToUse)
    : initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
} catch (e) {
  firestoreDb = dbIdToUse ? getFirestore(app, dbIdToUse) : getFirestore(app);
}

export const db = firestoreDb;

export function cleanForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}


