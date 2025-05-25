'use client';

import { useState, useEffect, useContext, createContext, type ReactNode } from 'react';
import { type User, onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, type UserCredential } from 'firebase/auth';
import { auth, googleAuthProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean; // Indicates if initial auth check is complete
  signInWithGoogle: () => Promise<UserCredential | void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const signInWithGoogle = async () => {
    // setLoading(true); // Handled by onAuthStateChanged or component-specific loading
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      toast({ title: 'Signed In', description: `Welcome, ${result.user.displayName || 'User'}!` });
      return result;
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({ 
        title: 'Sign In Error', 
        description: error.code === 'auth/popup-closed-by-user' ? 'Sign-in popup closed before completion.' : error.message || 'Could not sign in with Google.', 
        variant: 'destructive' 
      });
    }
  };

  const signOutUser = async () => {
    // setLoading(true); // Handled by onAuthStateChanged
    try {
      await firebaseSignOut(auth);
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({ title: 'Sign Out Error', description: error.message || 'Could not sign out.', variant: 'destructive' });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};