import React, { createContext, useState, useEffect } from 'react';
import { useAuthState } from './AuthState'; // Your authentication functions file

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true, // Initially we are checking the auth state
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
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
