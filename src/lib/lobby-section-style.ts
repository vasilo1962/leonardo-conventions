// Font sizes are based directly on the screen height; mobile uses responsiveHeightFontSize.
export const LOBBY_TITLE_FONT_RATIO = 0.024;
export const LOBBY_SECTION_FONT_RATIO = 0.023;
export const LOBBY_DATE_FONT_RATIO = 0.022;
export const LOBBY_ITEM_FONT_RATIO = 0.021;

// Shared section typography, spacing and separators used by Statistics and Teaching Place.
export function getLobbySectionStyle(fontSize: number, screenHeight: number) {
  return {
    gap: fontSize * 0.35,
    title: {color: '#0a3c6a', fontWeight: '700' as const, fontSize, lineHeight: fontSize * 1.60},
    divider: {height: screenHeight * 0.001, backgroundColor: '#cad6e3', marginVertical: fontSize * 0.8},
  };
}

// Shared shadow for lobby banners; shadow values are intentionally fixed.
export const LOBBY_BANNER_SHADOW = {
  shadowColor: '#000000', shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.28, shadowRadius: 9, elevation: 5,
} as const;
