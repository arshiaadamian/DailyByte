import { StyleSheet } from "react-native";
import { colors, eyebrow, font, radius, shadow, space, NAV_CLEARANCE } from "./theme";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: 68,
    paddingBottom: space.lg,
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
  listContent: {
    paddingHorizontal: space.lg,
    paddingBottom: NAV_CLEARANCE,
    gap: space.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: NAV_CLEARANCE,
  },
  empty: {
    paddingTop: space.xxl,
    alignItems: 'center',
  },
  skeletonCard: {
    height: 168,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: space.md,
    ...shadow.soft,
  },
});

export default styles;
