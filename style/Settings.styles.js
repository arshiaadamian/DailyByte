import { StyleSheet } from "react-native";
import { colors, eyebrow, font, radius, shadow, space, NAV_CLEARANCE } from "./theme";

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    paddingHorizontal: space.lg,
    paddingTop: 68,
    paddingBottom: NAV_CLEARANCE,
    flexGrow: 1,
  },
  // Header row pairing the title with a Daisy pose.
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.lg,
  },
  eyebrow: {
    ...eyebrow,
    marginBottom: 2,
  },
  banner: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    zIndex: 10,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...shadow.card,
  },
  bannerSuccess: {
    backgroundColor: colors.successSoft,
  },
  bannerError: {
    backgroundColor: colors.dangerSoft,
  },
  bannerText: {
    fontFamily: font.regular,
    fontSize: 15,
  },
  bannerTextSuccess: {
    color: colors.success,
  },
  bannerTextError: {
    color: '#7A241C',
  },
  heading: {
    fontFamily: font.bold,
    fontSize: 34,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  // `card.backgroundColor` is also read directly as the dropdown's active
  // row colour, so it doubles as the soft brand highlight.
  card: {
    backgroundColor: colors.brandSoft,
    borderRadius: radius.md,
    padding: space.md,
    marginTop: 'auto',
    marginBottom: 12,
  },
  label: {
    ...eyebrow,
    marginBottom: 4,
  },
  value: {
    fontFamily: font.bold,
    fontSize: 18,
    color: colors.ink,
  },
  signOutArea: {
    marginTop: 0,
  },
  button: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingVertical: 16,
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
  section: {
    marginTop: space.lg,
  },
  sectionTitle: {
    fontFamily: font.bold,
    fontSize: 22,
    letterSpacing: -0.3,
    color: colors.ink,
    marginBottom: space.md,
  },
  fieldGroup: {
    marginBottom: space.md,
  },
  fieldLabel: {
    ...eyebrow,
    marginBottom: 8,
  },
  dropdown: {
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    height: 52,
  },
  dropdownPlaceholder: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.inkFaint,
  },
  dropdownSelectedText: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.ink,
  },
  dropdownContainer: {
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    borderColor: colors.line,
    borderWidth: 1,
    overflow: 'hidden',
  },
  dropdownItemText: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.ink,
  },
  saveButton: {
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.xs,
    marginBottom: space.sm,
    ...shadow.soft,
  },
  saveButtonText: {
    fontFamily: font.bold,
    fontSize: 17,
    letterSpacing: 0.3,
    color: colors.onBrand,
  },
  // Delivery-time rows, matching Onboarding.styles.js so Settings looks consistent
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
});

export default styles;
