export type Prediction = 'Real' | 'Fake' | 'Uncertain';

export interface NewsCheck {
  id: string;
  userId: string;
  content: string;
  prediction: Prediction;
  confidence: number;
  explanation: string;
  language?: string;
  transcription?: string;
  metadata?: {
    source?: string;
    type?: string;
  };
  createdAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Feedback {
  id: string;
  checkId: string;
  userId: string;
  isCorrect: boolean;
  correctedLabel?: string;
  comment?: string;
  createdAt: Date;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}
