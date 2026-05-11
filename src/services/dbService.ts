import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  FirestoreError,
  Timestamp
} from 'firebase/firestore';
import {db, auth} from '../lib/firebase';
import {NewsCheck, Feedback, OperationType, FirestoreErrorInfo} from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function saveNewsCheck(data: any): Promise<string> {
  const path = 'newsChecks';
  try {
    const docRef = await addDoc(collection(db, path), {
      ...data,
      userId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return '';
  }
}

export async function getUserHistory(): Promise<NewsCheck[]> {
  const path = 'newsChecks';
  if (!auth.currentUser) return [];
  
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as NewsCheck;
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function submitFeedback(feedback: Omit<Feedback, 'id' | 'userId' | 'createdAt'>): Promise<void> {
  const path = 'feedback';
  try {
    await addDoc(collection(db, path), {
      ...feedback,
      userId: auth.currentUser?.uid,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
