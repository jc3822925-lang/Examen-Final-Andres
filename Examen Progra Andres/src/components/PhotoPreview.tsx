import { Image, StyleSheet, Text, View } from 'react-native';
import type { PickedImage } from '../services/imageService';
import { colors } from '../theme/colors';

type Props = {
  image: PickedImage | null;
};

export function PhotoPreview({ image }: Props) {
  if (!image) {
    return (
      <View style={[styles.container, styles.empty]} testID="photo-empty">
        <Text style={styles.emptyIcon}>📷</Text>
        <Text style={styles.emptyText}>No hay ninguna fotografía seleccionada</Text>
        <Text style={styles.emptyHint}>Seleccione una desde la galería o capture una con la cámara.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="photo-preview">
      <Image source={{ uri: image.uri }} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    padding: 20,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  emptyHint: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
