import { StyleSheet } from 'react-native';
import { colors, eyebrow, font, radius, shadow, space } from './theme';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 72,
  },
  // Only the welcome screen uses this. Taking the leftover space and centring
  // in it keeps Daisy optically centred instead of leaving a dead gap above
  // the buttons on taller phones.
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Daisy floats free on the welcome screen - no panel behind her.
  heroArt: {
    marginBottom: space.md,
  },
  heading: {
    fontFamily: font.bold,
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -0.8,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 14,
  },
  subheading: {
    fontFamily: font.regular,
    fontSize: 18,
    lineHeight: 28,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  actions: {
    width: '86%',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingVertical: 19,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  primaryButtonPressed: {
    backgroundColor: colors.brandDeep,
  },
  primaryButtonDisabled: {
    backgroundColor: colors.canvasDeep,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    fontFamily: font.bold,
    fontSize: 17,
    letterSpacing: 0.3,
    color: colors.onBrand,
  },
  resendButton: {
    marginTop: 14,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonPressed: {
    opacity: 0.55,
  },
  resendButtonText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.inkSoft,
    paddingBottom: 20,
  },

  // --- Step screens (topic / schedule / notification) ---
  scheduleTop: {
    width: '100%',
  },
  // Header row that pairs the step's heading with a Daisy pose.
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.md,
  },
  stepHeaderText: {
    flex: 1,
    paddingRight: space.md,
  },
  stepEyebrow: {
    ...eyebrow,
    marginBottom: 4,
  },
  stepCaption: {
    fontFamily: font.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.inkSoft,
    marginBottom: 4,
  },
  progressTrack: {
    flexDirection: 'row',
    width: '100%',
    height: 4,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.canvasDeep,
    marginBottom: 28,
  },
  progressFill: {
    width: '55%',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
  },
  scheduleHeading: {
    fontFamily: font.bold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: colors.ink,
    textAlign: 'left',
    marginBottom: 8,
  },
  sectionLabel: {
    ...eyebrow,
    marginBottom: 10,
    marginTop: 6,
  },
  byteSelector: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.canvasDeep,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: 24,
  },
  byteOption: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  byteOptionSelected: {
    backgroundColor: colors.paper,
    ...shadow.soft,
  },
  byteOptionText: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.inkSoft,
  },
  byteOptionTextSelected: {
    fontFamily: font.bold,
    color: colors.ink,
  },
  deliveryRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    ...shadow.soft,
  },
  deliveryRowLabel: {
    fontFamily: font.bold,
    fontSize: 16,
    color: colors.ink,
  },
  deliveryRowValue: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.brand,
  },
  lockedRow: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.canvasDeep,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  lockedRowText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.inkFaint,
  },
  topicRow: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  topicList: {
    marginTop: 14,
  },
  // FadeIn wraps each pill, so the cell carries the column width and the
  // pill fills it.
  topicCell: {
    width: '48%',
  },
  topicPill: {
    width: '100%',
    backgroundColor: colors.paper,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 13,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicPillSelected: {
    backgroundColor: colors.brand,
    borderColor: colors.brand,
    ...shadow.soft,
  },
  topicPillText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  topicPillTextSelected: {
    fontFamily: font.bold,
    color: colors.onBrand,
  },

  // Daisy perched on a form field: tucked closer to the right edge than the
  // default perch, and given a little breathing room under the label.
  fieldMascot: {
    marginRight: 14,
    marginTop: 2,
  },

  // --- Notification step ---
  notificationTop: {
    width: '100%',
  },
  notificationHeading: {
    fontFamily: font.bold,
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.6,
    color: colors.ink,
    marginBottom: 12,
  },
  notificationSubheading: {
    fontFamily: font.regular,
    fontSize: 18,
    lineHeight: 27,
    color: colors.inkSoft,
    marginBottom: 26,
  },
  // The stage takes whatever vertical room is left over, so the mockup scales
  // to the device instead of being pinned to one hard-coded height.
  // A row, so the banner and Daisy each occupy their own width instead of her
  // being layered on top of it. alignItems centres her against the banner.
  notificationStage: {
    width: '100%',
    marginTop: 6,
    marginBottom: 42,
  },
  // Keeps the source image's own proportions. The fill is sampled from the
  // artwork's own corners so the shadow has a solid rounded shape to cast from
  // (an iOS shadow on a transparent view renders nothing) without showing a
  // seam against the image.
  notificationBanner: {
    width: '100%',
    aspectRatio: 1080 / 344,
    borderRadius: 20,
    backgroundColor: '#584E49',
    ...shadow.lifted,
  },
  notificationBannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  // She grips an edge on her left and leans right, so she hooks over the
  // preview's right side. Her artwork carries ~27% empty space on its right,
  // which this offset accounts for - her visible body clears the card's text
  // column and only crosses the empty right end of the banner.
  // Offsets are relative to the mockup, and the bottom is a percentage so she
  // stays beside the notification whatever height the phone ends up.
  // Daisy and the caption sit side by side under the banner.
  notificationFooter: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  // She grips an edge on her left, so bleeding her past the screen's padding
  // makes that edge read as the side of the screen. The negative right margin
  // reclaims the ~27% of empty space her artwork carries on that side, so it
  // doesn't steal width from the caption.
  notificationPeek: {
    marginLeft: -34,
    marginRight: -22,
  },
  // Daisy occupies 100 - 34 - 22 = 44pt of the row. Without an equal spacer on
  // the far side the caption centres in what's left over and drifts right by
  // her share; this balances the row so it centres on the screen instead.
  // Keep this in step with the <Daisy> height and the margins above.
  notificationFooterSpacer: {
    width: 44,
  },
  notificationCaption: {
    flex: 1,
    fontFamily: font.regular,
    fontSize: 16,
    lineHeight: 25,
    color: colors.inkSoft,
    textAlign: 'center',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: radius.pill,
    paddingVertical: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.brand,
    marginTop: 10,
  },
  secondaryButtonPressed: {
    opacity: 0.55,
  },
  secondaryButtonText: {
    fontFamily: font.bold,
    fontSize: 17,
    color: colors.brand,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 20,
  },
  backButtonPressed: {
    opacity: 0.55,
  },
  backButtonText: {
    fontFamily: font.regular,
    fontSize: 14,
    color: colors.inkSoft,
  },

  // --- Sign up / auth form ---
  signUpScreen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 72,
  },
  signUpHeading: {
    fontFamily: font.bold,
    fontSize: 32,
    letterSpacing: -0.5,
    color: colors.ink,
    marginBottom: 4,
  },
  signUpSubheading: {
    fontFamily: font.regular,
    fontSize: 18,
    color: colors.inkSoft,
    marginBottom: 28,
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
  signUpLinkText: {
    fontFamily: font.regular,
    fontSize: 15,
    color: colors.brand,
  },
});

export default styles;
