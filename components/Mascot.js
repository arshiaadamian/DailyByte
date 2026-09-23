// Ways of placing Daisy on screen.
// The artwork is transparent and trimmed close to her outline, so she can sit
// directly on any surface - no panel, no circular crop.
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, font, space } from '../style/theme';
import { FadeIn } from './Motion';

// Aspect ratio comes from the asset itself, so re-exporting the artwork at a
// different size or crop can never leave a stale hard-coded number behind.
function ratioOf(source) {
  const meta = Image.resolveAssetSource(source);
  return meta && meta.height ? meta.width / meta.height : 1;
}

// Daisy, sized by height. Width follows her own proportions.
export function Daisy({ source, height, style, flip = false, ...rest }) {
  const width = height * ratioOf(source);
  return (
    <Image
      source={source}
      resizeMode="contain"
      style={[
        { width, height },
        flip && { transform: [{ scaleX: -1 }] },
        style,
      ]}
      {...rest}
    />
  );
}

// Daisy sitting on the top edge of the element that follows her.
// She stays in normal flow and a negative bottom margin pulls that element up
// over her feet, so the card paints across her paws and she reads as sitting
// behind it. No absolute offsets, so nothing to clip on Android and no
// padding-box ambiguity.
export function DaisyPerch({ source, height, overlap = 12, style }) {
  return (
    <Daisy
      source={source}
      height={height}
      style={[styles.perch, { marginBottom: -overlap }, style]}
      pointerEvents="none"
    />
  );
}

// Daisy plus a line of copy, for empty and error states.
export function MascotMessage({ source, title, caption, height = 200, delay = 0 }) {
  return (
    <FadeIn delay={delay} style={styles.message}>
      <Daisy source={source} height={height} style={styles.messageArt} />
      <Text style={styles.messageTitle}>{title}</Text>
      {caption ? <Text style={styles.messageCaption}>{caption}</Text> : null}
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  perch: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  message: {
    alignItems: 'center',
    paddingHorizontal: space.xl,
  },
  messageArt: {
    marginBottom: space.md,
  },
  messageTitle: {
    fontFamily: font.bold,
    fontSize: 23,
    lineHeight: 31,
    letterSpacing: -0.3,
    color: colors.ink,
    textAlign: 'center',
  },
  messageCaption: {
    fontFamily: font.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: space.xs,
  },
});
