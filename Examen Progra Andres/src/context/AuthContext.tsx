import type { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { getCurrentSession, signInWithEmail, signOut as signOutService } from '../services/authService';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Recupera la sesión persistida en AsyncStorage al abrir la app.
    getCurrentSession().then((stored) => {
      if (!mounted) return;
      setSession(stored);
      setInitializing(false);
    });

    // Escucha cambios: inicio de sesión, cierre de sesión y renovación de token.
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      initializing,
      signIn: async (email, password) => {
        const newSession = await signInWithEmail(email, password);
        setSession(newSession);
      },
      signOut: async () => {
        await signOutService();
        setSession(null);
      },
    }),
    [session, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
