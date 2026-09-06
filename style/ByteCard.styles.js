import { StyleSheet } from 'react-native';
import { colors, font, radius, shadow, space } from './theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
    width: '100%',
    ...shadow.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topicChip: {
    backgroundColor: colors.brandSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  topicText: {
    fontFamily: font.bold,
    fontSize: 11,
    letterSpacing: 1.3,
    textTransform: 'uppercase',
    color: colors.brand,
  },
  date: {
    fontFamily: font.regular,
    fontSize: 13,
    letterSpacing: 0.6,
    color: colors.inkFaint,
    marginLeft: space.sm,
  },
  // Short editorial rule under the chip row, the card's only hard accent.
  rule: {
    width: 34,
    height: 2,
    borderRadius: 2,
    backgroundColor: colors.brand,
    marginTop: space.md,
    marginBottom: space.sm,
  },
  title: {
    fontFamily: font.bold,
    fontSize: 27,
    lineHeight: 34,
    letterSpacing: -0.3,
    color: colors.ink,
    marginBottom: space.sm,
  },
  body: {
    fontFamily: font.regular,
    fontSize: 18,
    lineHeight: 30,
    color: colors.inkSoft,
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginTop: space.lg,
  },
  source: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: space.sm,
    paddingRight: space.sm,
  },
  sourcePressed: {
    opacity: 0.55,
  },
  sourceText: {
    fontFamily: font.bold,
    fontSize: 15,
    letterSpacing: 0.2,
    color: colors.brand,
  },
  sourceArrow: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.brand,
    marginLeft: space.xs,
  },
});

export default styles;
