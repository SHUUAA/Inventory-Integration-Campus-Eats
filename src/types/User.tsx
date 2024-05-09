export interface User {
    displayName: string;
    uid: string;
    email: string;
    phoneNumber?: string;
    photoURL?: string;
    emailVerified: boolean;
    metadata: {
      creationTime: string;
      lastSignInTime: string;
    };
  }