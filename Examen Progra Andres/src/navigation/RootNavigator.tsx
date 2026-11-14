import { useAuth } from '../context/AuthContext';
import { HomeScreen } from '../screens/HomeScreen';
import { LoadingScreen } from '../screens/LoadingScreen';
import { LoginScreen } from '../screens/LoginScreen';

/**
 * Protege la pantalla principal: solo se muestra cuando existe una sesión válida.
 * Mientras se recupera la sesión guardada se muestra una pantalla de carga.
 */
export function RootNavigator() {
  const { session, initializing } = useAuth();

  if (initializing) {
    return <LoadingScreen />;
  }

  return session ? <HomeScreen /> : <LoginScreen />;
}
