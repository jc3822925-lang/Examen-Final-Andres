import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export async function signInWithEmail(email: string, password: string): Promise<Session> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) {
    throw new Error(translateAuthError(error.message));
  }
  if (!data.session) {
    throw new Error('No se pudo iniciar sesión. Intente nuevamente.');
  }
  return data.session;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return null;
  }
  return data.session;
}

function translateAuthError(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.';
  }
  if (msg.includes('email not confirmed')) {
    return 'El correo electrónico aún no ha sido confirmado.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return 'Error de conexión. Verifique su acceso a internet.';
  }
  return message;
}
