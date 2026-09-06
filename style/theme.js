// Shared design tokens for DailyByte.
// Purely visual - nothing here knows about data, navigation or state.

export const colors = {
  // Backdrops
  canvas: '#E1DED3',       // the warm greige the whole app sits on
  canvasDeep: '#D5D0C0',   // one step down, for tracks and wells

  // Surfaces. `paper` is sampled from the Daisy artwork background (#FEFBF1),
  // so a mascot placed on a paper surface has no visible edge.
  paper: '#FEFBF1',
  paperSunk: '#F5F0E2',

  // Hairlines
  line: 'rgba(47, 46, 44, 0.07)',
  lineStrong: 'rgba(47, 46, 44, 0.13)',

  // Text
  ink: '#2F2E2C',
  inkSoft: '#5A5546',
  inkFaint: '#8C8474',
  onBrand: '#FBF6EC',

  // Brand
  brand: '#816148',
  brandDeep: '#674C36',
  brandSoft: '#EFE5D6',

  // Status
  danger: '#B3261E',
  dangerSoft: '#F3D9D6',
  success: '#3D6B4F',
  successSoft: '#DCE9DD',
};

export const font = {
  regular: 'Newsreader_400Regular',
  bold: 'Newsreader_700Bold',
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  xxl: 42,
};

// Soft, warm-tinted shadows. Neutral black shadows read as grey smudges
// against this palette, so every shadow is tinted toward the brown.
export const shadow = {
  soft: {
    shadowColor: '#4A3F2C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  card: {
    shadowColor: '#4A3F2C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  lifted: {
    shadowColor: '#4A3F2C',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
  },
};

// Small caps label used above headings.
export const eyebrow = {
  fontFamily: font.regular,
  fontSize: 12,
  letterSpacing: 1.6,
  textTransform: 'uppercase',
  color: colors.inkFaint,
};

// The floating nav bar overlaps the bottom of every tab screen.
// Screens reserve this much room so nothing hides underneath it.
export const NAV_CLEARANCE = 116;

export default { colors, font, radius, space, shadow, eyebrow, NAV_CLEARANCE };
