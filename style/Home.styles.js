import { StyleSheet } from "react-native";
import { colors, eyebrow, font, radius, shadow, space, NAV_CLEARANCE } from "./theme";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: 68,
    paddingBottom: space.sm,
  },
  eyebrow: {
    ...eyebrow,
    marginBottom: 2,
  },
  mastheadTitle: {
    fontFamily: font.bold,
    fontSize: 34,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: space.lg,
    paddingBottom: NAV_CLEARANCE,
  },
  byteSurface: {
    width: '100%',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: NAV_CLEARANCE,
  },
  skeleton: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    ...shadow.card,
  },
  skeletonBar: {
    height: 14,
    borderRadius: radius.sm,
    backgroundColor: colors.paperSunk,
    marginBottom: 12,
    width: '100%',
  },
  skeletonChip: {
    width: 104,
    height: 22,
    borderRadius: radius.pill,
    marginBottom: 22,
  },
});

export default styles;
