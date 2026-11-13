// Category palette shared by the home menu, sidebar and solo selection.
export const MENU_CATEGORY_COLORS = {
  play: '#E1EEDF',
  practice: '#FFF0D2',
  realDeals: '#DDE7F1',
  comingSoon: '#eceff2',
} as const;

export const MENU_ACTIVITY_COLORS = {
  tournaments: MENU_CATEGORY_COLORS.play,
  results: MENU_CATEGORY_COLORS.play,
  tables: MENU_CATEGORY_COLORS.play,
  duel: MENU_CATEGORY_COLORS.play,
  federation: MENU_CATEGORY_COLORS.realDeals,
  practice: MENU_CATEGORY_COLORS.practice,
} as const;

