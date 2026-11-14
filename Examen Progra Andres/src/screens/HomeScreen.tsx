import { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PhotoPreview } from '../components/PhotoPreview';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { pickImageFromGallery, takePhotoWithCamera, type PickedImage } from '../services/imageService';
import { colors } from '../theme/colors';

export function HomeScreen() {
  const { user, signOut } = useAuth();
  const [image, setImage] = useState<PickedImage | null>(null);
  const [busy, setBusy] = useState<'gallery' | 'camera' | 'logout' | null>(null);

  const handleGallery = async () => {
    setBusy('gallery');
    try {
      const picked = await pickImageFromGallery();
      if (picked) setImage(picked); // reemplaza la fotografía actual
    } catch {
      Alert.alert('Error', 'No se pudo abrir la galería.');
    } finally {
      setBusy(null);
    }
  };

  const handleCamera = async () => {
    setBusy('camera');
    try {
      const photo = await takePhotoWithCamera();
      if (photo) setImage(photo); // reemplaza la fotografía actual
    } catch {
      Alert.alert('Error', 'No se pudo abrir la cámara. Verifique que el dispositivo tenga una cámara disponible.');
    } finally {
      setBusy(null);
    }
  };

  const handleRemove = () => {
    if (Platform.OS === 'web') {
      setImage(null);
      return;
    }
    Alert.alert('Eliminar fotografía', '¿Desea quitar la fotografía de la vista previa?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setImage(null) },
    ]);
  };

  const handleSignOut = async () => {
    setBusy('logout');
    try {
      await signOut();
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'No se pudo cerrar la sesión.');
      setBusy(null);
    }
  };

  const hasImage = image !== null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.flex}>
            <Text style={styles.greeting}>Bienvenido 👋</Text>
            <Text style={styles.email} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
          <PrimaryButton
            testID="logout-button"
            title="Cerrar sesión"
            variant="outline"
            onPress={handleSignOut}
            loading={busy === 'logout'}
            style={styles.logout}
          />
        </View>

        <Text style={styles.sectionTitle}>Fotografía</Text>
        <PhotoPreview image={image} />

        {hasImage && image && (
          <Text style={styles.meta}>
            Resolución: {image.width} × {image.height}px
          </Text>
        )}

        <View style={styles.actions}>
          <PrimaryButton
            testID="gallery-button"
            title={hasImage ? '🖼️  Cambiar desde galería' : '🖼️  Seleccionar de galería'}
            onPress={handleGallery}
            loading={busy === 'gallery'}
            disabled={busy !== null}
          />
          <PrimaryButton
            testID="camera-button"
            title={hasImage ? '📷  Tomar otra fotografía' : '📷  Tomar fotografía'}
            variant="secondary"
            onPress={handleCamera}
            loading={busy === 'camera'}
            disabled={busy !== null}
          />
          {hasImage && (
            <PrimaryButton
              testID="remove-button"
              title="🗑️  Eliminar fotografía"
              variant="danger"
              onPress={handleRemove}
              disabled={busy !== null}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: colors.text },
  email: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  logout: { minHeight: 40, paddingHorizontal: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  meta: { marginTop: 8, fontSize: 13, color: colors.textMuted, textAlign: 'center' },
  actions: { marginTop: 24, gap: 12 },
});
