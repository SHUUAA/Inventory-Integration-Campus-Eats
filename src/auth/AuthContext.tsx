import React, { createContext, useState, useEffect } from 'react';
import { useAuthState } from './AuthState'; // Your authentication functions file
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | undefined;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  loading: true, // Initially we are checking the auth state
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: undefined,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = useAuthState((user) => {
      setAuthState({ user, loading: false });
    });

    return unsubscribe; // Clean up the listener
  }, []);

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};
