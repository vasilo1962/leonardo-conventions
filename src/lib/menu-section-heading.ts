import { responsiveHeightFontSize } from '@/lib/interface-scale';

export function getMenuSectionHeadingMetrics(
  screenWidth: number,
  screenHeight: number,
  isMobile: boolean
) {
  const fontSize = responsiveHeightFontSize(
    screenHeight * 0.022,
    screenWidth,
    screenHeight,
    isMobile
  );
  const cardTitleFontSize = responsiveHeightFontSize(
    screenHeight * 0.020,
    screenWidth,
    screenHeight,
    isMobile
  );

  return {
    fontSize,
    lineHeight: fontSize * (18 / 16),
    letterSpacing: fontSize * (1.5 / 16),
    marginLeft: cardTitleFontSize * (18 / 16),
  };
}
