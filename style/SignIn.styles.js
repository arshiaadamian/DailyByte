import { StyleSheet } from 'react-native';
import { colors, eyebrow, font, radius, shadow, space } from './theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 26,
  },
  // Daisy sits above the wordmark on the sign-in screen.
  brandMark: {
    alignSelf: 'center',
    marginBottom: space.md,
  },
  heading: {
    fontFamily: font.bold,
    fontSize: 34,
    letterSpacing: -0.5,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 4,
  },
  subheading: {
    fontFamily: font.regular,
    fontSize: 18,
    color: colors.inkSoft,
    textAlign: 'center',
    marginBottom: space.xl,
  },
  label: {
    ...eyebrow,
    marginBottom: 8,
    marginTop: 18,
  },
  input: {
    fontFamily: font.regular,
    fontSize: 17,
    color: colors.ink,
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  error: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.danger,
    marginTop: 16,
  },
  success: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.success,
    marginTop: 16,
  },
  passwordRow: {
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 44,
  },
  eyeButton: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 30,
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  buttonPressed: {
    backgroundColor: colors.brandDeep,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: font.bold,
    fontSize: 17,
    letterSpacing: 0.3,
    color: colors.onBrand,
  },
  resendButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonPressed: {
    opacity: 0.55,
  },
  resendButtonText: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.brand,
  },
});

export default styles;
