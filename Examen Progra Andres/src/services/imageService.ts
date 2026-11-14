import * as ImagePicker from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export type PickedImage = {
  uri: string;
  width: number;
  height: number;
};

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [4, 3],
  quality: 0.8,
};

function showPermissionDeniedAlert(resource: string, canAskAgain: boolean) {
  Alert.alert(
    'Permiso requerido',
    canAskAgain
      ? `Se necesita acceso a ${resource} para continuar.`
      : `El acceso a ${resource} fue denegado. Habilítelo desde la configuración del dispositivo.`,
    canAskAgain
      ? [{ text: 'Entendido' }]
      : [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
        ]
  );
}

/** Verifica (y si es necesario solicita) el permiso de la cámara. */
export async function ensureCameraPermission(): Promise<boolean> {
  const current = await ImagePicker.getCameraPermissionsAsync();
  if (current.granted) return true;

  const requested = await ImagePicker.requestCameraPermissionsAsync();
  if (requested.granted) return true;

  showPermissionDeniedAlert('la cámara', requested.canAskAgain);
  return false;
}

/** Verifica (y si es necesario solicita) el permiso de la galería. */
export async function ensureMediaLibraryPermission(): Promise<boolean> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (current.granted) return true;

  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (requested.granted) return true;

  showPermissionDeniedAlert('la galería', requested.canAskAgain);
  return false;
}

function toPickedImage(result: ImagePicker.ImagePickerResult): PickedImage | null {
  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }
  const asset = result.assets[0];
  return { uri: asset.uri, width: asset.width, height: asset.height };
}

/** Abre la galería y devuelve la imagen seleccionada, o null si se canceló. */
export async function pickImageFromGallery(): Promise<PickedImage | null> {
  const allowed = await ensureMediaLibraryPermission();
  if (!allowed) return null;

  const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
  return toPickedImage(result);
}

/** Abre la cámara y devuelve la fotografía capturada, o null si se canceló. */
export async function takePhotoWithCamera(): Promise<PickedImage | null> {
  const allowed = await ensureCameraPermission();
  if (!allowed) return null;

  const result = await ImagePicker.launchCameraAsync(pickerOptions);
  return toPickedImage(result);
}
